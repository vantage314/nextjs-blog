import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from './errorHandler';
import crypto from 'crypto';

// 生成 CSRF Token
export const generateCsrfToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// CSRF Token 验证中间件
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // 只对非 GET 请求进行 CSRF 验证
  if (req.method === 'GET') {
    return next();
  }

  const csrfToken = req.headers[config.security.csrf.headerName.toLowerCase()] as string;
  const cookieToken = req.cookies[config.security.csrf.cookieName];

  if (!csrfToken || !cookieToken) {
    logger.warn('CSRF Token 缺失', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    throw new AppError('无效的请求', 403);
  }

  if (csrfToken !== cookieToken) {
    logger.warn('CSRF Token 不匹配', {
      path: req.path,
      method: req.method,
      ip: req.ip
    });
    throw new AppError('无效的请求', 403);
  }

  next();
};

// 设置 CSRF Token Cookie
export const setCsrfToken = (req: Request, res: Response, next: NextFunction) => {
  const token = generateCsrfToken();
  res.cookie(config.security.csrf.cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24小时
  });
  next();
}; 