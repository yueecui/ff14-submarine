<template>
    <div class="add-waypoint-block float-layer">
        <div class="float-layer-title">按时间预览调整航线</div>
        <div class="add-waypoint">
            <table class="wikitable" style="text-align: left">
                <tr
                    ><th style="width: 10em">航点</th><th style="width: 10em">航行时间</th
                    ><th style="width: 10em">回归时间</th></tr
                >
                <tr
                    v-for="wp in submarineStore.currentWarpoints"
                    @click="toggleWP(wp.id)"
                    class="hover-block"
                    :class="{ selected: submarineStore.selected.includes(wp.id) }"
                    :key="wp.id"
                >
                    <td>{{ wp.code + ' ' + wp.name }}</td>
                    <td
                        class="selected"
                        style="text-align: center"
                        :colspan="2"
                        v-if="submarineStore.selected.includes(wp.id)"
                        >已添加</td
                    >
                    <template v-else>
                        <td>{{ getSimRouteTimeCostText(wp.id) }}</td>
                        <td>{{ getSimRouteRealTimeText(wp.id) }}</td>
                    </template>
                </tr>
            </table>
        </div>
        <div class="ff14-btn-group" style="margin-top: 1em">
            <div class="ff14-btn" @click="close">关闭</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { findBestRoute } from '../module/findBestRoute';
import { getRouteRealTimeText, getRouteTimeCostText } from '../module/routeTimeText';
import { useSubmarineStore } from '../stores/submarine';

const submarineStore = useSubmarineStore();

function toggleWP(point_id: number) {
    submarineStore.toggleWaypoint(point_id);
}

function close() {
    submarineStore.setLayer(0);
}

function getSimRouteTimeCostText(new_wp_id: number) {
    const temp_route_group = submarineStore.selected.slice();
    temp_route_group.push(new_wp_id);
    const temp_best_route = findBestRoute(
        temp_route_group,
        submarineStore.startPoint!,
        submarineStore.currentWarpoints,
    );
    return getRouteTimeCostText(temp_best_route.time, submarineStore.speed);
}
function getSimRouteRealTimeText(new_wp_id: number) {
    const temp_route_group = submarineStore.selected.slice();
    temp_route_group.push(new_wp_id);
    const temp_best_route = findBestRoute(
        temp_route_group,
        submarineStore.startPoint!,
        submarineStore.currentWarpoints,
    );
    return getRouteRealTimeText(submarineStore.startRealTime, temp_best_route.time, submarineStore.speed);
}
</script>
