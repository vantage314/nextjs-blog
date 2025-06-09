# FinCoach+ 认证服务

这是 FinCoach+ 项目的认证服务模块，负责处理用户认证、授权和用户管理功能。

## 功能特性

- 用户注册和登录
- JWT 认证
- 用户资料管理
- 密码重置
- 角色基础访问控制
- 请求速率限制
- 安全防护

## 技术栈

- Node.js
- Express
- MongoDB
- JWT
- TypeScript
- Winston (日志)
- Joi (请求验证)

## 开发环境设置

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
```
然后编辑 `.env` 文件，设置必要的环境变量。

3. 启动开发服务器：
```bash
npm run dev
```

## API 端点

### 认证相关

- POST `/api/auth/register` - 用户注册
- POST `/api/auth/login` - 用户登录
- GET `/api/auth/me` - 获取当前用户信息
- PUT `/api/auth/profile` - 更新用户资料
- PUT `/api/auth/password` - 修改密码

### 健康检查

- GET `/health` - 服务健康状态检查

## 开发指南

### 项目结构

```
src/
  ├── config/         # 配置文件
  ├── controllers/    # 控制器
  ├── middleware/     # 中间件
  ├── models/         # 数据模型
  ├── routes/         # 路由定义
  ├── utils/          # 工具函数
  ├── validators/     # 请求验证
  └── index.ts        # 应用入口
```

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 ESLint 规则
- 使用 Prettier 进行代码格式化
- 编写单元测试和集成测试

### 测试

运行测试：
```bash
npm test
```

运行测试覆盖率报告：
```bash
npm run test:coverage
```

## 部署

1. 构建项目：
```bash
npm run build
```

2. 启动生产服务器：
```bash
npm start
```

## 监控和日志

- 使用 Winston 进行日志记录
- 日志文件位于 `logs/` 目录
- 支持不同级别的日志记录
- 错误日志单独存储

## 安全措施

- 使用 Helmet 增强安全性
- 实现请求速率限制
- 密码加密存储
- CORS 配置
- JWT 认证

## 贡献指南

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT 