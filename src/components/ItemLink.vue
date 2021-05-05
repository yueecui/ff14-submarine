<template>
  <span class="item-link huiji-tt size-20" :data-name="item.ID" data-type="item" style="display: inline-block;">
    <a :href="'/wiki/物品:'+item['中文名']" target="_blank">
      <span class="item-icon size-20" style="display:inline-block;">
        <span class="item-icon--img"><img :src="item_icon" width="20" height="20"></span>
      </span>
      <span :class="['item-baseinfo', 'item-name', rarity_class(item['品质'])]">{{item['中文名']}}</span>
    </a>
  </span>
</template>
 
<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { getImageUrl } from '../module/util/getImageUrl';

@Options({
  props: {
    item: Object,
  }
})

export default class ItemLink extends Vue {
  item!: Record<string, any>;

  private readonly rarity_map: Record<number, string> = {
    1: 'rarity-common',
    2: 'rarity-uncommon',
    3: 'rarity-rare',
    4: 'rarity-epic',
    7: 'rarity-magic',
  }

  get item_icon() { return getImageUrl(this.item['图标ID']); }
  rarity_class(rarity: number) { return rarity > 1 ? this.rarity_map[rarity]: ''; }
}
</script>

