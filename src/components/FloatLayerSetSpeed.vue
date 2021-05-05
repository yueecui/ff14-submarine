<template>
  <div class="set-speed-block float-layer">
    <div class="float-layer-title">选择预览速度</div>
    <div class="set-speed">
      <table class="wikitable">
        <tr><th style="width:5em;">速度</th><th style="width:10em;">探索时间</th><th style="width:10em;">回归时间</th></tr>
        <tr v-for="i in 40" @mousedown="setSpeed($event, i*5)" class="hover-block" :class="{selected: speed === i*5}" :key="i">
          <td>{{i * 5}}</td>
          <td>{{getRouteTimeCostText(i * 5)}}</td>
          <td>{{getRouteRealTimeText(i * 5)}}</td>
        </tr>
      </table>
    </div>
    <div class="ff14-btn-group" style="margin-top:1em">
      <div class="ff14-btn" @mousedown="close">关闭</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapState } from 'vuex';
import { getRouteTimeCostText, getRouteRealTimeText } from '../module/routeTimeText';

import { routeInfo } from '../types'

@Options({
  computed: {
    ...mapState([
      'speed',
      'startRealTime',
      'routeInfo',
    ])
  } 
})
export default class FloatLayerSetSpeed extends Vue {
  private speed!: number;
  private startRealTime!: number;
  private routeInfo!: routeInfo;

  setSpeed(event: MouseEvent, speed: number){
      if (event.button == 0){
        this.$store.commit('setSpeed', speed);
        this.$store.commit('setLayer', 0);
        event.preventDefault();
      }
  }

  close(event: MouseEvent) {
    if (event.button == 0){
      this.$store.commit('setLayer', 0);
      event.preventDefault();
    }
  }  

  getRouteTimeCostText(speed: number){
    return getRouteTimeCostText(this.routeInfo.time, speed);
  }
  
  getRouteRealTimeText(speed: number){
    return getRouteRealTimeText(this.startRealTime, this.routeInfo.time, speed);
  }
}
</script>
