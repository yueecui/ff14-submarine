export enum SubmarinePart {
    船体 = 0,
    船尾 = 1,
    船首 = 2,
    舰桥 = 3,
}

export const SubmarinePartName: Record<SubmarinePart, string> = {
    [SubmarinePart.船体]: '船体',
    [SubmarinePart.船尾]: '船尾',
    [SubmarinePart.船首]: '船首',
    [SubmarinePart.舰桥]: '舰桥',
};

export enum SubmarineAttr {
    '重量' = '重量',
    '探索性能' = '探索性能',
    '收集性能' = '收集性能',
    '巡航速度' = '巡航速度',
    '航行距离' = '航行距离',
    '恩惠' = '恩惠',
}

export const SubmarineAttrInfo: Record<SubmarineAttr, { index: number }> = {
    [SubmarineAttr.重量]: { index: 0 },
    [SubmarineAttr.探索性能]: { index: 1 },
    [SubmarineAttr.收集性能]: { index: 2 },
    [SubmarineAttr.巡航速度]: { index: 3 },
    [SubmarineAttr.航行距离]: { index: 4 },
    [SubmarineAttr.恩惠]: { index: 5 },
};
