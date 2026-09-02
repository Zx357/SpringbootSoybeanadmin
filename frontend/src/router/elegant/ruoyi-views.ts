import type { RouteComponent } from 'vue-router';

/**
 * 若依子页面视图映射（非 index.vue 的页面组件）
 *
 * elegant-router 仅根据 index.vue 生成视图映射，
 * 若依后端菜单（如 monitor/cache/list）与前端隐藏路由
 * 需要引用非 index.vue 页面，这里手动补充。
 */
export const ruoyiViews: Record<string, RouteComponent | (() => Promise<RouteComponent>)> = {
  system_dict_data: () => import('@/views/system/dict/data.vue'),
  system_dict_detail: () => import('@/views/system/dict/detail.vue'),
  system_user_authRole: () => import('@/views/system/user/authRole.vue'),
  system_user_view: () => import('@/views/system/user/view.vue'),
  system_role_authUser: () => import('@/views/system/role/authUser.vue'),
  system_role_selectUser: () => import('@/views/system/role/selectUser.vue'),
  monitor_job_detail: () => import('@/views/monitor/job/detail.vue'),
  monitor_job_log: () => import('@/views/monitor/job/log.vue'),
  monitor_operlog_detail: () => import('@/views/monitor/operlog/detail.vue'),
  monitor_cache_list: () => import('@/views/monitor/cache/list.vue'),
  tool_gen_editTable: () => import('@/views/tool/gen/editTable.vue'),
  tool_gen_importTable: () => import('@/views/tool/gen/importTable.vue'),
  tool_gen_createTable: () => import('@/views/tool/gen/createTable.vue')
};
