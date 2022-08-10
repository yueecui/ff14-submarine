<template>
    <div class="set-editor-block float-layer">
        <div class="float-layer-title">配置编辑器</div>
        <div class="set-name ff14-input">显示名称 <input type="text" name="set-name" v-model="editor_set.name" /></div>
        <table class="component-table wikitable">
            <tr
                ><th style="width: 9em">级</th
                ><th style="width: 5em" v-for="(name, i) in Object.values(SubmarinePartName)" :key="name + i">{{
                    name
                }}</th></tr
            >
            <tr v-for="(component, i) in submarineStore.components" :key="'component' + i">
                <th>{{ component.name }}</th>
                <td
                    v-for="j in 4"
                    :key="j"
                    class="hover-block"
                    :class="{ selected: i === editor_set.set[j - 1] }"
                    @click="setComponent(j - 1, i)"
                    >{{ component.code }}</td
                >
            </tr>
        </table>
        <table class="status-table wikitable">
            <tr>
                <th style="width: 4.5em">位置</th>
                <th style="width: 4.5em">级别</th>
                <th style="width: 5em" v-for="(name, i) in SubmarineAttr" :key="i">{{ name }}</th>
            </tr>
            <tr v-for="partIndex in SubmarinePart" :key="partIndex" :class="{ r0: editor_set.set[partIndex] === -1 }">
                <template v-if="SubmarinePartName[partIndex]">
                    <th>{{ SubmarinePartName[partIndex] }}</th>
                    <template v-if="editor_set.set[partIndex] > -1">
                        <td>{{ getComponent(editor_set.set[partIndex]).code }}</td>
                        <td v-for="(attrName, j) in SubmarineAttr" :key="j">{{
                            getComponent(editor_set.set[partIndex]).getValue(partIndex, attrName)
                        }}</td>
                    </template>
                    <template v-else>
                        <td>无</td>
                        <td v-for="j in 6" :key="j">0</td>
                    </template>
                </template>
            </tr>
            <tr
                ><th :colspan="2">{{ submarineStore.maxRank }}级奖励属性</th
                ><td v-for="(bonus_v, i) in submarineStore.maxRankBonus" :key="i">{{ bonus_v }}</td></tr
            >
            <tr :class="{ r0: !editorSetStatus.v }"
                ><th :colspan="2">总计</th>
                <td>{{ editorSetStatus.st[0] }}</td>
                <td :class="{ ['r' + editorSetStatus.ms]: routeInfo.time > 0 }">{{ editorSetStatus.st[1] }}</td>
                <td :class="{ ['r' + editorSetStatus.mr]: routeInfo.time > 0 }">{{ editorSetStatus.st[2] }}</td>
                <td>{{ editorSetStatus.st[3] }}</td>
                <td
                    :class="{
                        r0: routeInfo.time > 0 && routeInfo.distance > editorSetStatus.st[4],
                        r2: routeInfo.time > 0 && routeInfo.distance <= editorSetStatus.st[4],
                    }"
                    >{{ editorSetStatus.st[4] }}</td
                >
                <td :class="{ ['r' + editorSetStatus.mf]: routeInfo.time > 0 }">{{ editorSetStatus.st[5] }}</td>
            </tr>
        </table>
        <table class="explore-preview-table wikitable" v-if="routeInfo.time > 0">
            <tr>
                <th style="width: 9em">探索路线</th>
                <td style="width: 10em; text-align: left">
                    <ul class="hor-waypoints-list no-hover">
                        <li v-for="wp_code in routeInfo.routeCode" :key="wp_code"
                            ><div class="wp selected">{{ wp_code }}</div></li
                        >
                    </ul>
                </td>
            </tr>
            <tr
                ><th>探索距离</th
                ><td
                    style="text-align: left"
                    :class="{
                        r0: routeInfo.time > 0 && routeInfo.distance > editorSetStatus.st[4],
                        r2: routeInfo.time > 0 && routeInfo.distance <= editorSetStatus.st[4],
                    }"
                    >{{ routeInfo.distance }} / {{ editorSetStatus.st[4] }}</td
                ></tr
            >
            <tr
                ><th>探索时间</th
                ><td style="text-align: left">{{ doGetRouteTimeCostText(editorSetStatus.st[3]) }}</td></tr
            >
            <tr
                ><th>回归时间</th
                ><td style="text-align: left">{{ doGetRouteRealTimeText(editorSetStatus.st[3]) }}</td></tr
            >
            <tr
                ><th>探索情况</th
                ><td style="text-align: left"
                    ><span v-for="(code, i) in routeInfo.routeCode" :key="code" :class="'r' + editorSetStatus.s[i]">{{
                        code
                    }}</span>
                    / 需要:<span class="r2">{{ routeInfo.max_surveillance }}</span></td
                ></tr
            >
            <tr
                ><th>收集情况</th
                ><td style="text-align: left"
                    ><span v-for="(code, i) in routeInfo.routeCode" :key="code" :class="'r' + editorSetStatus.r[i]">{{
                        code
                    }}</span>
                    / 需要:<span class="r2">{{ routeInfo.max_retrieval }}</span></td
                ></tr
            >
            <tr
                ><th>额外探索</th
                ><td style="text-align: left"
                    ><span v-for="(code, i) in routeInfo.routeCode" :key="code" :class="'r' + editorSetStatus.f[i]">{{
                        code
                    }}</span>
                    / 需要:<span class="r2">{{ routeInfo.max_favor }}</span></td
                ></tr
            >
        </table>
        <div class="ff14-btn-group">
            <div class="ff14-btn" :class="{ disable: !editorSetStatus.v }" @click="btnSaveSet">保存</div>
            <div class="ff14-btn" @click="btnClose">取消</div>
            <div class="ff14-btn" v-if="submarineStore.editor_index > -1" @click="btnDeleteSet">删除</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from 'vue';
