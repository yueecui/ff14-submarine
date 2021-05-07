import { getRouteTimeCostText } from './routeTimeText'
import { routeInfo } from '../types'

export function calcSetStatus(set: Array<number|string>, store: any){
  // 别名数据
  const bonus = store.state.maxRankBonus as Array<number>;
  const components = store.state.components as Array<Record<string, any>>;
  const routeInfo = store.state.routeInfo as routeInfo;
  const currentWarpoints = store.getters.currentWarpoints as Record<number, Record<string, any>>;

  // 生成回传数据
  const temp_status = calcSetBaseStatus(set, bonus, components);
  temp_status.t = getRouteTimeCostText(routeInfo.time, temp_status.st[3]);

  const status = temp_status.st;

  // 循环航点判断
  for (let i=0;i<routeInfo.routeOrder.length;i++){
    const wp_id = routeInfo.routeOrder[i];
    const wp_info = currentWarpoints[wp_id];
    // 0重量, 1探索, 2收集, 3速度, 4距离, 5恩惠

    // 探索性能判断
    if (status[1] < wp_info.statReq.surveillance.mid){
      temp_status.s.push(0);
    }else if(status[1] < wp_info.statReq.surveillance.high){
      temp_status.s.push(1);
    }else{
      temp_status.s.push(2);
    }
    temp_status.ms = Math.min.apply(null, temp_status.s);

    // 收集性能判定
    if (status[2] < wp_info.statReq.retrieval.norm){
      temp_status.r.push(0);
    }else if(status[2] < wp_info.statReq.retrieval.optim){
      temp_status.r.push(1);
    }else{
      temp_status.r.push(2);
    }
    temp_status.mr = Math.min.apply(null, temp_status.r);

    // 恩惠判定
    if (status[5] < wp_info.statReq.favor){
      temp_status.f.push(0);
    }else{
      temp_status.f.push(2);
    }
    temp_status.mf = Math.min.apply(null, temp_status.f);
  }
  return temp_status;
}

export function calcSetBaseStatus(set: Array<number|string>, bonus: Array<number>, components: Array<Record<string, any>>){
  // 统计船的性能
  const status = bonus.slice();
  const component_code = [];
  let valid = true;
  for (let i=0;i<4;i++){
    if (set[i] >= 0){
      component_code.push(components[set[i] as number].c);
      const component = components[set[i] as number].s[i];
      for (let j=0;j<status.length;j++){
        status[j] += component[j];
      }
    }else{
      valid = false;
    }
  }
  for (let i=0;i<status.length;i++){
    const value = status[i];
    if (value <= 0) { valid = false; }
  }

  // 生成回传数据
  return {
    n: set[4] ? set[4] : '',
    c: component_code,
    set: set.slice(),
    st: status,
    t: '',
    s: [] as Array<number>,  // 探索性能
    r: [] as Array<number>,  // 收集性能
    f: [] as Array<number>,  // 恩惠
    ms: 0,  // 最差探索性能
    mr: 0,  // 最差收集性能
    mf: 0,  // 最差恩惠
    v: valid,  // 船配置的有效性（是否件全，是否属性没有负值）
  }
}