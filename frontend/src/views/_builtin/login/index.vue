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

const brandFeatures = [
  { icon: 'ep:monitor', title: '现代化界面', desc: 'SoybeanAdmin 高颜值模板' },
  { icon: 'ep:lock', title: '完整权限体系', desc: '动态路由 · 按钮级权限' },
  { icon: 'ep:cpu', title: '全功能模块', desc: '系统管理 · 监控 · 工具' }
];
</script>

<template>
  <div class="login-page">
    <!-- 左侧品牌区 -->
    <div class="brand-panel">
      <div class="brand-bg">
        <div class="bg-circle bg-circle-1" />
        <div class="bg-circle bg-circle-2" />
        <div class="bg-circle bg-circle-3" />
        <div class="bg-grid" />
      </div>

      <div class="brand-content">
        <div class="brand-logo">
          <SystemLogo class="size-56px" />
          <span class="brand-name">RuoYi-SoybeanAdmin</span>
        </div>

        <div class="brand-slogan">
          <h1>焕然一新的<br />若依后台管理系统</h1>
          <p>若依（RuoYi-Vue）后端零改动，前端整体美化至 SoybeanAdmin 模板，功能完整、界面现代。</p>
        </div>

        <ul class="brand-features">
          <li v-for="feat in brandFeatures" :key="feat.title">
            <div class="feat-icon">
              <SvgIcon :icon="feat.icon" class="text-20px" />
            </div>
            <div class="feat-text">
              <div class="feat-title">{{ feat.title }}</div>
              <div class="feat-desc">{{ feat.desc }}</div>
            </div>
          </li>
        </ul>

        <div class="brand-footer">
          Spring Boot · Vue 3 · TypeScript · Element Plus
        </div>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="form-panel">
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
          <SystemLogo class="size-44px lt-sm:hidden" />
          <h2>{{ $t('system.title') }}</h2>
          <p class="form-subtitle">{{ $t(activeModule.label) }}</p>
        </div>

        <div class="form-content">
          <Transition :name="themeStore.page.animateMode" mode="out-in" appear>
            <component :is="activeModule.component" />
          </Transition>
        </div>

        <div class="form-footer">
          Copyright MIT © 2026 RuoYi-SoybeanAdmin
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-page {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: var(--el-bg-color);

  /* ===== 左侧品牌区 ===== */
  .brand-panel {
    position: relative;
    display: flex;
    flex: 1.2;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-dark-2) 100%);

    /* 小屏隐藏左侧 */
    @media (max-width: 900px) {
      display: none;
    }
  }

  .brand-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;

    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);

      &.bg-circle-1 {
        top: -120px;
        left: -120px;
        width: 420px;
        height: 420px;
      }

      &.bg-circle-2 {
        right: -80px;
        bottom: -140px;
        width: 360px;
        height: 360px;
        background: rgba(255, 255, 255, 0.06);
      }

      &.bg-circle-3 {
        top: 38%;
        right: 12%;
        width: 140px;
        height: 140px;
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .bg-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: radial-gradient(ellipse at center, #000 30%, transparent 75%);
    }
  }

  .brand-content {
    position: relative;
    z-index: 1;
    width: min(460px, 82%);
    color: #fff;

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 48px;

      .brand-name {
        font-size: 20px;
        font-weight: 600;
        letter-spacing: 1px;
      }
    }

    .brand-slogan {
      h1 {
        margin: 0 0 18px;
        font-size: 38px;
        font-weight: 700;
        line-height: 1.35;
        letter-spacing: 1px;
      }

      p {
        margin: 0;
        max-width: 400px;
        font-size: 14px;
        line-height: 1.9;
        color: rgba(255, 255, 255, 0.78);
      }
    }

    .brand-features {
      margin: 44px 0 0;
      padding: 0;
      list-style: none;

      li {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 12px 0;

        .feat-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.14);
          backdrop-filter: blur(4px);
        }

        .feat-title {
          font-size: 15px;
          font-weight: 600;
        }

        .feat-desc {
          margin-top: 2px;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.66);
        }
      }
    }

    .brand-footer {
      margin-top: 48px;
      font-size: 12px;
      letter-spacing: 0.5px;
      color: rgba(255, 255, 255, 0.55);
    }
  }

  /* ===== 右侧表单区 ===== */
  .form-panel {
    position: relative;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
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
    width: min(400px, 86%);
    padding: 32px 0;

    .form-header {
      margin-bottom: 8px;
      text-align: center;

      h2 {
        margin: 14px 0 6px;
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
      padding-top: 20px;
    }

    .form-footer {
      margin-top: 32px;
      font-size: 12px;
      text-align: center;
      color: var(--el-text-color-placeholder);
    }
  }
}

/* 小屏时表单占满 */
@media (max-width: 900px) {
  .login-page .form-panel {
    flex: 1;
  }
}
</style>