import { SubmarineAttr, SubmarinePart, SubmarinePartName } from '../constant/enum';
import { calcSetStatus } from '../module/calcSetStatus';
import { getRouteRealTimeText, getRouteTimeCostText } from '../module/routeTimeText';
import { SetInfo, useSubmarineStore } from '../stores/submarine';

const submarineStore = useSubmarineStore();

const editor_set = reactive<SetInfo>({
    set: [-1, -1, -1, -1],
    name: '',
}); // 编辑中的组合

onMounted(() => {
    if (submarineStore.editor_index == -1) {
        editor_set.set = [-1, -1, -1, -1];
        editor_set.name = '';
    } else {
        editor_set.set = submarineStore.sets[submarineStore.editor_index].set;
        editor_set.name = submarineStore.sets[submarineStore.editor_index].name;
    }
});

const routeInfo = computed(() => submarineStore.routeInfo);

const editorSetStatus = computed(() => {
    return calcSetStatus(editor_set);
});

function doGetRouteTimeCostText(speed: number) {
    return getRouteTimeCostText(submarineStore.routeInfo.time, speed);
}

function doGetRouteRealTimeText(speed: number) {
    return getRouteRealTimeText(submarineStore.startRealTime, submarineStore.routeInfo.time, speed);
}

function getComponent(id: number) {
    return submarineStore.components[id];
}

function btnClose(event: MouseEvent) {
    if (event.button > 0) {
        return;
    }
    submarineStore.setLayer(0);
    event.preventDefault();
}

function setComponent(slot: number, rank: number) {
    if (editor_set.set[slot] == rank) {
        editor_set.set[slot] = -1;
    } else {
        editor_set.set[slot] = rank;
    }
}

function btnSaveSet() {
    if (editorSetStatus.value.v) {
        submarineStore.addSet({
            setStatus: editorSetStatus.value,
            index: submarineStore.editor_index,
        });
        submarineStore.setLayer(0);
    }
}

function btnDeleteSet() {
    submarineStore.deleteSet(submarineStore.editor_index);
    submarineStore.setLayer(0);
}
</script>

<style lang="less">
.set-editor-block,
.set-finder-block {
    background: #000;
    color: #fff;
}

.set-editor-block > * + * {
    margin-top: 1em !important;
}

.set-name input {
    margin-left: 1em;
}
</style>
