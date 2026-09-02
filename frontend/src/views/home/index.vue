<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="24">
        <el-card shadow="hover" class="welcome-card">
          <div class="welcome">
            <h2>欢迎来到 RuoYi-SoybeanAdmin 管理系统</h2>
            <p>
              本项目将若依（RuoYi-Vue）后台管理系统的前端全面迁移并美化至
              SoybeanAdmin（Element Plus 版）模板：保留若依完整的业务功能与后端接口，
              前端焕新为更现代、更优雅的界面与交互体验。
            </p>
            <div class="tech-tags">
              <el-tag>Spring Boot</el-tag>
              <el-tag type="success">Vue 3</el-tag>
              <el-tag type="warning">TypeScript</el-tag>
              <el-tag type="danger">Element Plus</el-tag>
              <el-tag type="info">Pinia</el-tag>
              <el-tag effect="plain">Vite</el-tag>
              <el-tag effect="plain" type="success">UnoCSS</el-tag>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt20">
      <el-col :sm="12" :lg="8" v-for="card in featureCards" :key="card.title">
        <el-card shadow="hover" class="feature-card">
          <template #header>
            <div class="card-header">
              <svg-icon :icon-class="card.icon" class="card-icon" />
              <span>{{ card.title }}</span>
            </div>
          </template>
          <p class="feature-desc">{{ card.desc }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" class="mt20">
      <el-col :sm="24" :lg="12">
        <el-card shadow="hover">
          <template #header><span>前端增强</span></template>
          <ul class="detail-list">
            <li>基于 SoybeanAdmin 的新版 UI：圆角卡片、优雅配色、流畅动效</li>
            <li>多布局模式：侧边栏 / 顶部 / 混合菜单可切换</li>
            <li>多标签页、面包屑、全局搜索、全屏、主题配置抽屉</li>
            <li>暗黑模式一键切换</li>
            <li>TypeScript 全量类型提示，开发体验更好</li>
          </ul>
        </el-card>
      </el-col>
      <el-col :sm="24" :lg="12">
        <el-card shadow="hover">
          <template #header><span>若依功能完整保留</span></template>
          <ul class="detail-list">
            <li>系统管理：用户 / 角色 / 菜单 / 部门 / 岗位 / 字典 / 参数 / 公告 / 日志</li>
            <li>系统监控：在线用户 / 定时任务 / 数据监控 / 服务监控 / 缓存监控</li>
            <li>系统工具：表单构建 / 代码生成 / 接口文档</li>
            <li>动态路由与按钮级权限（v-hasPermi / v-hasRole）</li>
            <li>个人中心、通知公告、数据导入导出等全部功能</li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts" name="Index">
const featureCards = [
  {
    icon: 'system',
    title: '系统管理',
    desc: '用户、角色、菜单、部门、岗位、字典、参数、通知公告与日志管理，一应俱全。'
  },
  {
    icon: 'monitor',
    title: '系统监控',
    desc: '在线用户、定时任务、Druid 数据监控、服务器与 Redis 缓存监控实时掌握。'
  },
  {
    icon: 'tool',
    title: '系统工具',
    desc: '拖拽式表单构建、代码生成器、Swagger 接口文档，开发提效好帮手。'
  },
  {
    icon: 'peoples',
    title: '权限体系',
    desc: '动态路由 + 按钮级权限控制，RBAC 角色授权模型完整保留。'
  },
  {
    icon: 'theme',
    title: '主题美化',
    desc: 'SoybeanAdmin 现代化界面：多布局、暗黑模式、主题色定制、动效细节。'
  },
  {
    icon: 'code',
    title: '工程化',
    desc: 'Vue3 + TS + Vite + Pinia + UnoCSS 现代前端工程体系，类型安全、构建迅速。'
  }
];
</script>

<style scoped lang="scss">
.home {
  .welcome-card {
    .welcome {
      padding: 24px 8px;
      text-align: center;

      h2 {
        margin: 0 0 16px;
        font-size: 24px;
        font-weight: 600;
      }

      p {
        margin: 0 auto;
        max-width: 860px;
        color: var(--el-text-color-regular);
        line-height: 1.9;
        font-size: 14px;
      }

      .tech-tags {
        margin-top: 18px;

        .el-tag {
          margin: 0 4px 8px;
        }
      }
    }
  }

  .feature-card {
    margin-bottom: 20px;
    min-height: 148px;

    .card-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;

      .card-icon {
        font-size: 20px;
      }
    }

    .feature-desc {
      margin: 0;
      color: var(--el-text-color-regular);
      line-height: 1.8;
      font-size: 13px;
    }
  }

  .detail-list {
    margin: 0;
    padding-left: 18px;
    color: var(--el-text-color-regular);

    li {
      line-height: 2;
      font-size: 13px;
    }
  }
}
</style>
