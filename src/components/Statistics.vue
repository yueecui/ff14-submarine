<template>
  <div class="statistics-block">
    <table class="statistics-table wikitable">
      <tr><th :colspan="7">最短路线情报</th></tr>
      <template v-if="selected.length > 0">
        <tr>
          <th>目的地顺序</th>
          <td :colspan="4">
            <ul class="hor-waypoints-list">
              <li v-for="wp_id in routeInfo.routeOrder" :key="wp_id" @mousedown="toggleWP($event, wp_id)">
                <div class="wp selected">{{currentWarpoints[wp_id].code}}</div>
              </li>
              <li v-if="selected.length < 5">
                <div class="wp btn-red" @mousedown="layerAddWP"><i class="fa fa-plus" aria-hidden="true"></i></div>
              </li>
            </ul>
          </td>
          <th>最大探索需求</th>
          <td class="r2">{{routeInfo.max_surveillance}}</td>
        </tr>
        <tr>
          <th>航行距离</th>
          <td :colspan="2">{{routeInfo.distance}}</td>
          <th>预览速度</th>
          <td>{{speed}} <i class="fa fa-pencil-square btn-red" aria-hidden="true" @mousedown="layerSetSpeed"></i></td>
          <th>最大收集需求</th>
          <td class="r2">{{routeInfo.max_retrieval}}</td>
        </tr>
        <tr>
          <th>航行时间预览</th>
          <td :colspan="2">{{routeTimeCostText}}</td>
          <th>回归时间</th>
          <td>{{routeRealTimeText}}</td>
          <th>最大恩惠需求</th>
          <td class="r2">{{routeInfo.max_favor}}</td>
        </tr>
        <tr>
          <th :colspan="7">沿途目的地情报</th>
        </tr>
        <tr>
          <th style="width: 16%;">目的地</th>
          <th style="width: 9%;">探索需求</th>
          <th style="width: 9%;">收集需求</th>
          <th style="width: 9%;">恩惠需求</th>
          <th style="width: 19%;">探索物品<span class="r0">（低）</span></th>
          <th style="width: 19%;">探索物品<span class="r1">（中）</span></th>
          <th style="width: 19%;">探索物品<span class="r2">（高）</span></th>
        </tr>
        <tr v-for="w in routeInfo.routeOrder" v-bind:key="w">
          <td>{{currentWarpoints[w].code + ' ' + currentWarpoints[w].name}}</td>
          <td style="text-align:center;"><span class="r1">{{currentWarpoints[w].statReq.surveillance.mid}}</span>&nbsp;/&nbsp;<span class="r2">{{currentWarpoints[w].statReq.surveillance.high}}</span></td>
          <td style="text-align:center;"><span class="r1">{{currentWarpoints[w].statReq.retrieval.optim}}</span>&nbsp;/&nbsp;<span class="r2">{{currentWarpoints[w].statReq.retrieval.optim}}</span></td>
          <td style="text-align:center;"><span class="r2">{{currentWarpoints[w].statReq.favor}}</span></td>
          <td><div v-for="item_id in currentWarpoints[w].drop.low" :key="'low'+item_id"><ItemLink :item="itemDB[item_id]" /></div></td>
          <td><div v-for="item_id in currentWarpoints[w].drop.mid" :key="'mid'+item_id"><ItemLink :item="itemDB[item_id]" /></div></td>
          <td><div v-for="item_id in currentWarpoints[w].drop.high" :key="'high'+item_id"><ItemLink :item="itemDB[item_id]" /></div></td>
        </tr>
      </template>
      <tr v-else><td :colspan="7">请选择希望探索的目的地</td></tr>
    </table>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapState, mapGetters } from 'vuex';
import ItemLink from './ItemLink.vue';
import { getRouteTimeCostText, getRouteRealTimeText } from '../module/routeTimeText';

import { routeInfo } from '../types'

@Options({
  components: {
    ItemLink,
  },
  computed: {
    ...mapGetters([
      'currentWarpoints',
    ]),
    ...mapState([
      'selected',
      'speed',
      'startRealTime',
      'routeInfo',
      'itemDB',
    ])
  } 
})
export default class Statistics extends Vue {
  selected!: Array<number>;
  speed!: number;
  startRealTime!: number;
  routeInfo!: routeInfo;
  itemDB!: Record<number, Record<string, any>>;
  
  currentWarpoints!: Record<number, Record<string, any>>;

  get routeTimeCostText(){
    return getRouteTimeCostText(this.routeInfo.time, this.speed);
  }
  
  get routeRealTimeText(){
    return getRouteRealTimeText(this.startRealTime, this.routeInfo.time, this.speed);
  }

  layerAddWP(event: MouseEvent) {
    if (event.button == 0){
      this.$store.commit('setLayer', 4);
      event.preventDefault();
    }
  }

  layerSetSpeed(event: MouseEvent){
    if (event.button == 0){
      this.$store.commit('setLayer', 3);
      event.preventDefault();
    }
  }

  toggleWP(event: MouseEvent, point_id: number){
    if (event.button == 0){
      this.$store.commit('toggleWaypoint', point_id);
      event.preventDefault();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" src="./Statistics.less"></style>
