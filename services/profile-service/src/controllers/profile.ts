import { Request, Response, NextFunction } from 'express';
import { Profile } from '../models/Profile';
import { AppError } from '../middleware/errorHandler';
import { publishMessage } from '../config/rabbitmq';
import { getRedisClient } from '../config/redis';
import { logger } from '../utils/logger';

// 获取用户画像
export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const redisClient = getRedisClient();

    // 尝试从缓存获取
    const cachedProfile = await redisClient.get(`profile:${userId}`);
    if (cachedProfile) {
      return res.json({
        status: 'success',
        data: JSON.parse(cachedProfile)
      });
    }

    // 从数据库获取
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      throw new AppError('用户画像不存在', 404);
    }

    // 缓存数据
    await redisClient.set(
      `profile:${userId}`,
      JSON.stringify(profile),
      { EX: 3600 } // 1小时过期
    );

    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// 更新用户画像
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const profile = await Profile.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!profile) {
      throw new AppError('用户画像不存在', 404);
    }

    // 更新缓存
    const redisClient = getRedisClient();
    await redisClient.set(
      `profile:${userId}`,
      JSON.stringify(profile),
      { EX: 3600 }
    );

    // 发布更新消息
    await publishMessage('profile.updated', {
      userId,
      profile
    });

    res.json({
      status: 'success',
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// 计算风险评分
export const calculateRiskScore = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });

    if (!profile) {
      throw new AppError('用户画像不存在', 404);
    }

    // 计算风险评分
    const riskScore = calculateRiskLevel(profile);

    res.json({
      status: 'success',
      data: {
        riskScore,
        riskLevel: profile.riskLevel
      }
    });
  } catch (error) {
    next(error);
  }
};

// 风险评分计算函数
const calculateRiskLevel = (profile: any) => {
  let score = 0;

  // 基于投资经验
  switch (profile.investmentExperience) {
    case 'beginner':
      score += 2;
      break;
    case 'intermediate':
      score += 5;
      break;
    case 'advanced':
      score += 8;
      break;
  }

  // 基于风险承受能力
  score += profile.riskTolerance;

  // 基于资产配置
  const stockRatio = profile.assets.stocks / (profile.assets.cash + profile.assets.stocks + profile.assets.bonds);
  score += stockRatio * 10;

  // 基于负债率
  const totalAssets = Object.values(profile.assets).reduce((sum: number, value: number) => sum + value, 0);
  const totalLiabilities = Object.values(profile.liabilities).reduce((sum: number, value: number) => sum + value, 0);
  const debtRatio = totalLiabilities / totalAssets;
  score -= debtRatio * 5;

  // 归一化到 1-10 范围
  return Math.min(Math.max(Math.round(score / 3), 1), 10);
}; 