// 计算属性
// 当前地图有价值的物品列表
export function getCurrentRewards(itemDB: any, currentWarpoints: any){
  const reward_id_list = [] as Array<number>;
  for (const p_id in currentWarpoints){
    const p_info = currentWarpoints[p_id];
    const drop_list = [...p_info.drop.low, ...p_info.drop.mid, ...p_info.drop.high];
    for (const item_id of drop_list){
    if (!reward_id_list.includes(item_id)){
        reward_id_list.push(item_id);
    }
    }
  }
  const reward_list = [] as Array<Record<string, any>>;
  reward_id_list.forEach((item_id) => {
    const item_info = itemDB[item_id];
    if (item_info.valuable){
    reward_list.push(item_info);
    }
  })
  reward_list.sort( (a, b) => {
    if (a.category != b.category){
    return a.category - b.category;
    }else{
    return b.ID - a.ID;
    }
  })
  return reward_list;
}

// 根据地图航点生成掉落物品的反查表
export function generateDropMap(currentWarpoints: any){
  const drop_map = {} as Record<number, Array<any>>;
  for (const p_index in currentWarpoints){
    const p_info = currentWarpoints[p_index];
    for (const item_id of [...p_info.drop.low, ...p_info.drop.mid, ...p_info.drop.high]){
      if (!drop_map[item_id]) { drop_map[item_id] = []; }
      drop_map[item_id].push(p_info.id);
    }
  }
  return drop_map;
}