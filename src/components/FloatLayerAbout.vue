<template>
    <div class="about-block float-layer">
        <div class="float-layer-title">作者</div>
        <p>{{ author }}</p>
        <div class="float-layer-title">资料来源</div>
        <p>本文使用了以下光之战士发布的资料</p>
        <table class="wikitable" style="text-align: left">
            <tr><th>来源</th><th>作者</th><th>使用部分</th></tr>
            <tr v-for="(ds, i) in submarineStore.dataSources" :key="i">
                <td
                    ><a :href="ds.url" target="_blank">{{ ds.title }}</a></td
                >
                <td>{{ ds.author }}</td>
                <td>{{ ds.desc }}</td>
            </tr>
        </table>
        <div class="ff14-btn-group" style="margin-top: 1em">
            <div class="ff14-btn" @click="close">关闭</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import * as pkg from '../../package.json';
import { useSubmarineStore } from '../stores/submarine';

const submarineStore = useSubmarineStore();

const author = `${pkg.author.name}(${pkg.author.character}@${pkg.author.server})`;

function close() {
    submarineStore.setLayer(0);
}
</script>
