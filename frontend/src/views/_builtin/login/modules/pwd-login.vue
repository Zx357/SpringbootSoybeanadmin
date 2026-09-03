<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { fetchGetCodeImg } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useRouterPush } from '@/hooks/common/router';
import { useForm } from '@/hooks/common/form';

defineOptions({ name: 'PwdLogin' });

const REMEMBER_KEY = 'ruoyi-remember';

const authStore = useAuthStore();
const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useForm();

interface FormModel {
  username: string;
  password: string;
  rememberMe: boolean;
  code: string;
  uuid: string;
}

const model = reactive<FormModel>({
  username: '',
  password: '',
  rememberMe: false,
  code: '',
  uuid: ''
});

const rules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
};

const codeUrl = ref('');
/** 验证码开关 */
const captchaEnabled = ref(true);
/** 注册开关 */
const registerEnabled = ref(false);

const codeRules = computed(() => (captchaEnabled.value ? rules.code : []));

async function getCode() {
  const { data, error } = await fetchGetCodeImg();
  if (!error) {
    captchaEnabled.value = data?.captchaEnabled === undefined ? true : Boolean(data.captchaEnabled);
    if (captchaEnabled.value) {
      codeUrl.value = `data:image/gif;base64,${data?.img}`;
      model.uuid = data?.uuid || '';
    }
  }
}

function handleRemember() {
  if (model.rememberMe) {
    localStorage.setItem(
      REMEMBER_KEY,
      JSON.stringify({
        username: model.username,
        password: window.btoa(encodeURIComponent(model.password)),
        rememberMe: true
      })
    );
  } else {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

function getRemembered() {
  try {
    const raw = localStorage.getItem(REMEMBER_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      model.username = saved.username || '';
      model.password = saved.password ? decodeURIComponent(window.atob(saved.password)) : '';
      model.rememberMe = Boolean(saved.rememberMe);
    }
  } catch {
    localStorage.removeItem(REMEMBER_KEY);
  }
}

async function handleSubmit() {
  await validate();
  handleRemember();
  const { code, uuid } = captchaEnabled.value ? { code: model.code, uuid: model.uuid } : {};
  await authStore.login(model.username, model.password, code, uuid);
  // 登录失败后刷新验证码
  if (!authStore.isLogin && captchaEnabled.value) {
    getCode();
  }
}

onMounted(() => {
  getCode();
  getRemembered();
});
</script>

<template>
  <ElForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleSubmit">
    <ElFormItem prop="username">
      <ElInput v-model="model.username" placeholder="账号" class="h-48px">
        <template #prefix>
          <SvgIcon icon="ph:user" class="text-18px" />
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput v-model="model.password" type="password" show-password-on="click" placeholder="密码" class="h-48px">
        <template #prefix>
          <SvgIcon icon="ph:lock-key" class="text-18px" />
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem v-if="captchaEnabled" prop="code" :rules="codeRules">
      <div class="w-full flex-y-center gap-12px">
        <ElInput v-model="model.code" placeholder="验证码" class="h-48px flex-1" @keyup.enter="handleSubmit">
          <template #prefix>
            <SvgIcon icon="ph:shield-check" class="text-18px" />
          </template>
        </ElInput>
        <img
          :src="codeUrl"
          class="h-48px w-120px cursor-pointer rounded-6px"
          alt="验证码"
          title="点击刷新验证码"
          @click="getCode"
        />
      </div>
    </ElFormItem>

    <div class="mb-20px flex-y-center justify-between px-2px">
      <ElCheckbox v-model="model.rememberMe">记住密码</ElCheckbox>
    </div>

    <ElButton
      type="primary"
      size="large"
      class="login-btn h-48px w-full rounded-8px"
      :loading="authStore.loginLoading"
      @click="handleSubmit"
    >
      <span v-if="!authStore.loginLoading">登 录</span>
      <span v-else>登 录 中...</span>
    </ElButton>

    <div v-if="registerEnabled" class="mt-16px text-center">
      <ElButton text type="primary" @click="toggleLoginModule('register')">还没账号？立即注册</ElButton>
    </div>
  </ElForm>
</template>

<style scoped lang="scss">
/* 输入框聚焦：柔和阴影 + 过渡 */
:deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: box-shadow 0.25s ease, background-color 0.25s ease;

  &.is-focus {
    box-shadow: 0 0 0 1px var(--el-color-primary) inset, 0 4px 16px var(--el-color-primary-light-8);
  }

  &:hover {
    background-color: var(--el-fill-color-light);
  }
}

/* 登录按钮：渐变 + 悬浮 */
.login-btn {
  border: none;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  background-image: linear-gradient(120deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;

  &:hover,
  &:focus {
    background-image: linear-gradient(120deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
    transform: translateY(-1px);
    box-shadow: 0 8px 20px var(--el-color-primary-light-7);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 4px 12px var(--el-color-primary-light-7);
  }
}
</style>
