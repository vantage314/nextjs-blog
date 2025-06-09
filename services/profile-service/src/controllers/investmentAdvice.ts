import { Request, Response, NextFunction } from 'express';
import { Profile } from '../models/Profile';
import { InvestmentAdviceService } from '../services/investmentAdvice';
import { AppError } from '../middleware/errorHandler';
import { getRedisClient } from '../config/redis';

export const getInvestmentAdvice = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const redisClient = getRedisClient();

    // 尝试从缓存获取
    const cachedAdvice = await redisClient.get(`advice:${userId}`);
    if (cachedAdvice) {
      return res.json({
        status: 'success',
        data: JSON.parse(cachedAdvice)
      });
    }

    // 获取用户画像
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      throw new AppError(404, '用户画像不存在');
    }

    // 计算投资建议
    const advice = InvestmentAdviceService.calculateAssetAllocation(profile);

    // 缓存结果（1小时）
    await redisClient.set(
      `advice:${userId}`,
      JSON.stringify(advice),
      { EX: 3600 }
    );

    res.json({
      status: 'success',
      data: advice
    });
  } catch (error) {
    next(error);
  }
}; 