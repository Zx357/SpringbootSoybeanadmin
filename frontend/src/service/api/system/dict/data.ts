import { ruoyiRequest } from '../../helper';

// 查询字典数据列表
export function listData(query: any) {
  return ruoyiRequest({ url: '/system/dict/data/list', method: 'get', params: query });
}

// 查询字典数据详细
export function getData(dictCode: any) {
  return ruoyiRequest({ url: `/system/dict/data/${dictCode}`, method: 'get' });
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType: string) {
  return ruoyiRequest({ url: `/system/dict/data/type/${dictType}`, method: 'get' });
}

// 新增字典数据
export function addData(data: any) {
  return ruoyiRequest({ url: '/system/dict/data', method: 'post', data });
}

// 修改字典数据
export function updateData(data: any) {
  return ruoyiRequest({ url: '/system/dict/data', method: 'put', data });
}

// 删除字典数据
export function delData(dictCode: any) {
  return ruoyiRequest({ url: `/system/dict/data/${dictCode}`, method: 'delete' });
}
