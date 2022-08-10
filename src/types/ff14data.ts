import type { SubmarinePart } from '../constant/enum';

/** lua写到页面上的数据 */
export interface SubmarineData {
    components: SubmarineComponentRaw[]; // 船体零件
    data_sources: DataSourceInfo[]; // 数据源
    item_db: Record<number, ItemInfo>; // 物品数据
    max_filter_count: number; // 最大过滤数量
    max_rank: number; // 最大等级
    max_rank_bonus: number[]; // 最大等级奖励
    sea_name_map: SeaInfo[]; // 海域名称
    point_data: PointInfo[]; // 航点数据
    reward_category_map: Record<number, string>;
    tool_version: number;
}

export interface SubmarineComponentRaw {
    c: string; // 缩写
    n: string; // 名称
    items: number[]; // 物品
}

export interface DataSourceInfo {
    title: string; // 标题
    desc: string; // 描述
    author: string; // 作者
    url: string; // 链接
}

export interface ItemInfo {
    ID: number;
    中文名: string;
    品质: number;
    图标ID: number;
    category?: number;
    valuable?: boolean;
    机体数据?: PartInfo;
}

export interface PartInfo {
    位置: SubmarinePart;
    重量: number;
    探索性能: number;
    收集性能: number;
    巡航速度: number;
    航行距离: number;
    恩惠: number;
}

export interface SeaInfoRaw {
    cn: string; // 中文名
    en: string; // 英文名
    jp: string; // 日文名
}

export type SeaInfo = SeaInfoRaw & {
    info: PointInfo;
};

export interface PointInfo {
    code: string; // 海域代码
    drop: {
        low: number[];
        mid: number[];
        high: number[];
    };
    expReward: number;
    id: number;
    map: number;
    name: string;
    rankReq: number;
    stars: number;
    start: boolean;
    statReq: {
        favor: number;
        retrieval: {
            norm: number;
            optim: number;
        };
        surveillance: {
            mid: number;
            high: number;
        };
    };
    surveyDistance: number;
    surveyRange: number;
    tankReq: number;
    toDestination: Record<
        number,
        {
            range: number;
            distance: number;
        }
    >;
    unlocks: {
        map?: number;
        sectors?: number[];
    };
    x: number;
    y: number;
}
