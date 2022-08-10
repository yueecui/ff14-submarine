// 从页面获取数据

import type { SubmarineData } from '../types/ff14data';
import { getData } from './util/getData';

/**
 * 获取所有lua写到页面的数据
 */
export function getSubmarineData() {
    return getData('DATA') as SubmarineData;
}

export function getItemData() {
    return getSubmarineData().item_db;
}
