import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from './errorHandler';

// 通用速率限制
export const generalRateLimit = rateLimit({
  windowMs: config.security.rateLimit.windowMs,
  max: config.security.rateLimit.max,
  handler: (req: Request, res: Response) => {
    logger.warn('请求频率超限', {
      ip: req.ip,
      path: req.path
    });
    throw new AppError('请求过于频繁，请稍后再试', 429);
  }
});

// 登录接口速率限制
export const loginRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: config.security.rateLimit.loginMax,
  handler: (req: Request, res: Response) => {
    logger.warn('登录尝试次数超限', {
      ip: req.ip,
      email: req.body.email
    });
    throw new AppError('登录尝试次数过多，请稍后再试', 429);
  }
});

// 注册接口速率限制
export const registerRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 3, // 每小时最多注册3次
  handler: (req: Request, res: Response) => {
    logger.warn('注册尝试次数超限', {
      ip: req.ip,
      email: req.body.email
    });
    throw new AppError('注册尝试次数过多，请稍后再试', 429);
  }
}); 