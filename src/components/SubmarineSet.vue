<template>
  <div class="sets-block">
    <table class="sets-table wikitable" style="text-align:center;">
      <tr>
        <th style="width: 16%;">潜水艇</th>
        <th style="width: 8%;">探索<br>性能</th>
        <th style="width: 8%;">收集<br>性能</th>
        <th style="width: 8%;">巡航<br>速度</th>
        <th style="width: 8%;">航行<br>距离</th>
        <th style="width: 8%;">恩惠</th>
        <th style="width: 14%;">航行<br>时间</th>
        <th style="width: 10%;">探索<br>情况</th>
        <th style="width: 10%;">收集<br>情况</th>
        <th style="width: 10%;">额外<br>探索</th>
      </tr>
      <tr v-if="sets.length===0">
        <td colspan="10" style="text-align: left;">请添加或搜索潜水艇配置</td>
      </tr>
      <tr v-for="(set, i) in sets_data" :key="i" class="submarine-set" @mousedown="layerModSet($event, i)">
        <td style="text-align:left;">
          <div>
            <span class="submarine-name">{{set.n}}</span>
            <br>
            <span class="submarine-cname">{{set.c[0]}} {{set.c[1]}} {{set.c[2]}} {{set.c[3]}}</span>
          </div>
        </td>
        <td v-bind:class="{ ['r'+set.ms]: routeInfo.time > 0 }">{{set.st[1]}}</td>
        <td v-bind:class="{ ['r'+set.mr]: routeInfo.time > 0 }">{{set.st[2]}}</td>
        <td>{{set.st[3]}}</td>
        <td v-bind:class="{ r0:routeInfo.time > 0 && routeInfo.distance > set.st[4], r2:routeInfo.time > 0 && routeInfo.distance <= set.st[4] }">{{set.st[4]}}</td>
        <td v-bind:class="{ ['r'+set.mf]: routeInfo.time > 0 }">{{set.st[5]}}</td>
        <template v-if="routeInfo.time > 0">  <!-- 航行信息 -->
          <td>{{set.t}}</td>
          <td><span v-for="(c, i) in routeInfo.routeCode" :key="c" v-bind:class="'r'+set.s[i]">{{c}}</span></td>
          <td><span v-for="(c, i) in routeInfo.routeCode" :key="c" v-bind:class="'r'+set.r[i]">{{c}}</span></td>
          <td><span v-for="(c, i) in routeInfo.routeCode" :key="c" v-bind:class="'r'+set.f[i]">{{c}}</span></td>
        </template>
        <template v-else>
          <td v-for="i in 4" :key="i">&nbsp;</td>
        </template>
      </tr>
    </table>
  </div>
  <div class="ff14-btn-group" style="margin-top:1em;">
    <div class="ff14-btn" @mousedown="layerAddSet">添加</div>
    <div class="ff14-btn" @mousedown="layerFindSet">搜索</div>
    <div class="ff14-btn" style="float:right;" @mousedown="layerAbout">关于</div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapState } from 'vuex';
import { calcSetStatus } from '../module/calcSetStatus';
import { routeInfo } from '../types'

@Options({
  computed: {
    ...mapState([
      'sets',
      'routeInfo',
    ])
  } 
})
export default class SubmarineSet extends Vue {
  private sets!: Array<Array<number>>;
  private routeInfo!: routeInfo;

  get sets_data(){
    var sets_data = [];
    for (var i=0;i<this.sets.length;i++){
      var set = this.sets[i];
      sets_data.push(calcSetStatus(set, this.$store));
    }
    return sets_data;
  }

  layerModSet(event: MouseEvent, index: number) {
    if (event.button == 0){
      this.$store.commit('setLayer', 1);
      this.$store.commit('setEditorIndex', index);
      event.preventDefault();
    }
  }

  layerAddSet(event: MouseEvent) {
    if (event.button == 0){
      this.$store.commit('setLayer', 1);
      this.$store.commit('setEditorIndex', -1);
      event.preventDefault();
    }
  }

  layerFindSet(event: MouseEvent){
    if (event.button == 0){
      this.$store.commit('setLayer', 2);
      event.preventDefault();
    }
  }

  layerAbout(event: MouseEvent){
    if (event.button == 0){
      this.$store.commit('setLayer', 5);
      event.preventDefault();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="less" src="./SubmarineSet.less"></style>
