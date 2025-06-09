# FinCoach Plus UI 系统文档

## 1. 系统概述

FinCoach Plus UI 是一个现代化的金融教练平台前端系统，基于 Next.js 15 构建，采用 TypeScript 开发，使用 Tailwind CSS 进行样式管理。

### 1.1 系统特点
- 响应式设计，支持多端适配
- 完整的用户认证系统
- 实时数据更新
- 多语言支持
- 自动化测试覆盖
- 持续集成/持续部署

## 2. 环境要求

### 2.1 开发环境
- Node.js 20.x 或更高版本
- pnpm 8.x 或更高版本
- Git 2.x 或更高版本
- VS Code（推荐）或其他现代 IDE

### 2.2 系统依赖
```json
{
  "node": ">=20.0.0",
  "pnpm": ">=8.0.0"
}
```

### 2.3 环境变量配置
创建 `.env.local` 文件，配置以下环境变量：
```env
# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/fincoach"

# 认证配置
JWT_SECRET="your-jwt-secret"
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"

# API 配置
API_BASE_URL="http://localhost:3000/api"

# 第三方服务
VERCEL_TOKEN="your-vercel-token"
VERCEL_ORG_ID="your-org-id"
VERCEL_PROJECT_ID="your-project-id"

# SonarQube 配置
SONAR_TOKEN="your-sonar-token"
SONAR_HOST_URL="your-sonar-host"
```

## 3. 系统架构

### 3.1 技术栈
- 前端框架：Next.js 15
- 编程语言：TypeScript
- 样式框架：Tailwind CSS
- 状态管理：React Context + Hooks
- 表单处理：React Hook Form
- 数据验证：Zod
- 测试框架：Playwright
- CI/CD：GitHub Actions
- 代码质量：SonarQube
- 部署平台：Vercel

### 3.2 目录结构
```
fincoach-plus-ui/
├── app/                 # Next.js 应用目录
├── components/          # 可复用组件
├── e2e/                # 端到端测试
├── hooks/              # 自定义 Hooks
├── lib/                # 工具函数和配置
├── pages/              # 页面组件
├── public/             # 静态资源
├── styles/             # 全局样式
├── types/              # TypeScript 类型定义
└── prisma/             # 数据库模型
```

### 3.3 核心模块
1. 认证模块
   - 用户注册
   - 用户登录
   - 密码重置
   - 会话管理

2. 用户管理
   - 个人信息管理
   - 权限控制
   - 用户设置

3. 数据展示
   - 实时数据更新
   - 数据可视化
   - 报表生成

4. 系统管理
   - 日志管理
   - 性能监控
   - 错误追踪

## 4. 安装部署

### 4.1 本地开发环境搭建
```bash
# 克隆项目
git clone https://github.com/your-org/fincoach-plus-ui.git

# 安装依赖
cd fincoach-plus-ui
pnpm install

# 启动开发服务器
pnpm dev
```

### 4.2 生产环境部署
1. 配置环境变量
2. 构建项目
```bash
pnpm build
```
3. 启动服务
```bash
pnpm start
```

## 5. 操作手册

### 5.1 用户认证
1. 访问登录页面 `/login`
2. 输入邮箱和密码
3. 点击登录按钮
4. 系统自动跳转到仪表板

### 5.2 个人信息管理
1. 点击右上角用户头像
2. 选择"个人设置"
3. 修改相关信息
4. 点击保存

### 5.3 数据查看
1. 在仪表板查看概览数据
2. 使用筛选器调整数据范围
3. 导出数据报表

### 5.4 系统管理
1. 访问管理控制台
2. 查看系统日志
3. 监控系统性能
4. 处理错误报告

## 6. 维护指南

### 6.1 日常维护
- 定期检查系统日志
- 监控系统性能
- 更新依赖包
- 备份重要数据

### 6.2 故障处理
1. 检查错误日志
2. 验证环境变量
3. 确认服务状态
4. 必要时重启服务

### 6.3 安全建议
- 定期更新密码
- 启用双因素认证
- 及时更新系统
- 定期安全审计

## 7. 常见问题

### 7.1 登录问题
Q: 无法登录系统
A: 检查网络连接和账号密码是否正确

### 7.2 性能问题
Q: 系统响应缓慢
A: 检查网络连接和服务器负载

### 7.3 数据问题
Q: 数据不更新
A: 检查数据源连接和更新频率

## 8. 联系支持

- 技术支持：support@fincoach.com
- 问题反馈：feedback@fincoach.com
- 紧急联系：emergency@fincoach.com 