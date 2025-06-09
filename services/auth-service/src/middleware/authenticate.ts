import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { logger } from '../utils/logger';
import { User } from '../models/user';
import { AppError } from './errorHandler';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: string;
  jti: string;
}

// 扩展Request类型以包含user属性
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // 获取token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('未提供认证token', 401);
    }

    const token = authHeader.split(' ')[1];

    // 验证token
    const decoded = jwt.verify(token, config.jwt.secret, {
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
      algorithms: ['HS256']
    }) as CustomJwtPayload;

    // 验证用户是否存在
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('用户不存在', 401);
    }

    // 检查用户状态
    if (user.status !== 'active') {
      throw new AppError('账号已被禁用', 403);
    }

    // 将用户信息添加到请求对象
    req.user = {
      userId: decoded.userId,
      role: decoded.role
    };

    // 记录访问日志
    logger.info('用户访问', {
      userId: decoded.userId,
      path: req.path,
      method: req.method,
      ip: req.ip
    });

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Token验证失败', { error: error.message });
      throw new AppError('无效的token', 401);
    }
    next(error);
  }
};

// 角色验证中间件
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError('未认证', 401);
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('权限不足', {
        userId: req.user.userId,
        requiredRoles: roles,
        userRole: req.user.role
      });
      throw new AppError('无权限访问', 403);
    }

    next();
  };
}; 