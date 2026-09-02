import { request } from '../request';
import { getServiceBaseURL } from '@/utils/service';
import { localStg } from '@/utils/storage';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

/**
 * 登录（若依 /login）
 *
 * @param userName 用户名
 * @param password 密码
 * @param code 验证码
 * @param uuid 验证码唯一标识
 */
export function fetchLogin(userName: string, password: string, code?: string, uuid?: string) {
  return request<Api.RuoYi.AjaxResult<Api.RuoYi.LoginResult>>({
    url: '/login',
    method: 'post',
    data: {
      username: userName,
      password,
      code,
      uuid
    }
  });
}

/** 获取用户信息（若依 /getInfo），映射为 soybean 用户结构 */
export async function fetchGetUserInfo() {
  const { data, error } = await request<Api.RuoYi.GetInfoResult>({ url: '/getInfo' });

  if (!error) {
    let avatar = data.user.avatar || '';
    if (avatar && !/^https?:\/\//.test(avatar)) {
      avatar = baseURL + avatar;
    }

    const info: Api.Auth.UserInfo = {
      userId: String(data.user.userId),
      userName: data.user.userName,
      nickName: data.user.nickName,
      avatar,
      roles: data.roles?.length ? data.roles : ['ROLE_DEFAULT'],
      buttons: data.permissions || [],
      user: data.user
    };

    // 保存若依附加信息，供个人中心等页面使用
    localStg.set('ruoyiUserInfo', data.user as any);
    sessionStorage.setItem('pwrChrtype', data.pwdChrtype || '');

    return { data: info, error: null };
  }

  return { data, error };
}

/** 退出登录（若依 /logout） */
export function fetchLogout() {
  return request({ url: '/logout', method: 'post' });
}

/** 获取验证码（若依 /captchaImage） */
export function fetchGetCodeImg() {
  return request<Api.RuoYi.AjaxResult<Api.RuoYi.CaptchaResult>>({ url: '/captchaImage' });
}

/** 注册（若依 /register） */
export function fetchRegister(data: { username: string; password: string; confirmPassword: string; code?: string; uuid?: string }) {
  return request<Api.RuoYi.AjaxResult>({
    url: '/register',
    method: 'post',
    data
  });
}

/** 获取若依路由（/getRouters），原始数据 */
export function fetchGetRouters() {
  return request<Api.RuoYi.MenuRoute[]>({ url: '/getRouters' });
}
