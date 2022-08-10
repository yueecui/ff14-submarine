<template>
    <div class="waypoint-block">
        <div class="explore-list">
            <table class="wikitable">
                <tr><th>探索地点</th></tr>
                <template v-for="p in currentWarpoints" :key="p.id">
                    <tr
                        ><td class="waypoint" :class="{ selected: isSelect(p.id) }"
                            ><div @click="toggleWP(p.id)"
                                ><i class="fa fa-check" aria-hidden="true" v-if="isSelect(p.id)"></i>
                                {{ p.code + ' ' + p.name }}</div
                            ></td
                        ></tr
                    >
                </template>
            </table>
        </div>
        <div class="explore-map">
            <table class="wikitable">
                <tr
                    ><th :colspan="2">{{ map_name }}</th></tr
                >
            </table>
            <div class="sea-map" :class="'map' + submarineStore.map">
                <div
                    class="base wp"
                    :style="{
                        left: submarineStore.startPoint!.x / 3 + 'px',
                        top: submarineStore.startPoint!.y / 3 + 'px',
                    }"
                ></div>
                <div
                    v-for="p in currentWarpoints"
                    class="wp"
                    :class="{ selected: isSelect(p.id) }"
                    :key="p.id"
                    @click="toggleWP(p.id)"
                    :style="{ left: p.x / 3 + 'px', top: p.y / 3 + 'px' }"
                    >{{ p.code }}</div
                >
            </div>
            <div class="ff14-btn-group" style="margin-top: 1em; text-align: center; width: 100%">
                <div class="ff14-btn" @click.prevent.stop="resetSelected()">重置</div>
                <div class="ff14-btn" @click.prevent.stop="changeMap()">切换地图</div>
            </div>
        </div>
        <div class="explore-drop">
            <table class="drop-map wikitable">
                <tr><th :colspan="2">获得物品</th></tr>
                <tr v-for="item in rewards" :key="item.ID">
                    <td class="drop-item-name" :style="{ width: item_name_length + 3 + 'em' }"
                        ><ItemLink :item="item"></ItemLink
                    ></td>
                    <td>
                        <ul class="hor-waypoints-list">
                            <li v-for="wp_id in item_drop_map[item.ID]" :key="wp_id" @click="toggleWP(wp_id)">
                                <div class="wp" :class="{ selected: isSelect(wp_id) }">{{
                                    currentWarpoints[wp_id].code
                                }}</div>
                            </li>
                        </ul>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { generateDropMap, getCurrentRewards } from '../module/Waypoint';
import { useSubmarineStore } from '../stores/submarine';
import ItemLink from './ItemLink.vue';

const submarineStore = useSubmarineStore();

const map_name = computed(() =>
    submarineStore.maps[submarineStore.map] ? submarineStore.maps[submarineStore.map].cn : '未知地图',
);
const currentWarpoints = computed(() => submarineStore.currentWarpoints);

const rewards = computed(() => getCurrentRewards(submarineStore.itemDB, submarineStore.currentWarpoints));
const item_drop_map = computed(() => generateDropMap(submarineStore.currentWarpoints));
const item_name_length = computed(() => {
    let item_name_length = 0;
    for (const reward of rewards.value) {
        if (reward['中文名'].length > item_name_length) {
            item_name_length = reward['中文名'].length;
        }
    }
    return item_name_length;
});

function isSelect(point_id: number) {
    return submarineStore.selected.includes(point_id);
}
function toggleWP(point_id: number) {
    submarineStore.toggleWaypoint(point_id);
}
function resetSelected() {
    submarineStore.resetSelected();
}
function changeMap() {
    submarineStore.changeMap();
}
</script>

<style lang="less">
.waypoint-block {
    overflow: hidden;
    margin: 0 auto;
    width: Calc(12em + 20em + 2em + 350px);

    > div {
        float: left;
    }
}

// 航点列表
.explore-list {
    width: 12em;
}

.waypoint {
    padding: 0 !important;

    > div {
        position: relative;
        padding: 0.2em 0.4em 0.2em 1.5em;
        &:hover {
            background-color: #311919;
            cursor: pointer;
        }

        > i.fa {
            position: absolute;
            top: 0.4em;
            left: 0.3em;
        }
    }
}

// 海图
.explore-map {
    margin: 0 1em;
}

.sea-map {
    position: relative;
    width: 350px;
    height: 350px;
    background-position: 3px 1px;

    &::before {
        position: absolute;
        width: 100%;
        height: 100%;
        background-position: 3px 1px;
        content: ' ';
    }

    &.map1 {
        background: url('@{ImageUrl}/ff14/uploads/f/f8/%E6%BA%BA%E6%B2%A1%E6%B5%B7%E5%9C%B0%E5%9B%BE.png');
        &::before {
            background: url('@{ImageUrl}/ff14/uploads/f/fe/%E6%BA%BA%E6%B2%A1%E6%B5%B7%E8%B7%AF%E7%BA%BF.png');
        }
    }
    &.map2 {
        background: url('@{ImageUrl}/ff14/uploads/a/a2/%E7%81%B0%E6%B5%B7%E5%9C%B0%E5%9B%BE.png');
        &::before {
            background: url('@{ImageUrl}/ff14/uploads/1/1a/%E7%81%B0%E6%B5%B7%E8%B7%AF%E7%BA%BF.png');
        }
    }
    &.map3 {
        background: url('@{ImageUrl}/ff14/uploads/4/48/%E7%BF%A0%E6%B5%AA%E6%B5%B7%E5%9C%B0%E5%9B%BE.png');
        &::before {
            background: url('@{ImageUrl}/ff14/uploads/6/6f/%E7%BF%A0%E6%B5%AA%E6%B5%B7%E8%B7%AF%E7%BA%BF.png');
        }
    }
    &.map4 {
        background: url('@{ImageUrl}/ff14/uploads/9/9a/%E5%A6%96%E6%AD%8C%E6%B5%B7%E5%9C%B0%E5%9B%BE.png');
        &::before {
            background: url('@{ImageUrl}/ff14/uploads/e/eb/%E5%A6%96%E6%AD%8C%E6%B5%B7%E8%B7%AF%E7%BA%BF.png');
        }
    }
}

.sea-map {
    .wp {
        position: absolute;
        width: 23px;
        height: 23px;
        border-color: #000;
        background: #079fe3;
        box-shadow: none;
        color: #000;

        &.base {
            background: #2553b7;
            cursor: auto;
        }

        &.selected {
            background: #0f0;
            color: #000 !important;
        }

        &:not(.base):hover {
            background: #fc3;
        }
    }
}

.explore-drop {
    overflow-y: auto;
    width: 20em;
    max-height: 550px;

    .drop-map {
        tr:hover td {
            background-color: #311919;
        }

        .drop-item-name {
            padding: 0.3em 0.4em !important;
        }
    }
}
</style>
