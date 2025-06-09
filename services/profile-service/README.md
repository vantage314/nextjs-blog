# FinCoach Plus 用户画像分析服务

## 项目概述

FinCoach Plus 是一个智能金融顾问系统，本服务作为其核心组件之一，负责用户画像分析和投资建议生成。通过分析用户的财务状况、投资行为和财务目标，为用户提供个性化的投资建议和财务规划。

## 开发进度

### 2024-03-20
- ✅ 完成基础项目架构搭建
- ✅ 实现用户画像数据模型
- ✅ 实现市场数据服务
- ✅ 实现基础分析功能

### 2024-03-21
- ✅ 实现缓存机制
- ✅ 添加单元测试
- ✅ 完善API文档
- ✅ 实现错误处理

### 待开发功能
- ⏳ 实时市场数据集成 (计划: 2024-03-22)
- ⏳ 机器学习模型集成 (计划: 2024-03-23)
- ⏳ 性能优化 (计划: 2024-03-24)
- ⏳ 监控系统 (计划: 2024-03-25)

## 已实现功能

### 1. 用户画像分析
- 财务状况分析
- 投资行为分析
- 财务目标分析
- 市场时机分析
- 税收效率分析
- 退休准备分析

### 2. 市场数据服务
- 股票市场数据
- 债券市场数据
- 房地产市场数据
- 经济指标数据

### 3. 缓存系统
- Redis缓存集成
- 缓存策略优化
- 缓存失效处理

### 4. API接口
- RESTful API设计
- 请求验证
- 错误处理
- 响应格式化

## 待开发模块

### 1. 实时市场数据集成
- [ ] 实时股票行情接入
- [ ] 实时债券收益率
- [ ] 实时经济指标
- [ ] WebSocket支持

### 2. 机器学习模型
- [ ] 用户行为预测
- [ ] 市场趋势分析
- [ ] 风险评估模型
- [ ] 投资组合优化

### 3. 性能优化
- [ ] 数据库索引优化
- [ ] 查询性能优化
- [ ] 缓存策略优化
- [ ] 并发处理优化

### 4. 监控系统
- [ ] 性能监控
- [ ] 错误追踪
- [ ] 用户行为分析
- [ ] 系统健康检查

## 技术栈

### 后端
- Node.js
- TypeScript
- Express.js
- MongoDB
- Redis

### 测试
- Jest
- Supertest
- MongoDB Memory Server

### 工具
- ESLint
- Prettier
- Docker
- GitHub Actions

## 部署说明

### 环境要求
- Node.js >= 16
- MongoDB >= 4.4
- Redis >= 6.0
- Docker >= 20.10

### 开发环境设置
1. 克隆仓库
```bash
git clone https://github.com/your-org/fincoach-plus-ui.git
cd services/profile-service
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env
```

4. 启动开发服务器
```bash
npm run dev
```

### 生产环境部署
1. 构建Docker镜像
```bash
docker build -t fincoach-profile-service .
```

2. 运行容器
```bash
docker run -d \
  --name profile-service \
  -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongodb:27017/profile-service \
  -e REDIS_URL=redis://redis:6379 \
  fincoach-profile-service
```

## 贡献指南

### 开发流程
1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

### 代码规范
- 遵循TypeScript规范
- 使用ESLint和Prettier
- 编写单元测试
- 更新文档

### 提交规范
```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建过程或辅助工具的变动
```

## 联系方式

- 项目负责人: [姓名]
- 邮箱: [邮箱地址]
- 项目仓库: [GitHub仓库地址]

## 许可证

MIT License 

# 市场数据服务

## 功能概述
市场数据服务提供实时和历史的金融市场数据，包括股票、债券、外汇、期货、期权、加密货币、大宗商品和行业指数等。服务支持数据缓存、性能监控、WebSocket实时推送和智能数据预取。

## 核心特性
1. 实时数据推送
   - WebSocket连接管理
   - 心跳检测
   - 自动重连
   - 批量数据推送

2. 性能监控
   - 实时指标展示
   - 告警机制
   - 性能报告
   - 资源使用分析

