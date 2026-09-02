import type { App } from 'vue';
import { useRouter } from 'vue-router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import { useAuthStore } from '@/store/modules/auth';
import modal from './modal';
import { download, default as downloadPlugin } from '@/utils/download';
import {
  addDateRange,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
  selectDictLabels
} from '@/utils/ruoyi';
import { useDict } from '@/utils/dict';
import { hasPermi, hasRole } from '@/directive/permission';
import { getConfigKey } from '@/service/api/system/config';
import Pagination from '@/components/ruoyi/Pagination/index.vue';
import DictTag from '@/components/ruoyi/DictTag/index.vue';
import RightToolbar from '@/components/ruoyi/RightToolbar/index.vue';
import FileUpload from '@/components/ruoyi/FileUpload/index.vue';
import ImageUpload from '@/components/ruoyi/ImageUpload/index.vue';
import ImagePreview from '@/components/ruoyi/ImagePreview/index.vue';
import Editor from '@/components/ruoyi/Editor/index.vue';
import IconSelect from '@/components/ruoyi/IconSelect/index.vue';
import Crontab from '@/components/ruoyi/Crontab/index.vue';
import TreePanel from '@/components/ruoyi/TreePanel/index.vue';
import ExcelImportDialog from '@/components/ruoyi/ExcelImportDialog/index.vue';
import SvgIcon from '@/components/ruoyi/SvgIcon/index.vue';
import iFrame from '@/components/ruoyi/iFrame/index.vue';

/** 认证对象（对应若依 $auth） */
const auth = {
  hasPermi(value: string[]) {
    const permissions = useAuthStore().userInfo.buttons || [];
    const allPermission = '*:*:*';
    return permissions.some(permission => allPermission === permission || value.includes(permission));
  },
  hasRole(value: string[]) {
    const roles = useAuthStore().userInfo.roles || [];
    const superAdmin = 'admin';
    return roles.some(role => superAdmin === role || value.includes(role));
  }
};

/** 缓存对象（对应若依 $cache） */
const cache = {
  session: {
    set(key: string, value: any) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    get(key: string) {
      const val = sessionStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    },
    remove(key: string) {
      sessionStorage.removeItem(key);
    }
  },
  local: {
    set(key: string, value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    },
    get(key: string) {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    },
    remove(key: string) {
      localStorage.removeItem(key);
    }
  }
};

/** 页签操作（对应若依 $tab，简化为路由跳转） */
function createTab() {
  const router = useRouter();
  return {
    openPage(title: string, path: string, params?: Record<string, any>) {
      const query: Record<string, any> = {};
      if (params) {
        Object.keys(params).forEach(key => {
          query[key] = params[key];
        });
      }
      router.push({ path, query });
    },
    closeOpenPage(obj: { path: string; query?: Record<string, any> }) {
      router.push({ path: obj.path, query: obj.query });
    }
  };
}

/**
 * 注册若依全局组件、指令与实例属性
 */
export function setupRuoYi(app: App) {
  // 全局注册 Element Plus 图标（若依视图直接使用图标组件）
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
  }

  // 全局组件
  app.component('Pagination', Pagination);
  app.component('DictTag', DictTag);
  app.component('RightToolbar', RightToolbar);
  app.component('FileUpload', FileUpload);
  app.component('ImageUpload', ImageUpload);
  app.component('ImagePreview', ImagePreview);
  app.component('Editor', Editor);
  app.component('IconSelect', IconSelect);
  app.component('Crontab', Crontab);
  app.component('TreePanel', TreePanel);
  app.component('ExcelImportDialog', ExcelImportDialog);
  app.component('SvgIcon', SvgIcon);
  app.component('iFrame', iFrame);

  // 全局指令
  app.directive('hasPermi', hasPermi);
  app.directive('hasRole', hasRole);

  // 全局属性
  const globalProperties = app.config.globalProperties;
  globalProperties.useDict = useDict;
  globalProperties.download = download;
  globalProperties.parseTime = parseTime;
  globalProperties.resetForm = resetForm;
  globalProperties.handleTree = handleTree;
  globalProperties.addDateRange = addDateRange;
  globalProperties.getConfigKey = getConfigKey;
  globalProperties.selectDictLabel = selectDictLabel;
  globalProperties.selectDictLabels = selectDictLabels;
  globalProperties.$modal = modal;
  globalProperties.$download = downloadPlugin;
  globalProperties.$auth = auth;
  globalProperties.$cache = cache;
  globalProperties.$tab = {
    openPage: (title: string, path: string, params?: Record<string, any>) => {
      // 组件内调用时通过 router 跳转
      const router = (globalProperties.$router as any) || useRouter();
      router.push({ path, query: params });
    },
    closeOpenPage: (obj: { path: string; query?: Record<string, any> }) => {
      const router = (globalProperties.$router as any) || useRouter();
      router.push({ path: obj.path, query: obj.query });
    },
    closePage: () => {
      // 关闭当前页签并返回上一页（个人中心等场景）
      const router = (globalProperties.$router as any) || useRouter();
      router.back();
    }
  };
}

export { createTab };
