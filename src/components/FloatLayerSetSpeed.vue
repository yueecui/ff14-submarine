<template>
    <div class="set-speed-block float-layer">
        <div class="float-layer-title">选择预览速度</div>
        <div class="set-speed">
            <table class="wikitable">
                <tr
                    ><th style="width: 5em">速度</th><th style="width: 10em">探索时间</th
                    ><th style="width: 10em">回归时间</th></tr
                >
                <tr
                    v-for="i in 40"
                    @click="setSpeed(i * 5)"
                    class="hover-block"
                    :class="{ selected: submarineStore.speed === i * 5 }"
                    :key="i"
                >
                    <td>{{ i * 5 }}</td>
                    <td>{{ doGetRouteTimeCostText(i * 5) }}</td>
                    <td>{{ doGetRouteRealTimeText(i * 5) }}</td>
                </tr>
            </table>
        </div>
        <div class="ff14-btn-group" style="margin-top: 1em">
            <div class="ff14-btn" @click="close">关闭</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { getRouteRealTimeText, getRouteTimeCostText } from '../module/routeTimeText';
import { useSubmarineStore } from '../stores/submarine';

const submarineStore = useSubmarineStore();

function setSpeed(speed: number) {
    submarineStore.setSpeed(speed);
    submarineStore.setLayer(0);
}

function close() {
    submarineStore.setLayer(0);
}

function doGetRouteTimeCostText(speed: number) {
    return getRouteTimeCostText(submarineStore.routeInfo.time, speed);
}

function doGetRouteRealTimeText(speed: number) {
    return getRouteRealTimeText(submarineStore.startRealTime, submarineStore.routeInfo.time, speed);
}
</script>
