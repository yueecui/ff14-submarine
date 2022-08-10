<template>
    <waypoint-list />
    <status-statistics />
    <submarine-set />

    <div class="ff14-float-layers" v-if="layer > 0">
        <float-layer-set-editor v-if="layer === 1" />
        <float-layer-set-finder v-if="layer === 2" />
        <float-layer-set-speed v-if="layer === 3" />
        <float-layer-add-waypoint v-if="layer === 4" />
        <float-layer-about v-if="layer === 5" />
        <div class="float-layer-bg"></div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch } from 'vue';
import FloatLayerAbout from './components/FloatLayerAbout.vue';
import FloatLayerAddWaypoint from './components/FloatLayerAddWaypoint.vue';
import FloatLayerSetEditor from './components/FloatLayerSetEditor.vue';
import FloatLayerSetFinder from './components/FloatLayerSetFinder.vue';
import FloatLayerSetSpeed from './components/FloatLayerSetSpeed.vue';
import StatusStatistics from './components/StatusStatistics.vue';
import SubmarineSet from './components/SubmarineSet.vue';
import WaypointList from './components/WaypointList.vue';
import { findBestRoute } from './module/findBestRoute';
import { useSubmarineStore } from './stores/submarine';

const submarineStore = useSubmarineStore();

onMounted(() => {
    // 设置定时器
    setInterval(() => {
        submarineStore.updateStartRealTime(Date.now());
    }, 5000);
    updateRouteInfo();
    // eslint-disable-next-line
    console.log('部队潜水艇工具 已加载 版本:' + submarineStore.version);
});

const layer = computed(() => submarineStore.layer);
const map = computed(() => submarineStore.map);
const speed = computed(() => submarineStore.speed);
const sets = computed(() => submarineStore.sets);

watch(layer, (newVal) => {
    if (newVal === 0) {
        document.querySelector('body')?.classList.remove('float-layer-show');
        document.querySelector('.huiji-css-hook')?.classList.remove('float-layer-show');
    } else {
        document.querySelector('body')?.classList.add('float-layer-show');
        document.querySelector('.huiji-css-hook')?.classList.add('float-layer-show');
    }
});

watch(
    [map, speed, sets, submarineStore.selected],
    () => {
        updateRouteInfo();
        submarineStore.saveLocalData();
    },
    { deep: true },
);

function updateRouteInfo() {
    if (!submarineStore.startPoint) {
        return;
    }
    submarineStore.setRouteInfo(
        findBestRoute(submarineStore.selected, submarineStore.startPoint, submarineStore.currentWarpoints),
    );
}
</script>

<style lang="less">
body.float-layer-show {
    overflow: hidden;
}

@media (min-width: 768px) {
    .huiji-css-hook.float-layer-show {
        margin-right: 17px;
    }
}

.fade {
    opacity: 0;
    transition: opacity 0.2s linear;

    &.show {
        opacity: 1;
    }
}

#app-submarine-tool {
    margin: 0 auto;
    width: Calc(~'12em + 20em + 2em + 350px');
    font-size: 14px;

    .r0 {
        color: #f69;
    }
    .r1 {
        color: #fc3;
    }
    .r2,
    .selected {
        color: #0f0;
    }
    table {
        margin: 0;
        width: 100%;
    }

    .btn-red {
        border-color: #f69;
        color: #f69;
        cursor: pointer;

        &:hover {
            border-color: #fc3;
            color: #fc3;
            cursor: pointer;
        }
    }

    .ff14-btn + .ff14-btn {
        margin-left: 0.3em;
    }
}

// 航点样式
.wp {
    border: 2px solid #efefef;
    border-radius: 50%;
    text-align: center;
    cursor: pointer;
}

.no-hover .wp {
    cursor: auto;
}

.no-hover .wp:hover {
    background: #000;
}

ul.hor-waypoints-list {
    overflow: hidden;
    margin: 0 -2px;
    list-style: none;

    > li {
        float: left;
        margin: 0 !important;
        padding: 2px;
        line-height: 1.4 !important;
    }
    .wp {
        display: inline-block;
        width: 18px;
        height: 18px;
        border-color: #ccc;
        background: #000;
        color: #efefef;
        font-size: 12px;

        &.selected {
            border-color: #0f0 !important;
        }
    }
    &:not(.no-hover) .wp {
        &.selected:hover,
        &:hover {
            border-color: #fc3 !important;
        }
    }
}

// 浮层样式
.ff14-float-layers {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 600;
    overflow-x: hidden;
    overflow-y: scroll;
    width: 100%;
    height: 100%;
}

.float-layer {
    position: relative;
    z-index: 600;
    margin: 50px auto;
    padding: 1em;
    border: 2px #dbc57a solid;
    border-collapse: separate;
    border-radius: 5px;
    background: #191313;
    box-shadow: 1px 1px 2px #000;
    border-spacing: 0;

    &-title {
        color: #bda45b;
        font-weight: 700;
        font-size: 150%;
    }

    &-bg {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 500;
        display: block;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0.5;
    }

    &.set-editor-block {
        width: 42em;
    }

    &.set-finder-block {
        width: 50em;
    }

    &.set-speed-block {
        width: 27em;
    }

    &.add-waypoint-block {
        width: 33em;
    }

    &.about-block {
        width: 50em;
    }

    table {
        width: auto !important;
        text-align: center;
    }

    .hover-block:hover {
        background-color: #311919;
        cursor: pointer;
    }
}
</style>
