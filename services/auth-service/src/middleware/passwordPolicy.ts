import { Request, Response, NextFunction } from 'express';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from './errorHandler';

interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];
  const { minLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars } = config.security.passwordPolicy;

  if (password.length < minLength) {
    errors.push(`密码长度至少为 ${minLength} 个字符`);
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('密码必须包含大写字母');
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('密码必须包含小写字母');
  }

  if (requireNumbers && !/\d/.test(password)) {
    errors.push('密码必须包含数字');
  }

  if (requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('密码必须包含特殊字符');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const passwordPolicyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { password } = req.body;

  if (!password) {
    return next();
  }

  const validation = validatePassword(password);

  if (!validation.isValid) {
    logger.warn('密码不符合安全策略', {
      errors: validation.errors,
      path: req.path
    });
    throw new AppError(`密码不符合安全要求：${validation.errors.join('，')}`, 400);
  }

  next();
}; 