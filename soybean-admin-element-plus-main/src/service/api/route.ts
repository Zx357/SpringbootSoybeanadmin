import type { ElegantConstRoute } from '@elegant-router/types';
import { request } from '../request';
import { createStaticRoutes } from '@/router/routes';
import { useAuthStore } from '@/store/modules/auth';

type RuoYiMenuRoute = Api.RuoYi.MenuRoute;

/** 获取常量路由（本地静态；若依后端无此接口，直接返回本地常量路由） */
export async function fetchGetConstantRoutes() {
  const { constantRoutes } = createStaticRoutes();

  return { data: constantRoutes as unknown as Api.Route.MenuRoute[], error: null };
}

/**
 * 获取用户路由
 *
 * 调用若依 /getRouters，把若依菜单路由转换为 soybean 的 ElegantConstRoute 结构
 */
export async function fetchGetUserRoutes() {
  const { data: body, error } = await request<Api.RuoYi.AjaxResult<{ data: RuoYiMenuRoute[] }>>({
    url: '/getRouters'
  });

  if (!error) {
    const routes = convertRuoYiRoutes(body?.data || []);

    return { data: { routes, home: 'home' as any }, error: null };
  }

  return { data: body, error };
}

/** 路由是否存在（动态模式下本地检查） */
export async function fetchIsRouteExist(routeNameOrPath: string) {
  const { router } = await import('@/router');
  return router.getRoutes().some(item => item.name === routeNameOrPath || item.path === routeNameOrPath);
}

