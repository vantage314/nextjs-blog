import { Router } from 'express';
import { getInvestmentAdvice } from '../controllers/investmentAdvice';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// 获取投资建议
router.get('/:userId', authenticate, getInvestmentAdvice);

export default router; 