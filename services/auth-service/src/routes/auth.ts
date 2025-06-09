import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, verifyToken } from '../controllers/auth';
import { validateRequest } from '../middleware/validateRequest';

const router = Router();

// 注册路由
router.post(
  '/register',
  [
    body('email').isEmail().withMessage('请输入有效的邮箱地址'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('密码长度至少为6个字符'),
    body('name').notEmpty().withMessage('姓名不能为空')
  ],
  validateRequest,
  register
);

// 登录路由
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('请输入有效的邮箱地址'),
    body('password').notEmpty().withMessage('密码不能为空')
  ],
  validateRequest,
  login
);

// 验证token路由
router.get('/verify', verifyToken);

export default router; 