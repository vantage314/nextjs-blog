# 开发环境配置指南

## 🛠 必需工具

### 1. Node.js 环境
- 版本要求：>= 18.0.0
- 安装方式：
  ```bash
  # Windows (使用 nvm-windows)
  nvm install 18.17.0
  nvm use 18.17.0

  # macOS/Linux
  nvm install 18.17.0
  nvm use 18.17.0
  ```

### 2. 包管理器
- pnpm >= 8.0.0
- 安装方式：
  ```bash
  npm install -g pnpm@latest
  ```

### 3. 数据库
- MongoDB >= 6.0
- Redis >= 7.0
- 安装方式：
  ```bash
  # 使用 Docker
  docker run -d -p 27017:27017 --name mongodb mongo:6.0
  docker run -d -p 6379:6379 --name redis redis:7.0
  ```

### 4. 开发工具
- VS Code
- Git
- Docker Desktop
- Postman/Insomnia

## 🔧 环境配置

### 1. 克隆项目
```bash
git clone https://github.com/your-org/fincoach-plus.git
cd fincoach-plus
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 环境变量配置
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，配置以下必要变量
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/fincoach
REDIS_URI=redis://localhost:6379
JWT_SECRET=your-jwt-secret
```

### 4. VS Code 配置
安装推荐的扩展：
- ESLint
- Prettier
- TypeScript Vue Plugin
- Tailwind CSS IntelliSense
- GitLens

## 🚀 启动服务

### 1. 开发模式
```bash
# 启动前端开发服务器
pnpm dev

# 启动后端服务
pnpm dev:server
```

### 2. Docker 开发环境
```bash
# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f
```

## 📝 开发规范

### 1. 代码风格
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 TypeScript 严格模式
- 使用 Conventional Commits 规范

### 2. Git 工作流
1. 从 main 分支创建特性分支
2. 提交代码前进行代码审查
3. 通过 CI 测试后合并到 main 分支

### 3. 提交规范
```bash
# 提交格式
<type>(<scope>): <subject>

# 示例
feat(auth): add login functionality
fix(api): resolve user profile update issue
docs(readme): update installation guide
```

## 🧪 测试

### 1. 单元测试
```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test src/components/Button.test.tsx
```

### 2. 端到端测试
```bash
# 运行 E2E 测试
pnpm test:e2e
```

### 3. 测试覆盖率
```bash
# 生成测试覆盖率报告
pnpm test:coverage
```

## 🔍 调试

### 1. VS Code 调试配置
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Server",
      "program": "${workspaceFolder}/src/server.ts"
    },
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Frontend",
      "url": "http://localhost:3000"
    }
  ]
}
```

### 2. 日志查看
```bash
# 查看应用日志
pnpm logs

# 查看 Docker 容器日志
docker-compose logs -f
```

## 📚 文档

### 1. API 文档
- 访问 http://localhost:3001/api-docs 查看 Swagger 文档
- 使用 Postman/Insomnia 导入 API 集合

### 2. 组件文档
- 访问 http://localhost:3000/storybook 查看组件文档
- 运行 `pnpm storybook` 启动 Storybook

## 🔐 安全配置

### 1. 开发证书
```bash
# 生成开发证书
pnpm generate:cert
```

### 2. 环境变量安全
- 不要提交 .env 文件
- 使用 .env.example 作为模板
- 敏感信息使用加密存储

## 🐛 常见问题

### 1. 依赖安装失败
```bash
# 清除缓存后重试
pnpm store prune
pnpm install
```

### 2. 端口占用
```bash
# 查找占用端口的进程
lsof -i :3000
# 终止进程
kill -9 <PID>
```

### 3. Docker 问题
```bash
# 重置 Docker 环境
docker-compose down -v
docker system prune -a
docker-compose up -d
``` 