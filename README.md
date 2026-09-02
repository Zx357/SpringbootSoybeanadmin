# RuoYi-SoybeanAdmin（springboot-soybeanadmin）

> **把若依框架的前端"美化"了一遍** —— 若依（RuoYi-Vue）后端原封不动，前端整体迁移到 SoybeanAdmin（Element Plus 版）模板：业务功能 100% 保留，界面焕然一新。

## 这是什么项目？

若依（RuoYi）是国内最流行的开源后台管理框架之一，功能完善但前端界面相对朴素。本项目将若依的全部前端功能**逐页迁移**到高颜值的 SoybeanAdmin 模板上：

- ✅ **后端零改动**：直接使用若依官方 SpringBoot 后端，接口、数据库、权限体系原样保留
- ✅ **前端全焕新**：Vue3 + TypeScript + Element Plus + SoybeanAdmin 现代化界面
- ✅ **功能不缩水**：系统管理、系统监控、系统工具全部模块逐页迁移并实测通过

## 目录结构

```
springboot-soybeanadmin
├── backend/                       # 后端：若依 RuoYi-Vue（Spring Boot）
│   ├── ruoyi-admin               # 启动模块
│   ├── ruoyi-common              # 通用模块
│   ├── ruoyi-framework           # 框架核心
│   ├── ruoyi-system              # 系统模块
│   ├── ruoyi-quartz              # 定时任务
│   ├── ruoyi-generator           # 代码生成
│   └── sql/                      # 初始化脚本（ry_*.sql、quartz.sql）
└── frontend/                      # 前端：SoybeanAdmin + 若依全量功能
    └── src/
        ├── service/api            # 若依全部接口（system / monitor / tool）
        ├── views                  # 若依全部页面（动态路由加载）
        ├── components/ruoyi       # 若依全局组件（分页/字典标签/上传等）
        └── styles/scss/ruoyi.scss # 若依全局样式
```

## 界面改进了什么？

| 若依原版 | 本项目（SoybeanAdmin） |
|----------|------------------------|
| 单一经典布局 | 侧边栏 / 顶部 / 混合菜单多布局可切换 |
| 固定配色 | 主题色定制 + 暗黑模式一键切换 |
| 基础标签页 | 精致的多标签页（右键菜单、固定、刷新） |
| — | 全局搜索（Ctrl+K）、页面水印、灵活页脚 |
| 原生前端工程 | TypeScript 全量类型 + Vite 秒级热更 + UnoCSS 原子化样式 |

## 功能清单（与若依一致）

| 模块 | 功能 |
|------|------|
| 系统管理 | 用户管理（部门树+左右布局）、角色管理、菜单管理、部门管理、岗位管理、字典管理、参数设置、通知公告、操作日志、登录日志 |
| 系统监控 | 在线用户、定时任务（含调度日志）、数据监控（Druid）、服务监控、缓存监控、缓存列表 |
| 系统工具 | 表单构建、代码生成（含导入表/编辑配置）、系统接口（Swagger） |
| 其他 | 登录/注册、个人中心（资料/密码/头像）、动态路由、按钮级权限 |

## 环境要求

| 依赖 | 版本 |
|------|------|
| JDK | 17+ |
| MySQL | 8.0 |
| Redis | 6.x+（Windows 可用 Memurai） |
| Node.js | 20+ |
| pnpm | 8+ |

## 快速开始

### 1. 初始化数据库

```sql
CREATE DATABASE `ry-vue` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

```bash
mysql -uroot -p ry-vue < backend/sql/ry_20260417.sql
mysql -uroot -p ry-vue < backend/sql/quartz.sql
```

### 2. 配置并启动后端

修改 `backend/ruoyi-admin/src/main/resources/application-druid.yml` 中的数据库密码（Redis 默认 localhost:6379）：

```bash
cd backend
mvn package -DskipTests
java -jar ruoyi-admin/target/ruoyi-admin.jar     # http://localhost:8080
```

### 3. 启动前端

```bash
cd frontend
pnpm install
pnpm dev                                          # http://localhost:9527
```

### 4. 登录

- 账号：`admin` / 密码：`admin123`

## 前端技术要点

- **动态路由**：通过若依 `/getRouters` 接口获取菜单，转换为 SoybeanAdmin 的 `ElegantConstRoute` 结构（`src/service/api/route.ts`）
- **权限指令**：`v-hasPermi` / `v-hasRole`，支持若依通配权限 `*:*:*`
- **请求适配**：SoybeanAdmin 请求层对接若依 `{ code, msg, data }` 响应结构
- **字典体系**：若依 useDict / DictTag 组件完整保留
- **图标体系**：若依 85+ 本地 SVG 图标接入 icon sprite，与 iconify 双体系兼容
- **全局组件**：Pagination、RightToolbar、FileUpload、ImageUpload、Editor、Crontab、TreePanel 等

## 部署构建

```bash
cd frontend
pnpm build    # 产物在 dist/，Nginx 部署并反代后端接口
```

## 致谢

- [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue) — 后端与业务功能
- [SoybeanAdmin](https://github.com/soybeanjs/soybean-admin) — 前端模板与架构

## License

MIT
