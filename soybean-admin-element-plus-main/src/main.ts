import { createApp } from 'vue';
import './plugins/assets';
import './plugins/ui';
import { setupAppVersionNotification, setupDayjs, setupIconifyOffline, setupLoading, setupNProgress } from './plugins';
import { setupStore } from './store';
import { setupRouter } from './router';
import { setupI18n } from './locales';
import App from './App.vue';

async function setupApp() {
  setupLoading();

  setupNProgress();

  setupIconifyOffline();

  setupDayjs();

  const app = createApp(App);

  setupStore(app);

  await setupRouter(app);

  setupI18n(app);

  // 延迟加载若依插件：其依赖 store/service 链，需在路由初始化完成后注册，避免循环依赖
  const { setupRuoYi } = await import('./plugins/ruoyi');
  setupRuoYi(app);

  setupAppVersionNotification();

  app.mount('#app');
}

setupApp();
