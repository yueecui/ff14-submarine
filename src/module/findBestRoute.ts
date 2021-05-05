export function findBestRoute(wp_ary: Array<number>, startPoint: Record<string, any>, wayPoints: Record<number, Record<string, any>>){
  const trees = loopTree(wp_ary);  // 生成所有航路排列
  let route = [] as Array<number>;  // 最短航路
  let distance = 0;  // 最短距离
  let time = 0;  // 最短时间
  let ms = 0; // 最大需要的探索 max_surveillance
  let mr = 0; // 最大需要的收集 max_retrieval
  let mf = 0; // 最大需要的恩惠 max_favor
  for (let j=0;j<trees.length;j++){
    const tree = trees[j];
    let temp_d = 0;  // 本路线距离
    let temp_t = 0;  // 本路线时间
    let temp_ms = 0;
    let temp_mr = 0;
    let temp_mf = 0;
    // 计算本条航线的总距离、时间、必要需求
    for (let i=0;i<tree.length;i++){
      if (i === 0){
        temp_d += startPoint.toDestination[tree[i]].range;
        temp_t += startPoint.toDestination[tree[i]].distance;
      }else{
        temp_d += wayPoints[tree[i-1]].toDestination[tree[i]].range;
        temp_t += wayPoints[tree[i-1]].toDestination[tree[i]].distance;
      }
      temp_d += wayPoints[tree[i]].surveyRange;
      temp_t += wayPoints[tree[i]].surveyDistance;
      temp_ms = temp_ms > wayPoints[tree[i]].statReq.surveillance.high ? temp_ms : wayPoints[tree[i]].statReq.surveillance.high;
      temp_mr = temp_mr > wayPoints[tree[i]].statReq.retrieval.optim ? temp_mr : wayPoints[tree[i]].statReq.retrieval.optim;
      temp_mf = temp_mf > wayPoints[tree[i]].statReq.favor ? temp_mf : wayPoints[tree[i]].statReq.favor;
    }
    // 对比本条航线和已记录的最短记录
    if (time === 0 || temp_t < time || (temp_t == time && temp_d < distance)){
      distance = temp_d;
      time = temp_t;
      route = tree;
    }
    ms = temp_ms > ms ? temp_ms : ms;
    mr = temp_mr > mr ? temp_mr : mr;
    mf = temp_mf > mf ? temp_mf : mf;
  }

  return {
    routeOrder: route,
    routeCode: route.map((wp_id) => { return wayPoints[wp_id].code; }),
    time: time,
    distance: distance,
    max_surveillance: ms,
    max_retrieval: mr,
    max_favor: mf,
  };
}

// 给定一个数组，生成所有的组合
function loopTree(ary: Array<number>) : Array<Array<number>>{
    const r = [];
    if (ary.length > 1) {
        for (let i = 0; i < ary.length; i++){
            const s = ary.slice();
            const t = s.splice(i, 1);
            const u = loopTree(s);
            for (let j=0;j<u.length;j++){
                const uu = u[j];
                const v = uu.concat(t);
                r.push(v);
            }
        }
        return r;
    } else {
        return [ary];
    }
}