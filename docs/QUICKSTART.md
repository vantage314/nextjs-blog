# FinCoach Plus UI 快速入门指南

## 快速开始

### 1. 环境准备
确保您的系统已安装：
- Node.js 20.x
- pnpm 8.x
- Git

### 2. 获取代码
```bash
git clone https://github.com/your-org/fincoach-plus-ui.git
cd fincoach-plus-ui
```

### 3. 安装依赖
```bash
pnpm install
```

### 4. 配置环境变量
复制 `.env.example` 到 `.env.local` 并填写必要的配置：
```bash
cp .env.example .env.local
```

### 5. 启动开发服务器
```bash
pnpm dev
```

访问 http://localhost:3000 查看应用

## 常用命令

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm start` - 启动生产服务器
- `pnpm test` - 运行测试
- `pnpm lint` - 运行代码检查

## 开发流程

1. 创建新功能分支
```bash
git checkout -b feature/your-feature-name
```

2. 开发新功能

3. 提交代码
```bash
git add .
git commit -m "feat: your feature description"
```

4. 推送到远程
```bash
git push origin feature/your-feature-name
```

5. 创建 Pull Request

## 测试

运行所有测试：
```bash
pnpm test
```

运行特定测试：
```bash
pnpm test auth.spec.ts
```

## 部署

### 开发环境
```bash
pnpm build
pnpm start
```

### 生产环境
通过 Vercel 自动部署：
1. 推送代码到 main 分支
2. Vercel 自动构建和部署

## 故障排除

### 常见问题

1. 依赖安装失败
```bash
rm -rf node_modules
pnpm install
```

2. 构建失败
```bash
pnpm clean
pnpm install
pnpm build
```

3. 开发服务器无法启动
- 检查端口占用
- 验证环境变量
- 检查日志输出

## 获取帮助

- 查看完整文档：`docs/SYSTEM_DOCUMENTATION.md`
- 提交 Issue：GitHub Issues
- 联系支持：support@fincoach.com 