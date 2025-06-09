import { Router } from 'express';
import { getProfile, updateProfile } from '../controllers/user';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// 获取用户信息
router.get('/profile', authenticate, getProfile);

// 更新用户信息
router.patch('/profile', authenticate, updateProfile);

export default router; 