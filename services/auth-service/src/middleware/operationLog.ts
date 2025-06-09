import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';
import { OperationLog } from '../models/operationLog';

// 需要记录的操作类型
const LOGGED_OPERATIONS = [
  'login',
  'register',
  'changePassword',
  'updateProfile',
  'deleteAccount'
] as const;

type LoggedOperation = typeof LOGGED_OPERATIONS[number];

export const operationLogMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const originalJson = res.json;
  res.json = function (body: any) {
    res.locals.responseBody = body;
    return originalJson.call(this, body);
  };

  try {
    await next();

    // 检查是否是需要记录的操作
    const operation = req.path.split('/').pop() as LoggedOperation;
    if (!LOGGED_OPERATIONS.includes(operation)) {
      return;
    }

    // 获取用户信息
    const userId = req.user?.userId || 'anonymous';
    const userIp = req.ip;
    const userAgent = req.headers['user-agent'] || '';

    // 记录操作日志
    await OperationLog.create({
      userId,
      operation,
      method: req.method,
      path: req.path,
      ip: userIp,
      userAgent,
      requestBody: req.body,
      responseBody: res.locals.responseBody,
      status: res.statusCode,
      timestamp: new Date()
    });

    logger.info('操作日志记录成功', {
      userId,
      operation,
      path: req.path
    });
  } catch (error) {
    logger.error('操作日志记录失败', {
      error,
      path: req.path
    });
  }
}; 