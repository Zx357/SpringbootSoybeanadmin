import { ruoyiRequest } from '../helper';

// 查询部门列表
export function listDept(query: any) {
  return ruoyiRequest({ url: '/system/dept/list', method: 'get', params: query });
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId: any) {
  return ruoyiRequest({ url: `/system/dept/list/exclude/${deptId}`, method: 'get' });
}

// 查询部门详细
export function getDept(deptId: any) {
  return ruoyiRequest({ url: `/system/dept/${deptId}`, method: 'get' });
}

// 新增部门
export function addDept(data: any) {
  return ruoyiRequest({ url: '/system/dept', method: 'post', data });
}

// 修改部门
export function updateDept(data: any) {
  return ruoyiRequest({ url: '/system/dept', method: 'put', data });
}

// 保存部门排序
export function updateDeptSort(data: any) {
  return ruoyiRequest({ url: '/system/dept/updateSort', method: 'put', data });
}

// 删除部门
export function delDept(deptId: any) {
  return ruoyiRequest({ url: `/system/dept/${deptId}`, method: 'delete' });
}
