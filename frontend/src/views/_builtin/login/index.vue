<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { loginModuleRecord } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import PwdLogin from './modules/pwd-login.vue';
import Register from './modules/register.vue';

defineOptions({ name: 'LoginPage' });

interface Props {
  /** The login module */
  module?: UnionKey.LoginModule;
}

const props = defineProps<Props>();

const appStore = useAppStore();
const themeStore = useThemeStore();

interface LoginModule {
  label: App.I18n.I18nKey;
  component: Component;
}

const moduleMap: Partial<Record<UnionKey.LoginModule, LoginModule>> = {
  'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
  register: { label: loginModuleRecord.register, component: Register }
};

const activeModule = computed(() => moduleMap[props.module || 'pwd-login'] || moduleMap['pwd-login']!);
</script>

<template>
  <div class="login-page">
    <div class="form-toolbar">
      <ThemeSchemaSwitch
        :theme-schema="themeStore.themeScheme"
        :show-tooltip="false"
        class="text-20px"
        @switch="themeStore.toggleThemeScheme"
      />
      <LangSwitch
        v-if="themeStore.header.multilingual.visible"
        :lang="appStore.locale"
        :lang-options="appStore.localeOptions"
        :show-tooltip="false"
        @change-lang="appStore.changeLocale"
      />
    </div>

    <div class="form-box">
      <div class="form-header">
        <SystemLogo class="size-64px" />
        <h2>{{ $t('system.title') }}</h2>
        <p class="form-subtitle">{{ $t(activeModule.label) }}</p>
      </div>

      <div class="form-content">
        <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
          <component :is="activeModule.component" />
        </Transition>
      </div>

      <div class="form-footer">Copyright © 2026</div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background-color: var(--el-bg-color);
}

.form-toolbar {
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-box {
  width: min(380px, 86%);
  padding: 32px 0;

  .form-header {
    margin-bottom: 8px;
    text-align: center;

    h2 {
      margin: 16px 0 8px;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }

    .form-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--el-text-color-secondary);
    }
  }

  .form-content {
    padding-top: 28px;
  }

  .form-footer {
    margin-top: 36px;
    font-size: 12px;
    text-align: center;
    color: var(--el-text-color-placeholder);
  }
}
</style>
