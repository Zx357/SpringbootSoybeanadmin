<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { fetchGetCodeImg, fetchRegister } from '@/service/api';
import { useRouterPush } from '@/hooks/common/router';
import { useForm } from '@/hooks/common/form';

defineOptions({ name: 'Register' });

const { toggleLoginModule } = useRouterPush();
const { formRef, validate } = useForm();

interface FormModel {
  username: string;
  password: string;
  confirmPassword: string;
  code: string;
  uuid: string;
}

const model = reactive<FormModel>({
  username: '',
  password: '',
  confirmPassword: '',
  code: '',
  uuid: ''
});

const equalToPassword = (rule: any, value: string, callback: (error?: Error) => void) => {
  if (model.password !== value) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const rules = {
  username: [
    { required: true, trigger: 'blur', message: '请输入您的账号' },
    { min: 2, max: 20, message: '用户账号长度必须介于 2 和 20 之间', trigger: 'blur' }
  ],
  password: [
    { required: true, trigger: 'blur', message: '请输入您的密码' },
    { min: 5, max: 20, message: '用户密码长度必须介于 5 和 20 之间', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, trigger: 'blur', message: '请再次输入您的密码' },
    { required: true, validator: equalToPassword, trigger: ['blur', 'change'] }
  ],
  code: [{ required: true, trigger: 'change', message: '请输入验证码' }]
};

const codeUrl = ref('');
const loading = ref(false);
const captchaEnabled = ref(true);

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

async function handleRegister() {
  await validate();
  loading.value = true;
  const { error } = await fetchRegister({
    username: model.username,
    password: model.password,
    confirmPassword: model.confirmPassword,
    code: model.code,
    uuid: model.uuid
  });
  loading.value = false;
  if (!error) {
    window.$message?.success('注册成功');
    toggleLoginModule('pwd-login');
  } else if (captchaEnabled.value) {
    getCode();
  }
}

onMounted(() => {
  getCode();
});
</script>

<template>
  <ElForm ref="formRef" :model="model" :rules="rules" size="large" :show-label="false" @keyup.enter="handleRegister">
    <ElFormItem prop="username">
      <ElInput v-model="model.username" placeholder="账号">
        <template #prefix>
          <SvgIcon icon="ph:user" class="text-18px" />
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem prop="password">
      <ElInput v-model="model.password" type="password" show-password-on="click" placeholder="密码">
        <template #prefix>
          <SvgIcon icon="ph:lock-key" class="text-18px" />
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem prop="confirmPassword">
      <ElInput v-model="model.confirmPassword" type="password" show-password-on="click" placeholder="确认密码">
        <template #prefix>
          <SvgIcon icon="ph:lock-key" class="text-18px" />
        </template>
      </ElInput>
    </ElFormItem>
    <ElFormItem v-if="captchaEnabled" prop="code">
      <div class="w-full flex-y-center gap-12px">
        <ElInput v-model="model.code" placeholder="验证码" @keyup.enter="handleRegister">
          <template #prefix>
            <SvgIcon icon="ph:shield-check" class="text-18px" />
          </template>
        </ElInput>
        <img
          :src="codeUrl"
          class="h-40px w-110px cursor-pointer rounded-4px"
          alt="验证码"
          title="点击刷新验证码"
          @click="getCode"
        />
      </div>
    </ElFormItem>
    <ElFormItem>
      <div class="w-full">
        <ElButton type="primary" size="large" round block :loading="loading" @click="handleRegister">
          <span v-if="!loading">注 册</span>
          <span v-else>注 册 中...</span>
        </ElButton>
        <div class="mt-12px text-right">
          <ElButton text type="primary" @click="toggleLoginModule('pwd-login')">使用已有账户登录</ElButton>
        </div>
      </div>
    </ElFormItem>
  </ElForm>
</template>

<style scoped></style>
