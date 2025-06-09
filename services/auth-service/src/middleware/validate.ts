import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { logger } from '../utils/logger';

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true
      });

      if (error) {
        const errors = error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }));

        return res.status(400).json({
          success: false,
          message: '请求数据验证失败',
          errors
        });
      }

      next();
    } catch (error) {
      logger.error('请求验证失败', { error });
      res.status(500).json({
        success: false,
        message: '请求验证失败'
      });
    }
  };
}; 