import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import { connectRabbitMQ } from './config/rabbitmq';
import { errorHandler } from './middleware/errorHandler';
import profileRoutes from './routes/profile';
import { logger } from './utils/logger';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/profile', profileRoutes);

// 错误处理
app.use(errorHandler);

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    // 连接 Redis
    await connectRedis();
    // 连接 RabbitMQ
    await connectRabbitMQ();

    app.listen(PORT, () => {
      logger.info(`Profile service is running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer(); 