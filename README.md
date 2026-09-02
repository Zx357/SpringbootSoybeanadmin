# RuoYi-SoybeanAdmin（SpringBoot + SoybeanAdmin）

基于 **若依（RuoYi-Vue）后端** 与 **SoybeanAdmin（Element Plus 版）前端** 深度整合的全栈后台管理系统。

若依全部前端功能已完整迁移至 SoybeanAdmin 模板：保留若依的业务功能与后端接口，前端全面采用 SoybeanAdmin 的架构（Vue3 + TypeScript + Vite + Pinia + UnoCSS + Element Plus）与 UI 风格。

## 项目结构

```
springboot-soybeanadmin
├── RuoYi-Vue-master              # 后端：若依 SpringBoot（Spring Boot 4.1 / JDK 17+）
│   ├── ruoyi-admin               # 启动模块（ruoyi-admin.jar）
│   ├── ruoyi-common              # 通用模块
│   ├── ruoyi-framework           # 框架核心
│   ├── ruoyi-system              # 系统模块
│   ├── ruoyi-quartz              # 定时任务
│   ├── ruoyi-generator           # 代码生成
│   └── sql/                      # 初始化脚本（ry_*.sql、quartz.sql）
└── soybean-admin-element-plus-main   # 前端：SoybeanAdmin + 若依全量功能
    ├── src/service/api            # 若依全部接口（system/monitor/tool）
    ├── src/views                  # 若依全部页面
    ├── src/components/ruoyi       # 若依全局组件（Pagination/DictTag/Upload...）
    └── src/styles/scss/ruoyi.scss # 若依全局样式
```

## 功能清单（全部迁移自若依）

| 模块 | 功能 |
|------|------|
| 系统管理 | 用户管理（部门树+左右布局）、角色管理、菜单管理、部门管理、岗位管理、字典管理、参数设置、通知公告、操作日志、登录日志 |
| 系统监控 | 在线用户、定时任务（含调度日志）、数据监控（Druid）、服务监控、缓存监控、缓存列表 |
| 系统工具 | 表单构建、代码生成（含导入表/编辑配置）、系统接口（Swagger） |
| 其他 | 登录/注册、个人中心（资料/密码/头像）、首页看板、多标签页、面包屑、全屏、主题配置 |

## 技术要点

- **动态路由**：通过若依 `/getRouters` 接口获取菜单，转换为 SoybeanAdmin 的 `ElegantConstRoute` 结构（`src/service/api/route.ts`）
- **权限指令**：`v-hasPermi` / `v-hasRole`，支持若依通配权限 `*:*:*`
- **请求适配**：SoybeanAdmin 请求层对接若依 `{ code, msg, data }` 响应结构，登录 token、防重提交、限流等均正常
- **字典体系**：若依字典组件（DictTag / useDict）完整保留
- **图标体系**：若依 85+ 本地 SVG 图标接入 SoybeanAdmin 的 icon sprite；`<svg-icon icon-class>` 与 iconify 双体系兼容
- **全局组件**：Pagination、RightToolbar、FileUpload、ImageUpload、Editor（富文本）、Crontab、IconSelect、TreePanel 等全部可用

## 环境要求

| 依赖 | 版本 |
|------|------|
| JDK | 17+（本仓库在 JDK 25 验证通过） |
| MySQL | 8.0 |
| Redis | 6.x / 7.x / 8.x（Windows 可用 Memurai） |
| Node.js | 20+ |
| pnpm | 8+ |

## 快速开始

### 1. 初始化数据库

```sql
CREATE DATABASE `ry-vue` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

依次导入（按顺序）：

```bash
mysql -uroot -p ry-vue < RuoYi-Vue-master/sql/ry_20260417.sql
mysql -uroot -p ry-vue < RuoYi-Vue-master/sql/quartz.sql
```

### 2. 配置后端

修改 `RuoYi-Vue-master/ruoyi-admin/src/main/resources/application-druid.yml`：

```yaml
master:
    url: jdbc:mysql://localhost:3306/ry-vue?...
    username: root
    password: 你的密码
```

Redis 配置见 `application.yml`（默认 localhost:6379，无密码）。

### 3. 启动后端

```bash
cd RuoYi-Vue-master
mvn package -DskipTests
java -jar ruoyi-admin/target/ruoyi-admin.jar
```

后端地址：http://localhost:8080

### 4. 启动前端

```bash
cd soybean-admin-element-plus-main
pnpm install
pnpm dev
```

前端地址：http://localhost:9527（开发代理已指向 localhost:8080）

### 5. 登录

- 账号：`admin`
- 密码：`admin123`

## 部署构建

```bash
cd soybean-admin-element-plus-main
pnpm build    # 产物在 dist/，Nginx 反代 /prod-api 或直连后端
```

## 致谢

- [RuoYi-Vue](https://gitee.com/y_project/RuoYi-Vue) — 后端与业务功能
- [SoybeanAdmin](https://github.com/soybeanjs/soybean-admin) — 前端模板与架构

## License

MIT
