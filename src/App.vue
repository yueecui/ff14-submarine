<template>
  <Waypoint />
  <Statistics />
  <SubmarineSet />

  <div class="ff14-float-layers" v-if="layer > 0">
    <FloatLayerSetEditor v-if="layer === 1" />
    <FloatLayerSetFinder v-if="layer === 2" />
    <FloatLayerSetSpeed v-if="layer === 3" />
    <FloatLayerAddWaypoint v-if="layer === 4" />
    <FloatLayerAbout v-if="layer === 5" />
    <div class="float-layer-bg"></div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator';
import { mapState, mapGetters } from 'vuex';

import Waypoint from './components/Waypoint.vue';
import Statistics from './components/Statistics.vue';
import SubmarineSet from './components/SubmarineSet.vue';

import FloatLayerSetEditor from './components/FloatLayerSetEditor.vue';
import FloatLayerSetFinder from './components/FloatLayerSetFinder.vue';
import FloatLayerSetSpeed from './components/FloatLayerSetSpeed.vue';
import FloatLayerAddWaypoint from './components/FloatLayerAddWaypoint.vue';
import FloatLayerAbout from './components/FloatLayerAbout.vue';

import { findBestRoute } from './module/findBestRoute'

@Options({
  components: {
    Waypoint,
    Statistics,
    SubmarineSet,
    FloatLayerSetEditor,
    FloatLayerSetFinder,
    FloatLayerSetSpeed,
    FloatLayerAddWaypoint,
    FloatLayerAbout,
  },
  computed: {
    ...mapGetters([
      'currentWarpoints',
      'startPoint',
    ]),
    ...mapState([
      'version',
      'map',
      'selected',
      'speed',
      'sets',
      'layer',
    ])
  } 
})

export default class SubmarineTool extends Vue {
  version!: number;
  map!: number;
  selected!: Array<number>;
  speed!: number;
  sets!: Array<Array<number>>;
  layer!: number;

  currentWarpoints!: Record<number, Record<string, any>>;
  startPoint!: Record<string, any>;

  mounted(){
    // 设置定时器
    setInterval(() => {
        this.$store.commit('updateStartRealTime', Date.now());
    }, 5000);
    this.updateRouteInfo();
    // eslint-disable-next-line
    console.log('部队潜水艇工具 已加载 版本:' + this.version);
  }

  @Watch('layer')
  changeLayer(){
    if (this.layer === 0){
      document.querySelector('body')?.classList.remove('float-layer-show');
      document.querySelector('.huiji-css-hook')?.classList.remove('float-layer-show');
    }else{
      document.querySelector('body')?.classList.add('float-layer-show');
      document.querySelector('.huiji-css-hook')?.classList.add('float-layer-show');
    }
  }

  @Watch('map')
  @Watch('speed')
  @Watch('sets', {deep: true})
  saveLocalData(){ this.$store.commit('saveLocalData'); }

  @Watch('selected', {deep: true})
  selectedChange() {
    this.saveLocalData();
    this.updateRouteInfo();
  }

  updateRouteInfo(){
    this.$store.commit('setRouteInfo', findBestRoute(this.selected, this.startPoint, this.currentWarpoints));
  }
}
</script>

<style lang="less" src="./App.less"></style>
