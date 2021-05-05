export function calcStatus(set: Array<number|string>, components: Array<Record<string, any>>, bonus: Array<number>){
  // 统计船的性能
  var status = bonus.slice();
  var component_code = [];
  var valid = true;
  for (var i=0;i<4;i++){
    if (set[i] >= 0){
      component_code.push(components[set[i] as number].c);
      var component = components[set[i] as number].s[i];
      for (var j=0;j<status.length;j++){
        status[j] += component[j];
      }
    }else{
      valid = false;
    }
  }
  for (var i=0;i<status.length;i++){
    var value = status[i];
    if (value <= 0) { valid = false; }
  }
  // 生成回传数据
  var temp_status = {
    n: set[4] ? set[4] : '',
    c: component_code,
    set: set.slice(),
    st: status,
    t: this.getRouteTimeText(status[3]),
    s: [],  // 探索性能
    r: [],  // 收集性能
    f: [],  // 恩惠
    ms: 0,  // 最差探索性能
    mr: 0,  // 最差收集性能
    mf: 0,  // 最差恩惠
    v: valid,  // 船配置的有效性（是否件全，是否属性没有负值）
  }
  // 循环航点判断
  for (var i=0;i<this.routeInfo.r.length;i++){
    var wp = this.routeInfo.r[i];
    var wp_info = this.waypoints[wp];
    // 0重量, 1探索, 2收集, 3速度, 4距离, 5恩惠

    // 探索性能判断
    if (status[1] < wp_info.s[0]){
      temp_status.s.push(0);
    }else if(status[1] < wp_info.s[1]){
      temp_status.s.push(1);
    }else{
      temp_status.s.push(2);
    }
    temp_status.ms = Math.min.apply(null, temp_status.s);

    // 收集性能判定
    if (status[2] < wp_info.r[0]){
      temp_status.r.push(0);
    }else if(status[2] < wp_info.r[1]){
      temp_status.r.push(1);
    }else{
      temp_status.r.push(2);
    }
    temp_status.mr = Math.min.apply(null, temp_status.r);

    // 恩惠判定
    if (status[5] < wp_info.f){
      temp_status.f.push(0);
    }else{
      temp_status.f.push(2);
    }
    temp_status.mf = Math.min.apply(null, temp_status.f);
  }
  return temp_status;
},