import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { config } from '../config';

export class AppError extends Error {
  statusCode: number;
  code: string;
  traceId?: string;

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.code = code || 'INTERNAL_ERROR';
    this.traceId = Math.random().toString(36).substring(7);
  }
}

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 生成追踪ID
  const traceId = err instanceof AppError ? err.traceId : Math.random().toString(36).substring(7);

  // 记录错误日志
  logger.error('错误发生', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    traceId
  });

  // 如果是 AppError，使用其状态码和错误码
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
      traceId
    });
  }

  // 处理 Mongoose 验证错误
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: '数据验证失败',
      traceId
    });
  }

  // 处理 JWT 错误
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      code: 'INVALID_TOKEN',
      message: '无效的认证令牌',
      traceId
    });
  }

  // 处理其他未知错误
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = config.env === 'production' ? '服务器内部错误' : err.message;

  return res.status(statusCode).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message,
    traceId
  });
}; 