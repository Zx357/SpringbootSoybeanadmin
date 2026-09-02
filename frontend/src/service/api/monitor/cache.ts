import { ruoyiRequest } from '../helper';

// 查询缓存详细
export function getCache() {
  return ruoyiRequest({ url: '/monitor/cache', method: 'get' });
}

// 查询缓存名称列表
export function listCacheName() {
  return ruoyiRequest({ url: '/monitor/cache/getNames', method: 'get' });
}

// 查询缓存键名列表
export function listCacheKey(cacheName: string) {
  return ruoyiRequest({ url: `/monitor/cache/getKeys/${cacheName}`, method: 'get' });
}

// 查询缓存内容
export function getCacheValue(cacheName: string, cacheKey: string) {
  return ruoyiRequest({ url: `/monitor/cache/getValue/${cacheName}/${cacheKey}`, method: 'get' });
}

// 清理指定名称缓存
export function clearCacheName(cacheName: string) {
  return ruoyiRequest({ url: `/monitor/cache/clearCacheName/${cacheName}`, method: 'delete' });
}

// 清理指定键名缓存
export function clearCacheKey(cacheKey: string) {
  return ruoyiRequest({ url: `/monitor/cache/clearCacheKey/${cacheKey}`, method: 'delete' });
}

// 清理全部缓存
export function clearCacheAll() {
  return ruoyiRequest({ url: '/monitor/cache/clearCacheAll', method: 'delete' });
}
