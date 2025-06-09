import { Router } from 'express';
import { ProfileAnalysisController } from '../controllers/profileAnalysis';
import { authenticate } from '../middleware/authenticate';
import { validateRequest } from '../middleware/validateRequest';
import { param } from 'express-validator';

const router = Router();

// 获取完整的用户画像分析
router.get(
  '/:userId/analysis',
  authenticate,
  validateRequest([
    param('userId').isString().notEmpty().withMessage('用户ID不能为空')
  ]),
  ProfileAnalysisController.analyzeProfile
);

// 获取财务状况分析
router.get(
  '/:userId/health',
  authenticate,
  validateRequest([
    param('userId').isString().notEmpty().withMessage('用户ID不能为空')
  ]),
  ProfileAnalysisController.getFinancialHealth
);

// 获取投资行为分析
router.get(
  '/:userId/behavior',
  authenticate,
  validateRequest([
    param('userId').isString().notEmpty().withMessage('用户ID不能为空')
  ]),
  ProfileAnalysisController.getInvestmentBehavior
);

// 获取财务目标分析
router.get(
  '/:userId/goals',
  authenticate,
  validateRequest([
    param('userId').isString().notEmpty().withMessage('用户ID不能为空')
  ]),
  ProfileAnalysisController.getFinancialGoals
);

// 获取投资建议
router.get(
  '/:userId/recommendations',
  authenticate,
  validateRequest([
    param('userId').isString().notEmpty().withMessage('用户ID不能为空')
  ]),
  ProfileAnalysisController.getRecommendations
);

export default router; 