3. 智能数据预取
   - 基于优先级的预取策略
   - 批量数据获取
   - 预取队列管理
   - 结果缓存

## WebSocket接口

### 1. 连接管理
```javascript
// 建立连接
const ws = new WebSocket('ws://localhost:8080');

// 订阅数据
ws.send(JSON.stringify({
  type: 'subscribe',
  channels: ['stocks', 'forex', 'crypto']
}));

// 取消订阅
ws.send(JSON.stringify({
  type: 'unsubscribe',
  channels: ['stocks']
}));

// 心跳检测
ws.send(JSON.stringify({
  type: 'ping'
}));
```

### 2. 数据推送格式
```json
{
  "type": "stocks",
  "data": [
    {
      "symbol": "AAPL",
      "price": 150.25,
      "change": 2.5,
      "changePercent": 1.69
    }
  ],
  "timestamp": 1647123456789
}
```

## 性能监控API

### 1. 获取实时指标
```http
GET /api/monitoring/metrics
```

响应示例：
```json
{
  "timestamp": 1647123456789,
  "apiLatency": {
    "stocks": 150,
    "forex": 120,
    "crypto": 180
  },
  "cacheHitRate": 0.85,
  "memoryUsage": {
    "heapUsed": 256000000,
    "heapTotal": 512000000,
    "external": 128000000,
    "rss": 1024000000
  },
  "wsConnections": {
    "total": 100,
    "active": 95,
    "dropped": 5
  },
  "dataUpdates": {
    "total": 1000,
    "success": 950,
    "failed": 50
  }
}
```

### 2. 获取告警规则
```http
GET /api/monitoring/alerts/rules
```

响应示例：
```json
[
  {
    "id": "high_latency",
    "name": "API延迟过高",
    "condition": "avgLatency > 1000",
    "severity": "warning",
    "message": "API平均响应时间超过1秒"
  }
]
```

### 3. 添加告警规则
```http
POST /api/monitoring/alerts/rules
```

请求体：
```json
{
  "id": "custom_rule",
  "name": "自定义规则",
  "condition": "memoryUsage > 0.9",
  "severity": "error",
  "message": "内存使用率超过90%"
}
```

## 数据预取API

### 1. 添加预取任务
```http
POST /api/prefetch/tasks
```

请求体：
```json
{
  "type": "stocks",
  "symbols": ["AAPL", "GOOGL", "MSFT"],
  "priority": 1
}
```

### 2. 获取预取队列状态
```http
GET /api/prefetch/queue
```

响应示例：
```json
{
  "total": 10,
  "pending": 5,
  "running": 2,
  "completed": 2,
  "failed": 1
}
```

### 3. 更新预取配置
```http
PUT /api/prefetch/config
```

请求体：
```json
{
  "type": "stocks",
  "interval": 300000,
  "priority": 1,
  "batchSize": 50,
  "retryLimit": 3
}
```

## 环境变量

```env
# WebSocket配置
WS_PORT=8080
WS_HEARTBEAT_INTERVAL=30000
WS_UPDATE_INTERVAL=1000

# 监控配置
MONITORING_INTERVAL=60000
ALERT_CHECK_INTERVAL=30000

# 预取配置
PREFETCH_BATCH_SIZE=50
PREFETCH_RETRY_LIMIT=3
PREFETCH_INTERVAL=60000

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password
```

## 安装和运行

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
```bash
cp .env.example .env
# 编辑.env文件，填入必要的配置
```

3. 启动服务：
```bash
npm start
```

## 开发指南

### WebSocket开发
1. 实现客户端重连机制
2. 处理心跳超时
3. 实现数据压缩
4. 优化批量推送

### 性能监控
1. 添加自定义指标
2. 配置告警规则
3. 实现性能报告
4. 优化资源使用

### 数据预取
1. 调整预取策略
2. 优化批处理大小
3. 实现智能预取
4. 管理预取队列

## 测试

运行单元测试：
```bash
npm test
```

运行性能测试：
```bash
npm run test:performance
```

## 贡献指南

1. Fork项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT 