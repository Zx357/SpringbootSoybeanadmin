import { request } from '@/service/request';

/**
 * 若依风格请求适配器
 *
 * 若依前端代码约定：请求成功时 Promise resolve 整个响应体（如 { code, msg, rows, total }），
 * 失败时 reject。此适配器把 soybean 的 flat request 转换为该约定，
 * 使若依的 src/api/* 文件可以原样使用（仅需 import 本文件）。
 */
export default function requestAdapter(config: any): Promise<any> {
  return request(config).then(({ data, error }: { data: any; error: any }) => {
    if (error) {
      return Promise.reject(error);
    }
    return data;
  });
}
