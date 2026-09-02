import { ruoyiRequest } from '../helper';

// 查询菜单列表
export function listMenu(query: any) {
  return ruoyiRequest({ url: '/system/menu/list', method: 'get', params: query });
}

// 查询菜单详细
export function getMenu(menuId: any) {
  return ruoyiRequest({ url: `/system/menu/${menuId}`, method: 'get' });
}

// 查询菜单下拉树结构
export function treeselect() {
  return ruoyiRequest({ url: '/system/menu/treeselect', method: 'get' });
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId: any) {
  return ruoyiRequest({ url: `/system/menu/roleMenuTreeselect/${roleId}`, method: 'get' });
}

// 新增菜单
export function addMenu(data: any) {
  return ruoyiRequest({ url: '/system/menu', method: 'post', data });
}

// 修改菜单
export function updateMenu(data: any) {
  return ruoyiRequest({ url: '/system/menu', method: 'put', data });
}

// 保存菜单排序
export function updateMenuSort(data: any) {
  return ruoyiRequest({ url: '/system/menu/updateSort', method: 'put', data });
}

// 删除菜单
export function delMenu(menuId: any) {
  return ruoyiRequest({ url: `/system/menu/${menuId}`, method: 'delete' });
}
