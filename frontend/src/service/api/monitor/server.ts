import { ruoyiRequest } from '../helper';

// 获取服务信息
export function getServer() {
  return ruoyiRequest({ url: '/monitor/server', method: 'get' });
}
