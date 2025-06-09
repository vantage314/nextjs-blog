import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler';
import profileRoutes from './routes/profile';
import investmentAdviceRoutes from './routes/investmentAdvice';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.use('/api/profile', profileRoutes);
app.use('/api/investment-advice', investmentAdviceRoutes);

// 错误处理
app.use(errorHandler);

export default app; 