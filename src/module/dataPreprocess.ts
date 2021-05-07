import { luaTableToArray } from '../module/util/luaTableToArray'

// 数据预处理：船体零件
export function preprocessComponents(all_data: Record<string, any>){
  const components = luaTableToArray(all_data.components);
  for (const component of components){
    component.items = luaTableToArray(component.items);
    component.s = [
      // 船体,船尾,船首,舰桥
      [], [], [], []
    ]
    for (const item_id of component.items){
      const item_info = all_data.item_db[item_id]
      if (item_info == undefined){
        // console.error('物品ID<'+item_id+'>没有数据，请检查！')
      }else{
        const part = item_info['机体数据'];
        component.s[part['位置']] = [
          part['重量'],
          part['探索性能'],
          part['收集性能'],
          part['巡航速度'],
          part['航行距离'],
          part['恩惠'],
          item_id
        ]
      }
    }
    delete component.items;
  }
  return components;
}

// 数据预处理：航点数据
export function preprocessWaypoints(all_data: Record<string, any>, state_map: Record<number, Record<string, any>>){
  const waypoints = {} as Record<number, Record<string, any>>;
  for (const point_index in all_data.point_data){
    const point_info = all_data.point_data[point_index];
    if (point_info.start){
      state_map[point_info.map].info = point_info;
      continue;
    }
    if (waypoints[point_info.map] == undefined)  { waypoints[point_info.map] = {} as Record<string, any>; }
    // 修正数据
    for (const drop_type in point_info.drop){
      if (typeof(point_info.drop) == 'object'){
        point_info.drop[drop_type] = luaTableToArray(point_info.drop[drop_type]);
      }
    }
    waypoints[point_info.map][point_info.id] = point_info;
  }
  return waypoints;
}