import { SetInfo, useSubmarineStoreWithoutSetup } from '../stores/submarine';
import type { SetStatus } from '../types/submarineSet';
import { getRouteTimeCostText } from './routeTimeText';

export function calcSetStatus(setInfo: SetInfo) {
    const submarineStore = useSubmarineStoreWithoutSetup();

    // 别名数据
    const routeInfo = submarineStore.routeInfo;
    const currentWarpoints = submarineStore.currentWarpoints;

    // 生成回传数据
    const temp_status = calcSetBaseStatus(setInfo);
    temp_status.t = getRouteTimeCostText(routeInfo.time, temp_status.st[3]);

    const status = temp_status.st;

    // 循环航点判断
    for (let i = 0; i < routeInfo.routeOrder.length; i++) {
        const wp_id = routeInfo.routeOrder[i];
        const wp_info = currentWarpoints[wp_id];
        // 0重量, 1探索, 2收集, 3速度, 4距离, 5恩惠

        // 探索性能判断
        if (status[1] < wp_info.statReq.surveillance.mid) {
            temp_status.s.push(0);
        } else if (status[1] < wp_info.statReq.surveillance.high) {
            temp_status.s.push(1);
        } else {
            temp_status.s.push(2);
        }
        temp_status.ms = Math.min.apply(null, temp_status.s);

        // 收集性能判定
        if (status[2] < wp_info.statReq.retrieval.norm) {
            temp_status.r.push(0);
        } else if (status[2] < wp_info.statReq.retrieval.optim) {
            temp_status.r.push(1);
        } else {
            temp_status.r.push(2);
        }
        temp_status.mr = Math.min.apply(null, temp_status.r);

        // 恩惠判定
        if (status[5] < wp_info.statReq.favor) {
            temp_status.f.push(0);
        } else {
            temp_status.f.push(2);
        }
        temp_status.mf = Math.min.apply(null, temp_status.f);
    }
    return temp_status;
}

export function calcSetBaseStatus(setInfo: SetInfo) {
    // 统计船的性能
    const submarineStore = useSubmarineStoreWithoutSetup();
    const status = submarineStore.maxRankBonus.slice();
    const components = submarineStore.components;

    const set = setInfo.set;

    const component_code = [] as string[];
    let valid = true;
    for (let i = 0; i < 4; i++) {
        if (set[i] >= 0) {
            component_code.push(components[set[i]].code);
            const component = components[set[i]];

            status[0] += component.getWeight(i);
            status[1] += component.getExplore(i);
            status[2] += component.getCollect(i);
            status[3] += component.getSpeed(i);
            status[4] += component.getDistance(i);
            status[5] += component.getFavor(i);
        } else {
            valid = false;
        }
    }
    for (let i = 0; i < status.length; i++) {
        const value = status[i];
        if (value <= 0) {
            valid = false;
        }
    }

    // 生成回传数据
    return {
        n: setInfo.name ? setInfo.name : '',
        c: component_code,
        set: set.slice(),
        st: status,
        t: '',
        s: [] as number[], // 探索性能
        r: [] as number[], // 收集性能
        f: [] as number[], // 恩惠
        ms: 0, // 最差探索性能
        mr: 0, // 最差收集性能
        mf: 0, // 最差恩惠
        v: valid, // 船配置的有效性（是否件全，是否属性没有负值）
    } as SetStatus;
}
