<script setup lang="ts">
import { computed } from 'vue';
import type { VNode } from 'vue';
import { useAuthStore } from '@/store/modules/auth';
import { useRouter } from 'vue-router';
import { useSvgIcon } from '@/hooks/common/icon';
import { $t } from '@/locales';

defineOptions({ name: 'UserAvatar' });

const router = useRouter();
const authStore = useAuthStore();
const { SvgIconVNode } = useSvgIcon();

function loginOrRegister() {
  router.push({ path: '/login' });
}

type DropdownKey = 'user-profile' | 'logout';

type DropdownOption = {
  key: DropdownKey;
  label: string;
  icon?: () => VNode;
};

const options = computed(() => {
  const opts: DropdownOption[] = [
    {
      label: '个人中心',
      key: 'user-profile',
      icon: SvgIconVNode({ icon: 'ph:user-circle', fontSize: 18 })
    },
    {
      label: $t('common.logout'),
      key: 'logout',
      icon: SvgIconVNode({ icon: 'ph:sign-out', fontSize: 18 })
    }
  ];

  return opts;
});

function logout() {
  window.$messageBox
    ?.confirm('确定注销并退出系统吗？', '提示', {
      confirmButtonText: $t('common.confirm'),
      cancelButtonText: $t('common.cancel'),
      type: 'warning'
    })
    .then(() => {
      authStore.logout();
    });
}

function handleDropdown(key: DropdownKey) {
  if (key === 'logout') {
    logout();
  } else {
    router.push({ path: '/user/profile' });
  }
}

const avatar = computed(() => authStore.userInfo.avatar);
</script>

<template>
  <ElButton v-if="!authStore.isLogin" text @click="loginOrRegister">
    {{ $t('page.login.common.loginOrRegister') }}
  </ElButton>

  <ElDropdown class="px-14px" trigger="click" @command="handleDropdown">
    <template #dropdown>
      <ElDropdownMenu>
        <ElDropdownItem
          v-for="{ key, label, icon } in options"
          :key="key"
          class="mx-4px my-1px rounded-6px"
          :icon="icon"
          :command="key"
        >
          {{ label }}
        </ElDropdownItem>
      </ElDropdownMenu>
    </template>
    <div class="flex items-center">
      <img v-if="avatar" :src="avatar" class="mr-5px h-30px w-30px rounded-full object-cover" alt="avatar" />
      <SvgIcon v-else icon="ph:user-circle" class="mr-5px text-icon-large" />
      <span class="text-16px font-medium">{{ authStore.userInfo.nickName || authStore.userInfo.userName }}</span>
    </div>
  </ElDropdown>
</template>

<style scoped></style>
