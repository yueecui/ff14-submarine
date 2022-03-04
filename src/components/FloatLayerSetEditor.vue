<template>
  <div class="set-editor-block float-layer">
    <div class="float-layer-title">配置编辑器</div>
      <div class="set-name ff14-input">显示名称 <input type="text" name="set-name" v-model="editor_set[4]"></div>
      <table class="component-table wikitable">
        <tr><th style="width:9em;">级</th><th style="width:5em;" v-for="(name, i) in slotName" :key="name+i">{{name}}</th></tr>
        <tr v-for="(component, i) in components" :key="'component'+i">
          <th>{{component.n}}</th>
          <td v-for="j in 4" :key="j" class="hover-block" :class="{selected: i === editor_set[j-1]}" @mousedown="setComponent($event, j-1, i)">{{component.c}}</td>
        </tr>
      </table>
      <table class="status-table wikitable">
        <tr>
          <th style="width:4.5em;">位置</th>
          <th style="width:4.5em;">级别</th>
          <th style="width:5em;" v-for="(name, i) in attrName" :key="i">{{name}}</th>
        </tr>
        <tr v-for="i in 4" :key="i" :class="{ r0: editor_set[i-1] === -1 }">
          <th>{{slotName[i-1]}}</th>
          <template v-if="editor_set[i-1] > -1">
            <td>{{getComponent(editor_set[i-1]).c}}</td>
            <td v-for="j in 6" :key="j">{{getComponent(editor_set[i-1]).s[i-1][j-1]}}</td>
          </template>
          <template v-else>
            <td>无</td>
            <td v-for="j in 6" :key='j'>0</td>
          </template>
        </tr>
        <tr><th :colspan="2">{{maxRank}}级奖励属性</th><td v-for="(bonus_v, i) in maxRankBonus" :key="i">{{bonus_v}}</td></tr>
        <tr :class="{ r0:!editorSetStatus.v }"><th :colspan="2">总计</th>
          <td>{{editorSetStatus.st[0]}}</td>
          <td :class="{ ['r'+editorSetStatus.ms]: routeInfo.time > 0 }">{{editorSetStatus.st[1]}}</td>
          <td :class="{ ['r'+editorSetStatus.mr]: routeInfo.time > 0 }">{{editorSetStatus.st[2]}}</td>
          <td>{{editorSetStatus.st[3]}}</td>
          <td :class="{ r0:routeInfo.time > 0 && routeInfo.distance > editorSetStatus.st[4], r2:routeInfo.time > 0 && routeInfo.distance <= editorSetStatus.st[4] }">{{editorSetStatus.st[4]}}</td>
          <td :class="{ ['r'+editorSetStatus.mf]: routeInfo.time > 0 }">{{editorSetStatus.st[5]}}</td>
        </tr>
      </table>
      <table class="explore-preview-table wikitable" v-if="routeInfo.time > 0">
        <tr>
          <th style="width:9em;">探索路线</th>
          <td style="width:10em;text-align:left;">
            <ul class="hor-waypoints-list no-hover">
              <li v-for="wp_code in routeInfo.routeCode" :key="wp_code"><div class="wp selected">{{wp_code}}</div></li>
            </ul>
          </td>
        </tr>
        <tr><th>探索距离</th><td style="text-align:left;" :class="{ r0:routeInfo.time > 0 && routeInfo.distance > editorSetStatus.st[4], r2:routeInfo.time > 0 && routeInfo.distance <= editorSetStatus.st[4] }">{{routeInfo.distance}} / {{editorSetStatus.st[4]}}</td></tr>
        <tr><th>探索时间</th><td style="text-align:left;">{{getRouteTimeCostText(editorSetStatus.st[3])}}</td></tr>
        <tr><th>回归时间</th><td style="text-align:left;">{{getRouteRealTimeText(editorSetStatus.st[3])}}</td></tr>
        <tr><th>探索情况</th><td style="text-align:left;"><span v-for="(code, i) in routeInfo.routeCode" :key="code" :class="'r'+editorSetStatus.s[i]">{{code}}</span> / 需要:<span class="r2">{{routeInfo.max_surveillance}}</span></td></tr>
        <tr><th>收集情况</th><td style="text-align:left;"><span v-for="(code, i) in routeInfo.routeCode" :key="code" :class="'r'+editorSetStatus.r[i]">{{code}}</span> / 需要:<span class="r2">{{routeInfo.max_retrieval}}</span></td></tr>
        <tr><th>额外探索</th><td style="text-align:left;"><span v-for="(code, i) in routeInfo.routeCode" :key="code" :class="'r'+editorSetStatus.f[i]">{{code}}</span> / 需要:<span class="r2">{{routeInfo.max_favor}}</span></td></tr>
    </table>
    <div class="ff14-btn-group">
      <div class="ff14-btn" :class="{disable:!editorSetStatus.v}" @mousedown="btnSaveSet">保存</div>
      <div class="ff14-btn" @mousedown="btnClose">取消</div>
      <div class="ff14-btn" v-if="editor_index > -1" @mousedown="btnDeleteSet">删除</div>                             
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapState } from 'vuex';

