declare namespace Api {
  /**
   * namespace RuoYi
   *
   * 若依后端接口通用返回结构
   */
  namespace RuoYi {
    /** 若依 AjaxResult: { code, msg, ...data } */
    type AjaxResult<T = Record<string, any>> = {
      code: number;
      msg: string;
    } & T;

    /** 若依 TableDataInfo: { code, msg, rows, total } */
    interface TableData<Row = any> {
      code: number;
      msg: string;
      rows: Row[];
      total: number;
    }

    /** 若依登录返回: { code, msg, token } */
    interface LoginResult {
      token: string;
    }

    /** 若依 /getInfo 返回 */
    interface GetInfoResult {
      user: RuoYiUser;
      roles: string[];
      permissions: string[];
      isDefaultModifyPwd?: boolean;
      isPasswordExpired?: boolean;
      pwdChrtype?: string;
    }

    /** 若依用户对象 */
    interface RuoYiUser {
      userId: number;
      deptId?: number;
      userName: string;
      nickName: string;
      email?: string;
      phonenumber?: string;
      sex?: string;
      avatar?: string;
      status?: string;
      delFlag?: string;
      loginIp?: string;
      loginDate?: string;
      createTime?: string;
      remark?: string;
      admin?: boolean;
      dept?: RuoYiDept;
      roles?: RuoYiRole[];
      roleIds?: number[];
      postIds?: number[];
      params?: Record<string, any>;
    }

    interface RuoYiDept {
      deptId?: number;
      parentId?: number;
      ancestors?: string;
      deptName?: string;
      orderNum?: number;
      leader?: string;
      status?: string;
      children?: RuoYiDept[];
    }

    interface RuoYiRole {
      roleId?: number;
      roleName?: string;
      roleKey?: string;
      roleSort?: number;
      dataScope?: string;
      status?: string;
      flag?: boolean;
      remark?: string;
      admin?: boolean;
    }

    /** /getRouters 返回的单个路由节点 */
    interface MenuRoute {
      name: string;
      path: string;
      hidden?: boolean;
      redirect?: string;
      component?: string;
      alwaysShow?: boolean;
      query?: string;
      children?: MenuRoute[];
      meta?: {
        title?: string;
        icon?: string;
        noCache?: boolean;
        link?: string | null;
      };
    }

    /** 验证码返回 */
    interface CaptchaResult {
      captchaEnabled?: boolean;
      uuid?: string;
      img?: string;
    }

    /** 注册开关等参数 */
    interface RegisterConfig {
      registerEnabled?: boolean;
    }
  }
}

declare namespace Api.Auth {
  interface LoginToken {
    token: string;
    refreshToken?: string;
  }

  interface UserInfo {
    userId: string;
    userName: string;
    nickName: string;
    avatar: string;
    roles: string[];
    buttons: string[];
    /** 若依原始用户对象 */
    user: Api.RuoYi.RuoYiUser;
  }
}
