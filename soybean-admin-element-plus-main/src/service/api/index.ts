export * from './auth';
export * from './route';
export * from './system-manage';

/** 模拟后端自定义错误（soybean 示例页 function/request 使用） */
export function fetchCustomBackendError(code: string, msg: string) {
  return import('../request').then(({ request }) =>
    request({ url: '/auth/error', params: { code, msg } })
  ) as Promise<any>;
}

// 若依 API 模块
export * from './helper';
export * from './system/user';
export * from './system/role';
export * from './system/menu';
export * from './system/dept';
export * from './system/post';
export * from './system/config';
export * from './system/notice';
export * from './system/dict/data';
export * from './system/dict/type';
export * from './monitor/online';
export * from './monitor/job';
export * from './monitor/jobLog';
export * from './monitor/operlog';
export * from './monitor/logininfor';
export * from './monitor/server';
export * from './monitor/cache';
export * from './tool/gen';