import { getRouteTimeCostText, getRouteRealTimeText } from '../module/routeTimeText';
import { calcSetStatus } from '../module/calcSetStatus'

import { routeInfo } from '../types'

@Options({
  computed: {
    ...mapState([
      'slotName',
      'attrName',
      'sets',
      'components',
      'maxRank',
      'maxRankBonus',
      'routeInfo',
      'startRealTime',
      'editor_index',
    ])
  } 
})
export default class FloatLayerSetEditor extends Vue {
  slotName!: Array<string>;
  attrName!: Array<string>;
  sets!: Array<Array<number|string>>;
  components!: Array<Record<string, any>>;
  maxRank!: number;
  maxRankBonus!: Array<number>;
  routeInfo!: routeInfo;
  startRealTime!: number;
  editor_index!: number;

  editor_set: Array<number|string> = [-1, -1, -1, -1, ''];   // 编辑中的组合

  mounted(){
    if (this.editor_index == -1){
      this.editor_set = [-1, -1, -1, -1, ''];
    }else{
      this.editor_set = this.sets[this.editor_index].slice();
    }
  }

  get editorSetStatus() {
    const temp =  calcSetStatus(this.editor_set, this.$store);
    return temp;
  }

  getRouteTimeCostText(speed: number){
    return getRouteTimeCostText(this.routeInfo.time, speed);
  }

  getRouteRealTimeText(speed: number){
    return getRouteRealTimeText(this.startRealTime, this.routeInfo.time, speed);
  }

  getComponent(id: number|string){
    if (typeof(id) == 'string'){
      // 不会发生
      console.error('id is string');
      return {}
    }
    return this.components[id];
  }

  btnClose(event: MouseEvent) {
    if (event.button > 0){
      return
    }
    this.$store.commit('setLayer', 0);
    event.preventDefault();
  }

  setComponent(event: MouseEvent, slot:number, rank:number){
    if (event.button > 0){
      return;
    }
    if (this.editor_set[slot] == rank){
        this.editor_set.splice(slot, 1, -1);
    }else{
        this.editor_set.splice(slot, 1, rank);
    }
  }

  btnSaveSet(event: MouseEvent){
    if (event.button > 0){
      return;
    }
    if (this.editorSetStatus.v){
      this.$store.commit('addSet', {
        setStatus: this.editorSetStatus,
        index: this.editor_index,
      })
      this.$store.commit('setLayer', 0);
      event.preventDefault();
    }                
  }

  btnDeleteSet(event: MouseEvent){
    if (event.button > 0){
      return;
    }
    this.$store.commit('deleteSet', this.editor_index);
    this.$store.commit('setLayer', 0);
    event.preventDefault();
  }
  
}
</script>

<style lang="less" src="./FloatLayerSetEditor.less"></style>
