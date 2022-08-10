<template>
    <span class="item-link huiji-tt size-20" :data-name="item.ID" data-type="item" style="display: inline-block">
        <a :href="'/wiki/物品:' + item['中文名']" target="_blank">
            <span class="item-icon size-20" style="display: inline-block">
                <span class="item-icon--img"><img :src="item_icon" width="20" height="20" /></span>
            </span>
            <span :class="['item-baseinfo', 'item-name', rarity_class(item['品质'])]">{{ item['中文名'] }}</span>
        </a>
    </span>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getFF14IconUrl } from '../module/util/getImageUrl';
import type { ItemInfo } from '../types/ff14data';

const props = defineProps<{
    item: ItemInfo;
}>();

const rarity_map: Record<number, string> = {
    1: 'rarity-common',
    2: 'rarity-uncommon',
    3: 'rarity-rare',
    4: 'rarity-epic',
    7: 'rarity-magic',
};

const item_icon = computed(() => getFF14IconUrl(props.item['图标ID']));

function rarity_class(rarity: number) {
    return rarity > 1 ? rarity_map[rarity] : '';
}
</script>
