import type { SubmarinePart } from '../constant/enum';
import { getItemData } from '../module/getSubmarineData';
import type { PartInfo, SubmarineComponentRaw } from '../types/ff14data';

export class SubmarineComponent {
    raw: SubmarineComponentRaw;
    parts: Record<SubmarinePart, PartInfo>;

    constructor(raw: SubmarineComponentRaw) {
        this.raw = raw;
        this.parts = this.getInitParts();
    }

    get name() {
        return this.raw.n;
    }

    get code() {
        return this.raw.c;
    }

    private getInitParts() {
        const itemData = getItemData();
        const parts = {} as Record<SubmarinePart, PartInfo>;
        this.raw.items.forEach((itemId) => {
            const item = itemData[itemId];
            if (item === undefined || item.机体数据 === undefined) {
                throw new Error(`item ${itemId} not found`);
            }
            parts[item.机体数据.位置] = item.机体数据;
        });
        return parts;
    }

    getValue(part: SubmarinePart, valueType: '重量' | '探索性能' | '收集性能' | '巡航速度' | '航行距离' | '恩惠') {
        return this.parts[part][valueType];
    }

    getPartAllValue(part: SubmarinePart) {
        return this.parts[part];
    }

    getWeight(part: SubmarinePart) {
        return this.parts[part].重量;
    }

    getExplore(part: SubmarinePart) {
        return this.parts[part].探索性能;
    }

    getCollect(part: SubmarinePart) {
        return this.parts[part].收集性能;
    }

    getSpeed(part: SubmarinePart) {
        return this.parts[part].巡航速度;
    }

    getDistance(part: SubmarinePart) {
        return this.parts[part].航行距离;
    }

    getFavor(part: SubmarinePart) {
        return this.parts[part].恩惠;
    }
}
