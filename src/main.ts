import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { getAllData } from './module/util/getData'

store.commit('initAllData', getAllData());
store.commit('loadLocalData');

(window as any).store = store;

createApp(App).use(store).mount('#app-submarine-tool')
