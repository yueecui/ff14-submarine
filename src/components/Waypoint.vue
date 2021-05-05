<template>
  <div class="waypoint-block">
    <div class="explore-list">
      <table class="wikitable">
        <tr><th>探索地点</th></tr>
        <template v-for="p in currentWarpoints" :key="p.id">
          <tr><td class="waypoint" :class="{selected: isSelect(p.id) }"><div @mousedown="toggleWP($event, p.id)"><i class="fa fa-check" aria-hidden="true" v-if="isSelect(p.id)"></i> {{ p.code + " " + p.name}}</div></td></tr>
        </template>
      </table>
    </div>
    <div class="explore-map">
      <table class="wikitable">
        <tr><th colspan="2">{{map_name}}</th></tr>
      </table>
      <div class="sea-map" :class="'map'+map">
        <div class="base wp" :style="{left:startPoint.x/3+'px', top:startPoint.y/3+'px'}"></div>
        <div v-for="p in currentWarpoints" class="wp" :class="{selected: isSelect(p.id) }" :key="p.id" @mousedown="toggleWP($event, p.id)" :style="{left:p.x/3+'px', top:p.y/3+'px'}">{{ p.code }}</div>
      </div>
      <div class="ff14-btn-group" style="margin-top:1em;text-align: center;width: 100%;">
        <div class="ff14-btn" @mousedown.prevent.stop="resetSelected()">重置</div>
        <div class="ff14-btn" @mousedown.prevent.stop="changeMap()">切换地图</div>
      </div>
    </div>
    <div class="explore-drop">
      <table class="drop-map wikitable">
        <tr><th colspan="2">获得物品</th></tr>
        <tr v-for="item in rewards" :key="item.ID">
          <td class="drop-item-name" :style="{width: (item_name_length+3)+'em'}"><ItemLink :item="item"></ItemLink></td>
          <td>
            <ul class="hor-waypoints-list">
              <li v-for="wp_id in item_drop_map[item.ID]" :key="wp_id" @mousedown="toggleWP($event, wp_id)">
                <div class="wp" :class="{selected: isSelect(wp_id) }">{{currentWarpoints[wp_id].code}}</div>
              </li>
            </ul>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapState, mapGetters } from 'vuex';
import ItemLink from './ItemLink.vue';
import { getCurrentRewards, generateDropMap } from '../module/Waypoint';

@Options({
  components: {
    ItemLink,
  },
  computed: {
    ...mapGetters([
      'currentWarpoints',
      'startPoint',
    ]),
    ...mapState([
      'map',
      'selected',
      'speed',
      'sets',
    ])
  } 
})
export default class Waypoint extends Vue {
  private map!: number;
  private selected!: Array<number>;
  private currentWarpoints!: Record<number, Record<string, any>>;
  private startPoint!: Record<string, any>;

  get map_name() { return this.$store.state.maps[this.map].cn; }
  get rewards() { return getCurrentRewards(this.$store.state.itemDB, this.currentWarpoints);}
  get item_drop_map() { return generateDropMap(this.currentWarpoints); }

  get item_name_length(){
    let item_name_length = 0;
    for (const reward of this.rewards){
        if (reward['中文名'].length > item_name_length){
            item_name_length = reward['中文名'].length;
        }
    }
    return item_name_length;
  }

  isSelect(point_id: number){ return this.selected.includes(point_id); }
  toggleWP(event: MouseEvent, point_id: number){
    if (event.button == 0){
      this.$store.commit('toggleWaypoint', point_id);
      event.preventDefault();
    }
  }
  resetSelected() { this.$store.commit('resetSelected'); }
  changeMap() { this.$store.commit('changeMap'); }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" src="./Waypoint.less"></style>
