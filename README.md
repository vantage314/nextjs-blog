# FinCoach Plus 金融平台

## 📖 项目概述

FinCoach Plus 是一个现代化的金融管理平台，提供资产管理、投资分析、财务规划等功能。本项目采用微服务架构，确保系统的高可用性和可扩展性。

### 🌟 核心特性

- 用户认证与授权
- 资产管理与配置
- 投资组合分析
- 财务规划工具
- 实时市场数据
- 个性化投资建议

## 🛠 技术栈

### 前端
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI
- React Query
- Zustand

### 后端
- Node.js
- Express
- MongoDB
- Redis
- JWT
- Swagger

### 基础设施
- Docker
- Docker Compose
- Prometheus
- Grafana
- Sentry

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Docker & Docker Compose
- MongoDB 6+
- Redis 7+

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/your-org/fincoach-plus.git
cd fincoach-plus
```

2. 安装依赖
```bash
pnpm install
```

3. 配置环境变量
```bash
cp .env.example .env
# 编辑 .env 文件，填写必要的配置
```

4. 启动开发服务器
```bash
pnpm dev
```

### Docker 部署

1. 构建并启动服务
```bash
docker-compose up -d
```

2. 访问服务
- 前端: http://localhost:3000
- API 文档: http://localhost:3001/api-docs
- Grafana: http://localhost:3000
- Prometheus: http://localhost:9090

## 📚 API 文档

### 认证服务
- 登录: POST /auth/login
- 注册: POST /auth/register
- 验证 Token: GET /auth/verify
- 忘记密码: POST /auth/forgot-password

### 用户服务
- 获取用户信息: GET /users/profile
- 更新用户信息: PUT /users/profile
- 修改密码: PUT /users/password

### 资产管理
- 获取资产列表: GET /assets
- 添加资产: POST /assets
- 更新资产: PUT /assets/:id
- 删除资产: DELETE /assets/:id

详细 API 文档请访问: http://localhost:3001/api-docs

## 🔒 安全策略

### 认证与授权
- JWT 认证
- 基于角色的访问控制 (RBAC)
- CSRF 保护
- 密码强度策略

### 数据安全
- 请求速率限制
- 数据加密传输
- 敏感信息脱敏
- 操作日志记录

### 监控与告警
- 异常行为检测
- 实时监控告警
- 安全事件响应

## 📊 性能优化

### 前端优化
- 代码分割
- 静态资源缓存
- 图片懒加载
- 预加载关键资源

### 后端优化
- 数据库索引优化
- 缓存策略
- 负载均衡
- 服务降级

### 监控指标
- 接口响应时间
- 系统资源使用率
- 错误率统计
- 用户行为分析

## 🧪 测试

### 单元测试
```bash
pnpm test
```

### 端到端测试
```bash
pnpm test:e2e
```

### 测试覆盖率
```bash
pnpm test:coverage
```

## 📈 监控与日志

### Prometheus 指标
- 请求延迟
- 错误率
- 资源使用率
- 业务指标

### Grafana 仪表板
- 系统概览
- 性能分析
- 错误追踪
- 用户行为

### Sentry 错误追踪
- 实时错误监控
- 错误堆栈分析
- 性能追踪
- 用户反馈

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交变更
4. 推送到分支
5. 创建 Pull Request

## �� 许可证

MIT License 