<template>
    <div class="set-finder-block float-layer">
        <div class="float-layer-title">配置搜索器</div>
        <div class="finder-option ff14-input">
            <table>
                <tr v-for="(_, i) in set_filter" :key="i">
                    <th>{{ Object.values(SubmarineAttr)[i] }}</th>
                    <td><input type="text" v-model.number="set_filter[i]" /></td>
                </tr>
            </table>
        </div>
        <div class="ff14-btn-group" style="margin-top: 1em">
            <div class="ff14-btn" @click="close">关闭</div>
        </div>
        <template v-if="validSets.length > 0">
            <p
                >共有 {{ validSets.length }} 条符合的记录。<template
                    v-if="validSets.length > submarineStore.maxFilterCount"
                    >最多显示 {{ submarineStore.maxFilterCount }} 条记录，请缩小查询范围。</template
                ></p
            >
            <table class="sets-table wikitable" v-if="validSets.length <= submarineStore.maxFilterCount">
                <tr>
                    <th style="width: 12em">配置</th>
                    <th
                        v-for="(name, _, i) in SubmarineAttr"
                        :key="i"
                        style="width: 5em"
                        class="hover-block"
                        @click="sortByAttr(i)"
                        :class="sortTitleColor(i)"
                        >{{ name }}</th
                    >
                    <th style="width: 5em">操作</th>
                </tr>
                <tr v-for="(set, i) in validSets" :key="i" class="hover-block" @click="checkAndAddSet(set)">
                    <td
                        ><div class="set-code"
                            ><span>{{ set.c[0] }}</span
                            ><span>{{ set.c[1] }}</span
                            ><span>{{ set.c[2] }}</span
                            ><span>{{ set.c[3] }}</span></div
                        ></td
                    >
                    <td v-for="(st_v, i) in set.st" :key="i">{{ st_v }}</td>
                    <td class="selected" v-if="checkSet(set)">已添加</td>
                    <td class="add-set" v-else>添加</td>
                </tr>
            </table>
        </template>
        <p v-else>没有找到符合条件的记录，请修改查询范围。</p>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watchEffect } from 'vue';
import { SubmarineAttr } from '../constant/enum';
import { useSubmarineStore } from '../stores/submarine';
import type { SetStatus } from '../types/submarineSet';

const set_filter = ref([0, 0, 0, 0, 0, 0]); // 搜索用过滤器
const filter_sort = reactive([-1, -1]); // 第一个参数是用哪个属性排序，第二个参数是正序还是逆序

const submarineStore = useSubmarineStore();

onMounted(() => {
    submarineStore.initAllSets();
    set_filter.value = [
        0,
        submarineStore.routeInfo.max_surveillance,
        submarineStore.routeInfo.max_retrieval,
        submarineStore.speed,
        submarineStore.routeInfo.distance,
        submarineStore.routeInfo.max_favor,
    ];
});

function close() {
    submarineStore.setLayer(0);
}

const validSets = ref<SetStatus[]>([]);

watchEffect(() => {
    const valid_sets = submarineStore.all_sets.filter((set) => {
        if (!set.v) {
            return false;
        }
        for (let i = 0; i < set_filter.value.length; i++) {
            if (set_filter.value[i] > 0 && set.st[i] < set_filter.value[i]) {
                return false;
            }
        }
        return true;
    });
    if (filter_sort[0] > -1) {
        valid_sets.sort(function (a, b) {
            if (filter_sort[1] === 1) {
                return b.st[filter_sort[0]] - a.st[filter_sort[0]];
            } else {
                return a.st[filter_sort[0]] - b.st[filter_sort[0]];
            }
        });
    }
    validSets.value = valid_sets;
});

function checkSet(c_set: Record<string, any>) {
    // 检查配置是否已经有存在的
    for (let i = 0; i < submarineStore.sets.length; i++) {
        const set = submarineStore.sets[i];
        if (c_set.set[0] == set[0] && c_set.set[1] == set[1] && c_set.set[2] == set[2] && c_set.set[3] == set[3]) {
            return true;
        }
    }
    return false;
}

function checkAndAddSet(set: SetStatus) {
    if (!checkSet(set)) {
        submarineStore.addSet({
            setStatus: set,
            index: -1,
        });
    } else {
        // console.log('已经存在');
    }
}

function sortByAttr(attr_index: number) {
    if (filter_sort.length < 2) {
        filter_sort[0] = -1;
        filter_sort[1] = -1;
    }
    if (filter_sort[0] !== attr_index) {
        filter_sort[0] = attr_index;
        filter_sort[1] = 1;
    } else {
        filter_sort.splice(1, 1, filter_sort[1] * -1);
    }
}

function sortTitleColor(attr_index: number) {
    if (filter_sort[0] === attr_index) {
        if (filter_sort[1] === 1) {
            return 'r2';
        } else {
            return 'r0';
        }
    } else {
        return '';
    }
}
</script>

<style lang="less">
.finder-option table {
    border-collapse: separate;
    border-spacing: 0 5px;
    th {
        width: 6em;
    }
}

.finder-option input {
    width: 3em;
}

.set-code > span {
    position: relative;
    display: inline-block;
    margin: 0 1px;
    width: 2.5em;
    color: #efefef;
    text-align: center;
}

.set-code > span + span {
    border-left: 1px solid #7b7b7b;
}

.add-set {
    color: #77d1ff;
}
</style>
