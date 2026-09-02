import type { Directive, DirectiveBinding } from 'vue';
import { useAuthStore } from '@/store/modules/auth';

const ALL_PERMISSION = '*:*:*';
const SUPER_ADMIN = 'admin';

/**
 * v-hasPermi 操作权限处理（从 RuoYi-Vue3 移植）
 */
export const hasPermi: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const permissions = useAuthStore().userInfo.buttons || [];

    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value;

      const hasPermissions = permissions.some(permission => {
        return ALL_PERMISSION === permission || permissionFlag.includes(permission);
      });

      if (!hasPermissions) {
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error('请设置操作权限标签值');
    }
  }
};

/**
 * v-hasRole 角色权限处理（从 RuoYi-Vue3 移植）
 */
export const hasRole: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding;
    const roles = useAuthStore().userInfo.roles || [];

    if (value && value instanceof Array && value.length > 0) {
      const roleFlag = value;

      const hasRoleFlag = roles.some(role => {
        return SUPER_ADMIN === role || roleFlag.includes(role);
      });

      if (!hasRoleFlag) {
        el.parentNode?.removeChild(el);
      }
    } else {
      throw new Error('请设置角色权限标签值');
    }
  }
};
