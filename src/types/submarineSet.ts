export interface SetStatus {
    n: string; // 船名
    c: string[]; // 船的组件代码
    set: number[]; // 船的组件编号
    st: number[]; // 船的组件属性
    t: string; // 航程时间
    s: number[]; // 探索性能
    r: number[]; // 收集性能
    f: number[]; // 恩惠
    ms: number; // 最差探索性能
    mr: number; // 最差收集性能
    mf: number; // 最差恩惠
    v: boolean; // 船配置的有效性（是否件全，是否属性没有负值）
}
