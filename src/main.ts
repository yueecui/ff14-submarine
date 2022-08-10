import { createApp } from 'vue';
import App from './App.vue';
import { setupStore } from './stores';
import { useSubmarineStoreWithoutSetup } from './stores/submarine';

// 创建APP实例
const app = createApp(App);

// 加载仓库
setupStore(app);

const submarineStore = useSubmarineStoreWithoutSetup();
submarineStore.loadLocalData();
submarineStore.initAllData();

// 挂在APP实例在DOM中
app.mount('#app-submarine-tool');
