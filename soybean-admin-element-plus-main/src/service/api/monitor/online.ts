import { ruoyiRequest } from '../helper';

// 查询在线用户列表
export function list(query: any) {
  return ruoyiRequest({ url: '/monitor/online/list', method: 'get', params: query });
}

// 强退用户
export function forceLogout(tokenId: any) {
  return ruoyiRequest({ url: `/monitor/online/${tokenId}`, method: 'delete' });
}
