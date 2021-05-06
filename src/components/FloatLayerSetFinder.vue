<template>
  <div class="set-finder-block float-layer">
    <div class="float-layer-title">配置搜索器</div>
    <div class="finder-option ff14-input">
      <table>
        <tr v-for="(name, i) in attrName" :key="i">
          <th>{{name}}</th>
          <td><input type="text" v-model.number="set_filter[i]"></td>
        </tr>
      </table>
    </div>
    <div class="ff14-btn-group" style="margin-top:1em">
      <div class="ff14-btn" @mousedown="close">关闭</div>
    </div>            
      <template v-if="valid_sets.length > 0">
        <p>共有 {{valid_sets.length}} 条符合的记录。<template v-if="valid_sets.length > maxFilterCount">最多显示 {{maxFilterCount}} 条记录，请缩小查询范围。</template></p>
        <table class="sets-table wikitable" v-if="valid_sets.length <= maxFilterCount">
          <tr>
            <th style="width:12em;">配置</th>
            <th v-for="(name, i) in attrName" :key="i" style="width:5em;" class="hover-block" @mousedown="sortByAttr(i)" :class="sortTitleColor(i)">{{name}}</th>
            <th style="width:5em;">操作</th>
          </tr>
          <tr v-for="(set, i) in valid_sets" :key="i" class="hover-block" @mousedown="checkAndAddSet($event, set)">
            <td><div class="set-code"><span>{{set.c[0]}}</span><span>{{set.c[1]}}</span><span>{{set.c[2]}}</span><span>{{set.c[3]}}</span></div></td>
            <td v-for="(st_v, i) in set.st" :key="i">{{st_v}}</td>
            <td class="selected" v-if="checkSet(set)">已添加</td>
            <td class="add-set" v-else>添加</td>
          </tr>
        </table>
      </template>
      <p v-else>没有找到符合条件的记录，请修改查询范围。</p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { mapState } from 'vuex';

@Options({
  computed: {
    ...mapState([
      'attrName',
      'all_sets',
      'sets',
      'maxFilterCount',
    ])
  } 
})
export default class FloatLayerSetFinder extends Vue {
  private attrName!: Array<string>;
  private all_sets!: Array<Record<string, any>>;
  private sets!: Array<Array<number|string>>;
  private maxFilterCount!: number;
  private set_filter = [0, 0, 0, 0, 0, 0]; // 搜索用过滤器
  private filter_sort = [-1, -1];  // 第一个参数是用哪个属性排序，第二个参数是正序还是逆序

  mounted(){
    this.$store.commit('initAllSets');
  }

  close(event: MouseEvent) {
    if (event.button > 0){
      return
    }
    this.$store.commit('setLayer', 0);
    event.preventDefault();
  }

  get valid_sets() {
    let valid_sets = this.all_sets.filter((set) => {
      if (!set.v) {return false;}
      for (let i=0;i<this.set_filter.length;i++){
        if (this.set_filter[i] > 0 && set.st[i] < this.set_filter[i]){
          return false;
        }
      }
      return true;
    });
    if (this.filter_sort[0] > -1){
      let filter_sort = this.filter_sort;
      valid_sets = valid_sets.sort(function(a, b){
        if (filter_sort[1] === 1){
          return b.st[filter_sort[0]] - a.st[filter_sort[0]];
        }else{
          return a.st[filter_sort[0]] - b.st[filter_sort[0]];
        }
      });
    }
    return valid_sets;
  }

  checkSet(c_set: Record<string, any>){  // 检查配置是否已经有存在的
    for (let i=0;i<this.sets.length;i++){
      const set = this.sets[i];
      if (c_set.set[0] == set[0] &&
          c_set.set[1] == set[1] &&
          c_set.set[2] == set[2] &&
          c_set.set[3] == set[3]){
        return true;
      }
    }
    return false;
  }

  checkAndAddSet(event: MouseEvent, set: Record<string, any>){
    if (event.button > 0){
      return
    }
    if (!this.checkSet(set)){
      this.$store.commit('addSet', {
        setStatus: set,
        index: -1,
      })
    }else{
      console.log('已经存在');
    }
  }
                
  sortByAttr(attr_index: number){
    if (this.filter_sort.length < 2) {this.filter_sort = [-1, -1];}
    if (this.filter_sort[0] !== attr_index){
        this.filter_sort = [attr_index, 1];
    }else{
        this.filter_sort.splice(1, 1, this.filter_sort[1] * -1);
    }
  }

  sortTitleColor(attr_index: number){
    if (this.filter_sort[0] === attr_index){
      if (this.filter_sort[1] === 1){
        return 'r2';
      }else{
        return 'r0';
      }
    }else{
      return '';
    }
  }
}
</script>

<style lang="less" src="./FloatLayerSetFinder.less"></style>
