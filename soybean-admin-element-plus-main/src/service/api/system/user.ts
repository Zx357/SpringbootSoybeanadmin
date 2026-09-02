import { ruoyiRequest } from '../helper';
import { parseStrEmpty } from '@/utils/ruoyi';

// 查询用户列表
export function listUser(query: any) {
  return ruoyiRequest({ url: '/system/user/list', method: 'get', params: query });
}

// 查询用户详细
export function getUser(userId: any) {
  return ruoyiRequest({ url: `/system/user/${parseStrEmpty(userId)}`, method: 'get' });
}

// 新增用户
export function addUser(data: any) {
  return ruoyiRequest({ url: '/system/user', method: 'post', data });
}

// 修改用户
export function updateUser(data: any) {
  return ruoyiRequest({ url: '/system/user', method: 'put', data });
}

// 删除用户
export function delUser(userId: any) {
  return ruoyiRequest({ url: `/system/user/${userId}`, method: 'delete' });
}

// 用户密码重置
export function resetUserPwd(userId: any, password: string) {
  const data = { userId, password };
  return ruoyiRequest({ url: '/system/user/resetPwd', method: 'put', data });
}

// 用户状态修改
export function changeUserStatus(userId: any, status: string) {
  const data = { userId, status };
  return ruoyiRequest({ url: '/system/user/changeStatus', method: 'put', data });
}

// 查询用户个人信息
export function getUserProfile() {
  return ruoyiRequest({ url: '/system/user/profile', method: 'get' });
}

// 修改用户个人信息
export function updateUserProfile(data: any) {
  return ruoyiRequest({ url: '/system/user/profile', method: 'put', data });
}

// 用户密码重置
export function updateUserPwd(oldPassword: string, newPassword: string) {
  const data = { oldPassword, newPassword };
  return ruoyiRequest({ url: '/system/user/profile/updatePwd', method: 'put', data });
}

// 用户头像上传
export function uploadAvatar(data: any) {
  return ruoyiRequest({
    url: '/system/user/profile/avatar',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data
  });
}

// 查询授权角色
export function getAuthRole(userId: any) {
  return ruoyiRequest({ url: `/system/user/authRole/${userId}`, method: 'get' });
}

// 保存授权角色
export function updateAuthRole(data: any) {
  return ruoyiRequest({ url: '/system/user/authRole', method: 'put', params: data });
}

// 查询部门下拉树结构
export function deptTreeSelect() {
  return ruoyiRequest({ url: '/system/user/deptTree', method: 'get' });
}
