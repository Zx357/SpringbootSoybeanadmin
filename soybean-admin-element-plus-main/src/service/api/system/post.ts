import { ruoyiRequest } from '../helper';

// 查询岗位列表
export function listPost(query: any) {
  return ruoyiRequest({ url: '/system/post/list', method: 'get', params: query });
}

// 查询岗位详细
export function getPost(postId: any) {
  return ruoyiRequest({ url: `/system/post/${postId}`, method: 'get' });
}

// 新增岗位
export function addPost(data: any) {
  return ruoyiRequest({ url: '/system/post', method: 'post', data });
}

// 修改岗位
export function updatePost(data: any) {
  return ruoyiRequest({ url: '/system/post', method: 'put', data });
}

// 删除岗位
export function delPost(postId: any) {
  return ruoyiRequest({ url: `/system/post/${postId}`, method: 'delete' });
}
