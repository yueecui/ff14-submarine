export function luaTableToArray(table: Record<string, any>){
    const key_list = Object.keys(table);
    key_list.sort((a: string, b: string) => {
        return parseInt(a) - parseInt(b);
    })
    const result = [];
    for (const key of key_list){
        result.push(table[key]);
    }
    return result;
}