import { acceptHMRUpdate, defineStore } from 'pinia';
import { store } from '.';
import { DEFAULT_MAP, LOCAL_STOREAGE_KEY } from '../constant/name';
import { calcSetBaseStatus } from '../module/calcSetStatus';
import { getSubmarineData } from '../module/getSubmarineData';
import { SubmarineComponent } from '../objects/component';
import type { DataSourceInfo, ItemInfo, PointInfo, SeaInfo } from '../types/ff14data';
import type { routeInfo } from '../types/routeInfo';
import type { SetStatus } from '../types/submarineSet';

export interface SetInfo {
    set: number[];
    name: string;
}

export const useSubmarineStore = defineStore({
    id: 'submarine',
    state: () => ({
        // 从lua推出的数据中获取的内容
        version: 0,
        dataSources: [] as DataSourceInfo[],
        maxFilterCount: 300, // 搜索时最大过滤器数量，会读取配置，不要太大影响性能

        components: [] as SubmarineComponent[], // 船体零件
        maps: {} as Record<number, SeaInfo>, // 海图名称和基本信息
        waypointData: {} as Record<number, Record<number, PointInfo>>, // 航点数据
        itemDB: {} as Record<number, ItemInfo>, // 用到的物品数据
        rewards: {} as Record<number, string>, // 奖励类型名称

        maxRank: 0, // 船最大等级
        maxRankBonus: [] as number[], // 船最大等级时的属性奖励

        // 会保存到localstorage的临时数据
        map: DEFAULT_MAP, // 当前地图
        selected: [] as number[], // 当前选中的航点
        speed: 100, // 当前预览时使用的速度
        sets: [] as SetInfo[], // 存储的船体组合，每个数据是4个数据（代表船体零件编号，和一个名字字符串）

        // 其他临时数据
        layer: 0, // 浮层显示
        routeInfo: {
            routeOrder: [], // 航线顺序 r
            routeCode: [], // 航线代码 rc
            time: 0, // 航线时间 t
            distance: 0, // 航线距离 d
            max_surveillance: 0, // 最大需要的探索 ms
            max_retrieval: 0, // 最大需要的收集 mr
            max_favor: 0, // 最大需要的恩惠 mf
        } as routeInfo,
        startRealTime: Date.now(), // 用于计算出发时间的现实时间基数，每秒刷新5次

        // 编辑器用临时变量
        editor_index: -1, // 当前编辑的序号  -1为新增
        // 搜索器用变量
        all_sets: [] as SetStatus[], // 全配置，初次使用时再初始化
    }),
    getters: {
        currentWarpoints: (state) => {
            return state.waypointData[state.map];
        },
        startPoint: (state) => {
            if (state.maps[state.map]) {
                return state.maps[state.map].info;
            }
            return null;
        },
    },
    actions: {
        // 读取/保存配置
        // 更新LocalStorage数据
        saveLocalData() {
            const ls_data = {
                map: this.map,
                selected: this.selected,
                speed: this.speed,
                sets: this.sets,
                ver: this.version,
            };
            localStorage.setItem(LOCAL_STOREAGE_KEY, JSON.stringify(ls_data));
        },

        // 获取LocalStorage数据
        loadLocalData() {
            const ls_str = localStorage.getItem(LOCAL_STOREAGE_KEY);
            let ls_data = ls_str ? JSON.parse(ls_str) : {};
            if (!ls_data.ver) ls_data = {};
            this.map = ls_data.map ? ls_data.map : DEFAULT_MAP;
            this.selected = ls_data.selected ? ls_data.selected : [];
            this.speed = ls_data.speed ? ls_data.speed : 100;
            this.sets = ls_data.sets ? ls_data.sets : [];
        },
        // 从网页提供的原数据中初始化
        initAllData() {
            const allData = getSubmarineData();
            // 基础信息
            this.version = allData.tool_version;
            this.dataSources = allData.data_sources;
            this.maxFilterCount = allData.max_filter_count;

            // 游戏数据
            this.components = allData.components.map((component) => {
                return new SubmarineComponent(component);
            });
            this.maps = (() => {
                const startPoints = allData.point_data.filter((point) => point.start);
                const maps = {} as Record<number, SeaInfo>;
                startPoints.forEach((point) => {
                    if (allData.sea_name_map[point.map - 1] === undefined) {
                        console.error(`地图${point.map}不存在`);
                        return;
                    }
                    maps[point.map] = {
                        ...allData.sea_name_map[point.map - 1],
                        info: point,
                    };
                });
                return maps;
            })();
            this.rewards = allData.reward_category_map;
            this.maxRank = allData.max_rank;
            this.maxRankBonus = allData.max_rank_bonus;
            this.waypointData = (() => {
                const wpData = allData.point_data.filter((point) => !point.start);
                const wp = {} as Record<number, Record<number, PointInfo>>;
                wpData.forEach((point) => {
                    if (wp[point.map] === undefined) {
                        wp[point.map] = {};
                    }
                    wp[point.map][point.id] = point;
                });
                return wp;
            })();
            this.itemDB = allData.item_db;
        },
        toggleWaypoint(point_id: number) {
            const index = this.selected.indexOf(point_id);
            if (index > -1) {
                this.selected.splice(index, 1);
            } else {
                if (this.selected.length < 5) {
                    this.selected.push(point_id);
                }
            }
        },
        updateStartRealTime(timestamp: number) {
            this.startRealTime = timestamp;
        },
        resetSelected() {
            this.selected = [];
        },
        changeMap() {
            this.map += 1;
            if (this.map > Object.keys(this.maps).length) {
                this.map = 1;
            }
            this.selected = [];
        },
        setLayer(layerId: number) {
            this.layer = layerId;
        },
        setRouteInfo(routeInfo: routeInfo) {
            this.routeInfo = routeInfo;
        },
        setSpeed(speed: number) {
            this.speed = speed;
        },
        setEditorIndex(index: number) {
            this.editor_index = index;
        },
        // 初始化所有set组合，首次打开查找窗口时初始化
        initAllSets() {
            if (this.all_sets.length == 0) {
                for (let c1 = 0; c1 < this.components.length; c1++) {
                    for (let c2 = 0; c2 < this.components.length; c2++) {
                        for (let c3 = 0; c3 < this.components.length; c3++) {
                            for (let c4 = 0; c4 < this.components.length; c4++) {
                                this.all_sets.push(
                                    calcSetBaseStatus({
                                        set: [c1, c2, c3, c4],
                                        name: '',
                                    }),
                                );
                            }
                        }
                    }
                }
            }
        },
        // 添加套装
        addSet(payload: { setStatus: SetStatus; index: number }) {
            const { setStatus, index } = payload;
            if (setStatus.v) {
                if (!setStatus.n || setStatus.n == '') {
                    setStatus.n = '未命名';
                }
                if (index === -1) {
                    this.sets.push({
                        set: setStatus.set,
                        name: setStatus.n,
                    });
                } else {
                    this.sets.splice(index, 1, {
                        set: setStatus.set,
                        name: setStatus.n,
                    });
                }
            }
        },
        // 删除套装
        deleteSet(index: number) {
            if (this.sets.length >= index) {
                this.sets.splice(index, 1);
            }
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useSubmarineStore, import.meta.hot));
}

// 用于在vue setup外部获取该仓库
export function useSubmarineStoreWithoutSetup() {
    return useSubmarineStore(store);
}
