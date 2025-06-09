import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../app';
import { Profile } from '../models/Profile';
import { getRedisClient } from '../config/redis';

describe('Profile Analysis API', () => {
  let mongoServer: MongoMemoryServer;
  let redisClient: any;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
    redisClient = getRedisClient();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
    await redisClient.quit();
  });

  beforeEach(async () => {
    await Profile.deleteMany({});
    await redisClient.flushAll();
  });

  const mockProfile = {
    userId: 'test-user-1',
    riskLevel: 'moderate',
    monthlyIncome: 10000,
    monthlyExpense: 6000,
    assets: {
      cash: 50000,
      stocks: 100000,
      bonds: 50000,
      realEstate: 200000
    },
    liabilities: {
      mortgage: 150000,
      carLoan: 50000
    },
    investmentGoals: [
      '短期：建立应急基金',
      '中期：子女教育基金',
      '长期：退休规划'
    ],
    riskTolerance: 7,
    investmentExperience: 'intermediate'
  };

  describe('GET /api/profile/:userId/analysis', () => {
    it('should return complete profile analysis', async () => {
      await Profile.create(mockProfile);

      const response = await request(app)
        .get(`/api/profile/${mockProfile.userId}/analysis`)
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('financialHealth');
      expect(response.body).toHaveProperty('investmentBehavior');
      expect(response.body).toHaveProperty('financialGoals');
      expect(response.body).toHaveProperty('recommendations');
    });

    it('should return 404 for non-existent profile', async () => {
      const response = await request(app)
        .get('/api/profile/non-existent/analysis')
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(404);
    });
  });

  describe('GET /api/profile/:userId/health', () => {
    it('should return financial health analysis', async () => {
      await Profile.create(mockProfile);

      const response = await request(app)
        .get(`/api/profile/${mockProfile.userId}/health`)
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('score');
      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('factors');
    });
  });

  describe('GET /api/profile/:userId/behavior', () => {
    it('should return investment behavior analysis', async () => {
      await Profile.create(mockProfile);

      const response = await request(app)
        .get(`/api/profile/${mockProfile.userId}/behavior`)
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('riskProfile');
      expect(response.body).toHaveProperty('investmentStyle');
      expect(response.body).toHaveProperty('strengths');
      expect(response.body).toHaveProperty('weaknesses');
    });
  });

  describe('GET /api/profile/:userId/goals', () => {
    it('should return financial goals analysis', async () => {
      await Profile.create(mockProfile);

      const response = await request(app)
        .get(`/api/profile/${mockProfile.userId}/goals`)
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('shortTerm');
      expect(response.body).toHaveProperty('mediumTerm');
      expect(response.body).toHaveProperty('longTerm');
      expect(response.body).toHaveProperty('progress');
    });
  });

  describe('GET /api/profile/:userId/recommendations', () => {
    it('should return investment recommendations', async () => {
      await Profile.create(mockProfile);

      const response = await request(app)
        .get(`/api/profile/${mockProfile.userId}/recommendations`)
        .set('Authorization', 'Bearer test-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('immediate');
      expect(response.body).toHaveProperty('shortTerm');
      expect(response.body).toHaveProperty('longTerm');
    });
  });

  describe('Cache Tests', () => {
    it('should cache analysis results', async () => {
      await Profile.create(mockProfile);

      // 第一次请求
      const firstResponse = await request(app)
        .get(`/api/profile/${mockProfile.userId}/analysis`)
        .set('Authorization', 'Bearer test-token');

      expect(firstResponse.status).toBe(200);

      // 验证缓存
      const cachedData = await redisClient.get(`profile:analysis:${mockProfile.userId}`);
      expect(cachedData).toBeTruthy();
      expect(JSON.parse(cachedData)).toEqual(firstResponse.body);
    });

    it('should use cached data for subsequent requests', async () => {
      await Profile.create(mockProfile);

      // 第一次请求
      await request(app)
        .get(`/api/profile/${mockProfile.userId}/analysis`)
        .set('Authorization', 'Bearer test-token');

      // 修改数据库中的配置
      await Profile.findOneAndUpdate(
        { userId: mockProfile.userId },
        { $set: { monthlyIncome: 20000 } }
      );

      // 第二次请求应该返回缓存的数据
      const secondResponse = await request(app)
        .get(`/api/profile/${mockProfile.userId}/analysis`)
        .set('Authorization', 'Bearer test-token');

      expect(secondResponse.status).toBe(200);
      expect(secondResponse.body.financialHealth.factors.find(
        (f: any) => f.name === '储蓄率'
      ).score).toBe(firstResponse.body.financialHealth.factors.find(
        (f: any) => f.name === '储蓄率'
      ).score);
    });
  });
}); 