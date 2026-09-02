import { ruoyiRequest } from '../helper';

// 查询参数列表
export function listConfig(query: any) {
  return ruoyiRequest({ url: '/system/config/list', method: 'get', params: query });
}

// 查询参数详细
export function getConfig(configId: any) {
  return ruoyiRequest({ url: `/system/config/${configId}`, method: 'get' });
}

// 根据参数键名查询参数值
export function getConfigKey(configKey: string) {
  return ruoyiRequest({ url: `/system/config/configKey/${configKey}`, method: 'get' });
}

// 新增参数配置
export function addConfig(data: any) {
  return ruoyiRequest({ url: '/system/config', method: 'post', data });
}

// 修改参数配置
export function updateConfig(data: any) {
  return ruoyiRequest({ url: '/system/config', method: 'put', data });
}

// 删除参数配置
export function delConfig(configId: any) {
  return ruoyiRequest({ url: `/system/config/${configId}`, method: 'delete' });
}

// 刷新参数缓存
export function refreshCache() {
  return ruoyiRequest({ url: '/system/config/refreshCache', method: 'delete' });
}
