import { Router } from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile, calculateRiskScore } from '../controllers/profile';
import { validateRequest } from '../middleware/validateRequest';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// 获取用户画像
router.get('/:userId', authenticate, getProfile);

// 更新用户画像
router.patch(
  '/:userId',
  authenticate,
  [
    body('monthlyIncome').optional().isNumeric().withMessage('月收入必须是数字'),
    body('monthlyExpense').optional().isNumeric().withMessage('月支出必须是数字'),
    body('riskTolerance')
      .optional()
      .isInt({ min: 1, max: 10 })
      .withMessage('风险承受能力必须在1-10之间'),
    body('investmentExperience')
      .optional()
      .isIn(['beginner', 'intermediate', 'advanced'])
      .withMessage('投资经验必须是 beginner/intermediate/advanced 之一')
  ],
  validateRequest,
  updateProfile
);

// 计算风险评分
router.get('/:userId/risk-score', authenticate, calculateRiskScore);

export default router; 