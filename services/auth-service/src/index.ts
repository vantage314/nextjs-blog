import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config';
import { logger } from './utils/logger';
import authRoutes from './routes/auth.routes';

export const app = express();

// 中间件
app.use(helmet()); // 安全头
app.use(cors({
  origin: config.corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 速率限制
const limiter = rateLimit({
  windowMs: config.rateLimitWindow,
  max: config.rateLimitMax
});
app.use(limiter);

// 路由
app.use('/api/auth', authRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 错误处理
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('未捕获的错误', { error: err });
  res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
});

// 连接数据库
mongoose.connect(config.mongoUri)
  .then(() => {
    logger.info('MongoDB连接成功');
    // 启动服务器
    app.listen(config.port, () => {
      logger.info(`服务器运行在端口 ${config.port}`);
    });
  })
  .catch((error) => {
    logger.error('MongoDB连接失败', { error });
    process.exit(1);
  });

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('收到SIGTERM信号，准备关闭服务器');
  mongoose.connection.close()
    .then(() => {
      logger.info('MongoDB连接已关闭');
      process.exit(0);
    })
    .catch((error) => {
      logger.error('关闭MongoDB连接失败', { error });
      process.exit(1);
    });
}); 