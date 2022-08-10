export interface routeInfo {
    routeOrder: Array<number>; // 航线顺序 r
    routeCode: Array<string>; // 航线代码 rc
    time: number; // 航线时间 t
    distance: number; // 航线距离 d
    max_surveillance: number; // 最大需要的探索 ms
    max_retrieval: number; // 最大需要的收集 mr
    max_favor: number; // 最大需要的恩惠 mf
}
