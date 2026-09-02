import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import { getAuthorization, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

/**
 * 适配若依后端的请求实例
 *
 * 若依响应结构：AjaxResult { code, msg, ...data } / TableDataInfo { code, msg, rows, total }
 * - code === 200 成功
 * - code === 401 未认证（登出并跳转登录页）
 *
 * transform 直接返回整个响应体，由各 api 函数自行声明类型取用字段
 */
export const request = createFlatRequest<App.Service.Response<any>>(
  { baseURL },
  {
    defaultState: {
      errMsgStack: [],
      refreshTokenPromise: null
    } as RequestInstanceState,
    transform(response: AxiosResponse<any>) {
      return response.data;
    },
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });

      return config;
    },
    isBackendSuccess(response) {
      // 若依后端 code === 200 表示成功
      return String(response.data?.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },
    async onBackendFail(response) {
      const authStore = useAuthStore();
      const responseCode = String(response.data?.code);

      // 401: 登录状态已过期，登出并跳转登录页
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (logoutCodes.includes(responseCode)) {
        if (!request.state.errMsgStack?.includes('login-expired')) {
          request.state.errMsgStack = [...(request.state.errMsgStack || []), 'login-expired'];

          window.$message?.error({
            message: response.data?.msg || '登录状态已过期，请重新登录',
            onClose: () => {
              request.state.errMsgStack = request.state.errMsgStack?.filter(msg => msg !== 'login-expired');
            }
          });
        }

        authStore.resetStore();
      }

      return null;
    },
    onError(error) {
      let message = error.message;

      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
      }

      showErrorMsg(request.state, message);
    }
  }
);
