<template>
    <div class="sets-block">
        <table class="sets-table wikitable" style="text-align: center">
            <tr>
                <th style="width: 16%">潜水艇</th>
                <th style="width: 8%">探索<br />性能</th>
                <th style="width: 8%">收集<br />性能</th>
                <th style="width: 8%">巡航<br />速度</th>
                <th style="width: 8%">航行<br />距离</th>
                <th style="width: 8%">恩惠</th>
                <th style="width: 14%">航行<br />时间</th>
                <th style="width: 10%">探索<br />情况</th>
                <th style="width: 10%">收集<br />情况</th>
                <th style="width: 10%">额外<br />探索</th>
            </tr>
            <tr v-if="submarineStore.sets.length === 0">
                <td :colspan="10" style="text-align: left">请添加或搜索潜水艇配置</td>
            </tr>
            <tr v-for="(set, i) in sets_data" :key="i" class="submarine-set" @click="layerModSet(i)">
                <td style="text-align: left">
                    <div>
                        <span class="submarine-name">{{ set.n }}</span>
                        <br />
                        <span class="submarine-cname">{{ set.c[0] }} {{ set.c[1] }} {{ set.c[2] }} {{ set.c[3] }}</span>
                    </div>
                </td>
                <td v-bind:class="{ ['r' + set.ms]: routeInfo.time > 0 }">{{ set.st[1] }}</td>
                <td v-bind:class="{ ['r' + set.mr]: routeInfo.time > 0 }">{{ set.st[2] }}</td>
                <td>{{ set.st[3] }}</td>
                <td
                    v-bind:class="{
                        r0: routeInfo.time > 0 && routeInfo.distance > set.st[4],
                        r2: routeInfo.time > 0 && routeInfo.distance <= set.st[4],
                    }"
                    >{{ set.st[4] }}</td
                >
                <td v-bind:class="{ ['r' + set.mf]: routeInfo.time > 0 }">{{ set.st[5] }}</td>
                <template v-if="routeInfo.time > 0">
                    <!-- 航行信息 -->
                    <td>{{ set.t }}</td>
                    <td
                        ><span v-for="(c, i) in routeInfo.routeCode" :key="c" v-bind:class="'r' + set.s[i]">{{
                            c
                        }}</span></td
                    >
                    <td
                        ><span v-for="(c, i) in routeInfo.routeCode" :key="c" v-bind:class="'r' + set.r[i]">{{
                            c
                        }}</span></td
                    >
                    <td
                        ><span v-for="(c, i) in routeInfo.routeCode" :key="c" v-bind:class="'r' + set.f[i]">{{
                            c
                        }}</span></td
                    >
                </template>
                <template v-else>
                    <td v-for="i in 4" :key="i">&nbsp;</td>
                </template>
            </tr>
        </table>
    </div>
    <div class="ff14-btn-group" style="margin-top: 1em">
        <div class="ff14-btn" @click="layerAddSet">添加</div>
        <div class="ff14-btn" @click="layerFindSet">搜索</div>
        <div class="ff14-btn" style="float: right" @click="layerAbout">关于</div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { calcSetStatus } from '../module/calcSetStatus';
import { useSubmarineStore } from '../stores/submarine';
import type { SetStatus } from '../types/submarineSet';

const submarineStore = useSubmarineStore();

const routeInfo = computed(() => submarineStore.routeInfo);

const sets_data = computed(() => {
    const sets_data = [] as SetStatus[];
    for (let i = 0; i < submarineStore.sets.length; i++) {
        const set = submarineStore.sets[i];
        sets_data.push(calcSetStatus(set));
    }
    return sets_data;
});

function layerModSet(index: number) {
    submarineStore.setEditorIndex(index);
    submarineStore.setLayer(1);
}

function layerAddSet() {
    submarineStore.setEditorIndex(-1);
    submarineStore.setLayer(1);
}

function layerFindSet() {
    submarineStore.setLayer(2);
}

function layerAbout() {
    submarineStore.setLayer(5);
}
</script>

<style lang="less">
.sets-block {
    margin-top: 1.5em;
}

.submarine-set:hover {
    background-color: #311919;
    cursor: pointer;
}

.submarine-cname {
    color: #8a8a8a;
    font-size: 12px;
}
</style>
