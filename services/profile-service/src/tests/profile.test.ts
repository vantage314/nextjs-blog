import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app';
import { Profile } from '../models/Profile';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Profile.deleteMany({});
});

describe('Profile Service', () => {
  const mockUserId = 'test-user-id';
  const mockProfile = {
    userId: mockUserId,
    riskLevel: 'moderate',
    monthlyIncome: 10000,
    monthlyExpense: 5000,
    assets: {
      cash: 50000,
      stocks: 100000,
      bonds: 50000,
      realEstate: 200000,
      other: 0
    },
    liabilities: {
      mortgage: 150000,
      carLoan: 0,
      creditCard: 5000,
      other: 0
    },
    investmentGoals: ['退休规划', '子女教育'],
    riskTolerance: 7,
    investmentExperience: 'intermediate'
  };

  describe('GET /api/profile/:userId', () => {
    it('should return 404 if profile not found', async () => {
      const res = await request(app)
        .get(`/api/profile/${mockUserId}`)
        .set('Authorization', 'Bearer test-token');

      expect(res.status).toBe(404);
      expect(res.body.status).toBe('error');
    });

    it('should return profile if found', async () => {
      await Profile.create(mockProfile);

      const res = await request(app)
        .get(`/api/profile/${mockUserId}`)
        .set('Authorization', 'Bearer test-token');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.userId).toBe(mockUserId);
    });
  });

  describe('PATCH /api/profile/:userId', () => {
    it('should update profile successfully', async () => {
      await Profile.create(mockProfile);

      const updateData = {
        monthlyIncome: 12000,
        riskTolerance: 8
      };

      const res = await request(app)
        .patch(`/api/profile/${mockUserId}`)
        .set('Authorization', 'Bearer test-token')
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.monthlyIncome).toBe(12000);
      expect(res.body.data.riskTolerance).toBe(8);
    });

    it('should validate input data', async () => {
      const updateData = {
        monthlyIncome: 'invalid',
        riskTolerance: 11
      };

      const res = await request(app)
        .patch(`/api/profile/${mockUserId}`)
        .set('Authorization', 'Bearer test-token')
        .send(updateData);

      expect(res.status).toBe(400);
      expect(res.body.status).toBe('error');
    });
  });

  describe('GET /api/profile/:userId/risk-score', () => {
    it('should calculate risk score correctly', async () => {
      await Profile.create(mockProfile);

      const res = await request(app)
        .get(`/api/profile/${mockUserId}/risk-score`)
        .set('Authorization', 'Bearer test-token');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data.riskScore).toBeGreaterThanOrEqual(1);
      expect(res.body.data.riskScore).toBeLessThanOrEqual(10);
    });
  });
}); 