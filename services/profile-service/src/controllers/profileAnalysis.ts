import { Request, Response, NextFunction } from 'express';
import { ProfileAnalysisService } from '../services/profileAnalysis';
import { Profile } from '../models/Profile';
import { logger } from '../utils/logger';
import { getRedisClient } from '../config/redis';

export class ProfileAnalysisController {
  static async analyzeProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const redisClient = getRedisClient();

      // 尝试从缓存获取分析结果
      const cachedAnalysis = await redisClient.get(`profile:analysis:${userId}`);
      if (cachedAnalysis) {
        return res.json(JSON.parse(cachedAnalysis));
      }

      // 获取用户画像
      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ message: '用户画像不存在' });
      }

      // 执行分析
      const analysis = ProfileAnalysisService.analyzeProfile(profile);

      // 缓存分析结果（24小时）
      await redisClient.set(
        `profile:analysis:${userId}`,
        JSON.stringify(analysis),
        { EX: 86400 }
      );

      res.json(analysis);
    } catch (error) {
      logger.error('用户画像分析失败:', error);
      next(error);
    }
  }

  static async getFinancialHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const redisClient = getRedisClient();

      // 尝试从缓存获取
      const cachedHealth = await redisClient.get(`profile:health:${userId}`);
      if (cachedHealth) {
        return res.json(JSON.parse(cachedHealth));
      }

      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ message: '用户画像不存在' });
      }

      const health = ProfileAnalysisService.analyzeProfile(profile).financialHealth;

      // 缓存结果（12小时）
      await redisClient.set(
        `profile:health:${userId}`,
        JSON.stringify(health),
        { EX: 43200 }
      );

      res.json(health);
    } catch (error) {
      logger.error('获取财务状况分析失败:', error);
      next(error);
    }
  }

  static async getInvestmentBehavior(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const redisClient = getRedisClient();

      // 尝试从缓存获取
      const cachedBehavior = await redisClient.get(`profile:behavior:${userId}`);
      if (cachedBehavior) {
        return res.json(JSON.parse(cachedBehavior));
      }

      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ message: '用户画像不存在' });
      }

      const behavior = ProfileAnalysisService.analyzeProfile(profile).investmentBehavior;

      // 缓存结果（12小时）
      await redisClient.set(
        `profile:behavior:${userId}`,
        JSON.stringify(behavior),
        { EX: 43200 }
      );

      res.json(behavior);
    } catch (error) {
      logger.error('获取投资行为分析失败:', error);
      next(error);
    }
  }

  static async getFinancialGoals(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const redisClient = getRedisClient();

      // 尝试从缓存获取
      const cachedGoals = await redisClient.get(`profile:goals:${userId}`);
      if (cachedGoals) {
        return res.json(JSON.parse(cachedGoals));
      }

      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ message: '用户画像不存在' });
      }

      const goals = ProfileAnalysisService.analyzeProfile(profile).financialGoals;

      // 缓存结果（12小时）
      await redisClient.set(
        `profile:goals:${userId}`,
        JSON.stringify(goals),
        { EX: 43200 }
      );

      res.json(goals);
    } catch (error) {
      logger.error('获取财务目标分析失败:', error);
      next(error);
    }
  }

  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const redisClient = getRedisClient();

      // 尝试从缓存获取
      const cachedRecommendations = await redisClient.get(`profile:recommendations:${userId}`);
      if (cachedRecommendations) {
        return res.json(JSON.parse(cachedRecommendations));
      }

      const profile = await Profile.findOne({ userId });
      if (!profile) {
        return res.status(404).json({ message: '用户画像不存在' });
      }

      const recommendations = ProfileAnalysisService.analyzeProfile(profile).recommendations;

      // 缓存结果（12小时）
      await redisClient.set(
        `profile:recommendations:${userId}`,
        JSON.stringify(recommendations),
        { EX: 43200 }
      );

      res.json(recommendations);
    } catch (error) {
      logger.error('获取投资建议失败:', error);
      next(error);
    }
  }
} 