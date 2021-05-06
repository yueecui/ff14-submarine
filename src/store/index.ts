import { createStore } from 'vuex'

import { luaTableToArray } from '../module/util/luaTableToArray'
import { preprocessComponents, preprocessWaypoints } from '../module/dataPreprocess'
import { calcSetBaseStatus } from '../module/calcSetStatus'

import { routeInfo } from '../types'

export default createStore({
  state: {
    // 写死在本页中的数据
    localStorageKey: 'submarine-tool',
    author: '葵千花@萌芽池',

    slotName: ['船体', '船尾', '船首', '舰桥'],
    attrName: ['重量', '探索性能', '收集性能', '巡航速度', '航行距离', '恩惠'],

    // 从lua推出的数据中获取的内容
    version: 0,
    dataSources: [] as Array<Record<string, any>>,
    maxFilterCount: 300,  // 搜索时最大过滤器数量，会读取配置，不要太大影响性能

    components: [] as Array<Record<string, any>>,  // 船体零件
    maps: {} as Record<number, any>, // 海图名称
    waypointData: {} as Record<number, Record<number, Record<string, any>>>,  // 航点数据
    itemDB: {} as Record<number, Record<string, any>>,  // 用到的物品数据
    rewards: {} as Record<number, any>,  // 奖励类型名称

    maxRank: 0,  // 船最大等级
    maxRankBonus: [] as Array<number>,  // 船最大等级时的属性奖励

    // 会保存到localstorage的临时数据
    map: 3,  // 当前地图
    selected: [] as Array<number>,  // 当前选中的航点
    speed: 100,  // 当前预览时使用的速度
    sets: [] as Array<Array<number|string>>, // 存储的船体组合，每个数据是4个数据（代表船体零件编号，和一个名字字符串）

    // 其他临时数据
    layer: 0, // 浮层显示
    routeInfo: {
        routeOrder: [], // 航线顺序 r
        routeCode: [],  // 航线代码 rc
        time: 0,  // 航线时间 t
        distance: 0,  // 航线距离 d
        max_surveillance: 0, // 最大需要的探索 ms
        max_retrieval: 0, // 最大需要的收集 mr
        max_favor: 0, // 最大需要的恩惠 mf
    } as routeInfo,
    startRealTime: Date.now(),  // 用于计算出发时间的现实时间基数，每秒刷新5次

    // 编辑器用临时变量
    editor_index: -1,  // 当前编辑的序号  -1为新增
    editor_set: [-1, -1, -1, -1, ''],  // 编辑中的组合
    // 搜索器用变量
    all_sets: [] as Array<Record<string, any>>, // 全配置
    set_filter: [0, 0, 0, 0, 0, 0], // 搜索用过滤器
    filter_sort: [-1, -1],  // 第一个参数是用哪个属性排序，第二个参数是正序还是逆序
  },
  getters: {
    currentWarpoints: (state): Record<number, Record<string, any>> => {
      return state.waypointData[state.map];
    },
    startPoint: (state) :Record<string, any> => {
      if (state.maps[state.map]){
        return state.maps[state.map].info;
      }else{
        return {}
      }
    }
  },  
  mutations: {
    // 读取/保存配置
    // 更新LocalStorage数据
    saveLocalData: (state) => {
      const ls_data = {
          map: state.map,
          selected: state.selected,
          speed: state.speed,
          sets: state.sets,
      }
      localStorage.setItem(state.localStorageKey, JSON.stringify(ls_data));
    },

    // 获取LocalStorage数据
    loadLocalData: (state) => {
      const ls_str = localStorage.getItem(state.localStorageKey);
      const ls_data = ls_str ? JSON.parse(ls_str) : {};
      state.map = ls_data.map ? ls_data.map : 3;
      state.selected = ls_data.selected ? ls_data.selected : [];
      state.speed = ls_data.speed ? ls_data.speed : 100;
      state.sets = ls_data.sets ? ls_data.sets : [];
    },

    initAllData: (state, all_data) => {
      // 基础信息
      state.version = all_data.tool_version;
      state.dataSources = luaTableToArray(all_data.data_sources);
      state.maxFilterCount = all_data.max_filter_count;

      // 计算用数据
      state.components  = preprocessComponents(all_data);
      state.maps = all_data.sea_name_map;
      state.rewards = all_data.reward_category_map;
      state.maxRank = all_data.max_rank;
      state.maxRankBonus = luaTableToArray(all_data.max_rank_bonus);
      state.waypointData  = preprocessWaypoints(all_data, state.maps);
      state.itemDB = all_data.item_db

      
    },
    toggleWaypoint: (state, point_id: number) => {
      const index = state.selected.indexOf(point_id);
      if (index > -1){
        state.selected.splice(index, 1);
      }else{
        if (state.selected.length < 5){
          state.selected.push(point_id);
        }
      }
    },
    updateStartRealTime: (state, timestamp) => {
      state.startRealTime = timestamp;
    },
    resetSelected: (state) =>{
      state.selected = [];
    },
    changeMap: (state) => {
        state.map += 1;
        if (state.map > 3){
            state.map = 1;
        }
        state.selected = [];
    },
    setLayer: (state, layerId) => {
      state.layer = layerId;
    },
    setRouteInfo: (state, routeInfo) => {
      state.routeInfo = routeInfo;
    },
    setSpeed: (state, speed) => {
      state.speed = speed
    },
    setEditorParams: (state, payload) => {
      state.editor_index = payload.index;
      state.editor_set = payload.set;
    },
    // 初始化所有set组合，首次打开查找窗口时初始化
    initAllSets: (state) => {
      if (state.all_sets.length == 0){
        if (state.all_sets.length === 0){
          for (let c1=0;c1<state.components.length;c1++){
            for (let c2=0;c2<state.components.length;c2++){
              for (let c3=0;c3<state.components.length;c3++){
                for (let c4=0;c4<state.components.length;c4++){
                  state.all_sets.push(calcSetBaseStatus([c1, c2, c3, c4], state.maxRankBonus, state.components));
                }
              }
            }
          }
        }
      }
    },
    // 添加套装
    addSet: (state, payload) => {
      const { setStatus, index } = payload;
      const set = setStatus.set;
      if (setStatus.v){
        if (!set[4] || set[4] == ''){
          set[4] = '未命名';
        }
        if (index === -1){
          state.sets.push(set.slice());
        }else{
          state.sets.splice(index, 1, set.slice());
        }
      }
    },
  },
  actions: {
  },
  modules: {
  }
})
