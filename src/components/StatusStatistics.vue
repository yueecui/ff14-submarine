<template>
    <div class="statistics-block">
        <table class="statistics-table wikitable">
            <tr><th :colspan="7">最短路线情报</th></tr>
            <template v-if="submarineStore.selected.length > 0">
                <tr>
                    <th>目的地顺序</th>
                    <td :colspan="4">
                        <ul class="hor-waypoints-list">
                            <li
                                v-for="wp_id in submarineStore.routeInfo.routeOrder"
                                :key="wp_id"
                                @click="toggleWP(wp_id)"
                            >
                                <div class="wp selected">{{ submarineStore.currentWarpoints[wp_id].code }}</div>
                            </li>
                            <li v-if="submarineStore.selected.length < 5">
                                <div class="wp btn-red" @click="layerAddWP"
                                    ><i class="fa fa-plus" aria-hidden="true"></i
                                ></div>
                            </li>
                        </ul>
                    </td>
                    <th>最大探索需求</th>
                    <td class="r2">{{ submarineStore.routeInfo.max_surveillance }}</td>
                </tr>
                <tr>
                    <th>航行距离</th>
                    <td :colspan="2">{{ submarineStore.routeInfo.distance }}</td>
                    <th>预览速度</th>
                    <td
                        >{{ submarineStore.speed }}
                        <i class="fa fa-pencil-square btn-red" aria-hidden="true" @click="layerSetSpeed"></i
                    ></td>
                    <th>最大收集需求</th>
                    <td class="r2">{{ submarineStore.routeInfo.max_retrieval }}</td>
                </tr>
                <tr>
                    <th>航行时间预览</th>
                    <td :colspan="2">{{ routeTimeCostText }}</td>
                    <th>回归时间</th>
                    <td>{{ routeRealTimeText }}</td>
                    <th>最大恩惠需求</th>
                    <td class="r2">{{ submarineStore.routeInfo.max_favor }}</td>
                </tr>
                <tr>
                    <th :colspan="7">沿途目的地情报</th>
                </tr>
                <tr>
                    <th style="width: 16%">目的地</th>
                    <th style="width: 9%">探索需求</th>
                    <th style="width: 9%">收集需求</th>
                    <th style="width: 9%">恩惠需求</th>
                    <th style="width: 19%">探索物品<span class="r0">（低）</span></th>
                    <th style="width: 19%">探索物品<span class="r1">（中）</span></th>
                    <th style="width: 19%">探索物品<span class="r2">（高）</span></th>
                </tr>
                <tr v-for="w in submarineStore.routeInfo.routeOrder" v-bind:key="w">
                    <td>{{
                        submarineStore.currentWarpoints[w].code + ' ' + submarineStore.currentWarpoints[w].name
                    }}</td>
                    <td style="text-align: center"
                        ><span class="r1">{{ submarineStore.currentWarpoints[w].statReq.surveillance.mid }}</span
                        >&nbsp;/&nbsp;<span class="r2">{{
                            submarineStore.currentWarpoints[w].statReq.surveillance.high
                        }}</span></td
                    >
                    <td style="text-align: center"
                        ><span class="r1">{{ submarineStore.currentWarpoints[w].statReq.retrieval.optim }}</span
                        >&nbsp;/&nbsp;<span class="r2">{{
                            submarineStore.currentWarpoints[w].statReq.retrieval.optim
                        }}</span></td
                    >
                    <td style="text-align: center"
                        ><span class="r2">{{ submarineStore.currentWarpoints[w].statReq.favor }}</span></td
                    >
                    <td
                        ><div v-for="item_id in submarineStore.currentWarpoints[w].drop.low" :key="'low' + item_id"
                            ><ItemLink :item="submarineStore.itemDB[item_id]" /></div
                    ></td>
                    <td
                        ><div v-for="item_id in submarineStore.currentWarpoints[w].drop.mid" :key="'mid' + item_id"
                            ><ItemLink :item="submarineStore.itemDB[item_id]" /></div
                    ></td>
                    <td
                        ><div v-for="item_id in submarineStore.currentWarpoints[w].drop.high" :key="'high' + item_id"
                            ><ItemLink :item="submarineStore.itemDB[item_id]" /></div
                    ></td>
                </tr>
            </template>
            <tr v-else><td :colspan="7">请选择希望探索的目的地</td></tr>
        </table>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { getRouteRealTimeText, getRouteTimeCostText } from '../module/routeTimeText';
import { useSubmarineStore } from '../stores/submarine';
import ItemLink from './ItemLink.vue';

const submarineStore = useSubmarineStore();

const routeTimeCostText = computed(() => getRouteTimeCostText(submarineStore.routeInfo.time, submarineStore.speed));

const routeRealTimeText = computed(() =>
    getRouteRealTimeText(submarineStore.startRealTime, submarineStore.routeInfo.time, submarineStore.speed),
);

function layerAddWP() {
    submarineStore.setLayer(4);
}

function layerSetSpeed() {
    submarineStore.setLayer(3);
}

function toggleWP(point_id: number) {
    submarineStore.toggleWaypoint(point_id);
}
</script>

<style lang="less">
.statistics-block {
    margin-top: 1.5em;
}
</style>
