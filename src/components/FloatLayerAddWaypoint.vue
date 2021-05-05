<template>
  <div class="add-waypoint-block float-layer">
    <div class="float-layer-title">按时间预览调整航线</div>
    <div class="add-waypoint">
      <table class="wikitable" style="text-align: left;">
        <tr><th style="width:10em;">航点</th><th style="width:10em;">航行时间</th><th style="width:10em;">回归时间</th></tr>
        <tr v-for="wp in currentWarpoints" @mousedown="toggleWP($event, wp.id)" class="hover-block" :class="{selected:selected.includes(wp.id)}" :key="wp.id">
          <td>{{ wp.code + " " + wp.name}}</td>
          <td class="selected" style="text-align: center;" colspan="2" v-if="selected.includes(wp.id)">已添加</td>
          <template v-else>
            <td>{{getSimRouteTimeCostText(wp.id)}}</td>
            <td>{{getSimRouteRealTimeText(wp.id)}}</td>
          </template>
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
import { mapState, mapGetters } from 'vuex';
import { getRouteTimeCostText, getRouteRealTimeText } from '../module/routeTimeText';

import { findBestRoute } from '../module/findBestRoute'

@Options({
  computed: {
    ...mapGetters([
      'startPoint',
      'currentWarpoints',
    ]),
    ...mapState([
      'selected',
      'speed',
      'startRealTime',
    ])
  } 
})
export default class FloatLayerAddWaypoint extends Vue {
  private selected!: Array<number>;
  private speed!: number;
  private startRealTime!: number;
  
  private currentWarpoints!: Record<number, Record<string, any>>;
  private startPoint!: Record<string, any>;

  toggleWP(event: MouseEvent, point_id: number){
    if (event.button == 0){
      this.$store.commit('toggleWaypoint', point_id);
      event.preventDefault();
    }
  }

  close(event: MouseEvent) {
    if (event.button == 0){
      this.$store.commit('setLayer', 0);
      event.preventDefault();
    }
  }

  getSimRouteTimeCostText(new_wp_id: number){
      const temp_route_group = this.selected.slice();
      temp_route_group.push(new_wp_id);
      const temp_best_route = findBestRoute(temp_route_group, this.startPoint, this.currentWarpoints);
      return getRouteTimeCostText(temp_best_route.time, this.speed);
  }
  getSimRouteRealTimeText(new_wp_id: number){
      var temp_route_group = this.selected.slice();
      temp_route_group.push(new_wp_id);
      const temp_best_route = findBestRoute(temp_route_group, this.startPoint, this.currentWarpoints);
      return getRouteRealTimeText(this.startRealTime, temp_best_route.time, this.speed);
  }
}
</script>
