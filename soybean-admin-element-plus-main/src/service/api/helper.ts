import { request } from '../request';

/**
 * 若依风格请求封装
 *
 * 与若依 request 保持一致的调用习惯：
 * - 成功时直接 resolve AjaxResult / TableDataInfo 响应体（含 code/msg/rows/total/data 等）
 * - 失败时 reject（错误消息已由请求层统一提示）
 */
export async function ruoyiRequest<T = any>(config: any): Promise<T> {
  const { data, error } = await request<T>(config);
  if (error) {
    return Promise.reject(error);
  }
  return data as T;
}