function isHttp(path?: string) {
  return Boolean(path && /^https?:\/\//.test(path));
}

/** 由若依组件路径推导 view 名称（与 src/views 下文件结构对应） */
function getViewName(component: string) {
  const segments = component.replace(/^\//, '').split('/').filter(Boolean);
  if (segments.length > 1 && segments[segments.length - 1] === 'index') {
    segments.pop();
  }
  return segments.join('_');
}

/** 由完整路径推导目录节点名称 */
function getDirName(fullPath: string) {
  return fullPath
    .replace(/^\//, '')
    .split('/')
    .filter(Boolean)
    .join('_');
}

/** 解析若依 query 参数（如 '{"id": 1}'）为 soybean meta.query */
function parseRouteQuery(query?: string) {
  if (!query) return undefined;
  try {
    const obj = JSON.parse(query);
    const result = Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));
    return result.length ? result : undefined;
  } catch {
    return undefined;
  }
}

let linkSeq = 0;

/**
 * 转换单个若依路由节点
 *
 * @param node 若依路由节点
 * @param parentPath 父级完整路径
 * @param order 排序号
 */
function convertRoute(node: RuoYiMenuRoute, parentPath: string, order: number): ElegantConstRoute | null {
  const rawPath = node.path || '';

  // 外链菜单：新窗口打开（对应 soybean meta.href 机制）
  if (isHttp(rawPath)) {
    linkSeq += 1;
    const slug = rawPath
      .replace(/^https?:\/\//, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    return {
      name: `ext-link-${slug || linkSeq}`,
      path: `/ext-link/${slug || linkSeq}`,
      component: 'layout.base$view.iframe-page',
      props: { url: rawPath },
      meta: {
        title: node.meta?.title || rawPath,
        localIcon: node.meta?.icon || undefined,
        hideInMenu: node.hidden,
        order,
        href: rawPath
      }
    };
  }

  // 完整路径（子节点为相对路径，需要拼接）
  const fullPath = rawPath.startsWith('/') ? rawPath : `${parentPath}/${rawPath}`.replace(/\/+/g, '/');

  const meta: Record<string, any> = {
    title: node.meta?.title || fullPath,
    hideInMenu: Boolean(node.hidden),
    order
  };

  if (node.meta?.icon && node.meta.icon !== '#') {
    meta.localIcon = node.meta.icon;
  }
  // 若依 noCache: true 表示不缓存
  meta.keepAlive = !node.meta?.noCache;
  const routeQuery = parseRouteQuery(node.query);
  if (routeQuery) {
    meta.query = routeQuery;
  }

  const route: ElegantConstRoute = {
    name: '',
    path: fullPath,
    meta
  } as ElegantConstRoute;

  // 组件映射
  if (node.component === 'Layout') {
    route.component = 'layout.base';
    route.name = getDirName(fullPath);
  } else if (node.component === 'ParentView') {
    route.component = 'layout.blank';
    route.name = getDirName(fullPath);
  } else if (node.component === 'InnerLink' || isHttp(node.meta?.link || '')) {
    // 内嵌 iframe 页面
    const url = node.meta?.link || `http://${fullPath.replace(/^\//, '').replace(/\//g, '.')}`;
    route.component = 'view.iframe-page';
    route.props = { url };
    route.name = getDirName(fullPath);
  } else if (node.component) {
    route.component = `view.${getViewName(node.component)}`;
    route.name = getViewName(node.component);
  } else {
    route.name = getDirName(fullPath);
  }

  // 递归处理子节点（子节点使用完整路径）
  if (node.children?.length) {
    route.children = node.children
      .map((child, index) => convertRoute(child, fullPath, index + 1))
      .filter(Boolean) as ElegantConstRoute[];
  }

  return route;
}

/** 转换若依 /getRouters 数据 */
function convertRuoYiRoutes(routers: RuoYiMenuRoute[]): ElegantConstRoute[] {
  const routes = routers
    .map((node, index) => convertRoute(node, '', index + 2))
    .filter(Boolean) as ElegantConstRoute[];

  // 首页（若依前端常量路由 /index）
  routes.unshift({
    name: 'home',
    path: '/home',
    component: 'layout.base$view.home',
    meta: {
      title: '首页',
      localIcon: 'dashboard',
      order: 1
    }
  } as ElegantConstRoute);

  // 追加若依前端隐藏动态路由（原 dynamicRoutes）
  routes.push(...buildExtraHiddenRoutes());

  return routes;
}

/** 若依前端 dynamicRoutes（隐藏页面），按权限过滤 */
function buildExtraHiddenRoutes(): ElegantConstRoute[] {
  const authStore = useAuthStore();
  const buttons = authStore.userInfo.buttons || [];
  // 若依 admin 拥有通配权限 *:*:*
  const hasPermi = (...perms: string[]) =>
    perms.some(p => buttons.includes(p) || buttons.includes('*:*:*'));

  const children: ElegantConstRoute[] = [];

  // 个人中心（所有登录用户可见）
  children.push({
    name: 'system_user_profile',
    path: '/user/profile/:activeTab?',
    component: 'view.system_user_profile',
    meta: {
      title: '个人中心',
      hideInMenu: true,
      localIcon: 'user',
      keepAlive: false
    }
  } as ElegantConstRoute);

  // 字典数据
  if (hasPermi('system:dict:list')) {
    children.push({
      name: 'system_dict_data',
      path: '/system/dict-data/index/:dictId',
      component: 'view.system_dict_data',
      meta: {
        title: '字典数据',
        hideInMenu: true,
        localIcon: 'dict',
        activeMenu: 'system_dict',
        keepAlive: false
      }
    } as ElegantConstRoute);
  }

  // 调度日志
  if (hasPermi('monitor:job:list')) {
    children.push({
      name: 'monitor_job_log',
      path: '/monitor/job-log/index/:jobId',
      component: 'view.monitor_job_log',
      meta: {
        title: '调度日志',
        hideInMenu: true,
        localIcon: 'log',
        activeMenu: 'monitor_job',
        keepAlive: false
      }
    } as ElegantConstRoute);
  }

  // 修改生成配置
  if (hasPermi('tool:gen:edit')) {
    children.push({
      name: 'tool_gen_editTable',
      path: '/tool/gen-edit/index/:tableId',
      component: 'view.tool_gen_editTable',
      meta: {
        title: '修改生成配置',
        hideInMenu: true,
        localIcon: 'code',
        activeMenu: 'tool_gen',
        keepAlive: false
      }
    } as ElegantConstRoute);
  }

  // 用户分配角色
  if (hasPermi('system:user:edit')) {
    children.push({
      name: 'system_user_authRole',
      path: '/system/user-auth/role/:userId(\\d+)',
      component: 'view.system_user_authRole',
      meta: {
        title: '分配角色',
        hideInMenu: true,
        localIcon: 'peoples',
        activeMenu: 'system_user',
        keepAlive: false
      }
    } as ElegantConstRoute);
  }

  // 角色分配用户
  if (hasPermi('system:role:edit')) {
    children.push({
      name: 'system_role_authUser',
      path: '/system/role-auth/user/:roleId(\\d+)',
      component: 'view.system_role_authUser',
      meta: {
        title: '分配用户',
        hideInMenu: true,
        localIcon: 'user',
        activeMenu: 'system_role',
        keepAlive: false
      }
    } as ElegantConstRoute);
  }

  if (!children.length) return [];

  // 统一包裹 layout.base，使隐藏子页在主布局（侧边栏/顶栏/标签页）内渲染
  return [
    {
      name: 'ruoyi-extra',
      path: '/ruoyi-extra',
      component: 'layout.base',
      meta: {
        title: '扩展页面',
        hideInMenu: true,
        order: 999
      },
      children
    } as ElegantConstRoute
  ];
}
