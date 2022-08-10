import { convertLuaTable } from './convertLuaTable';

let dataCache: any;

/**
 * 获取写在页面中的数据
 */
export function getData(key: string) {
    if (!dataCache) {
        if (window.mw) {
            dataCache = convertLuaTable(window.mw.config.get(`wgHuijiVars.${key}`));
        } else {
            dataCache = convertLuaTable(window.DATA!);
            window.DATA = dataCache;
        }
    }

    return dataCache;
}
