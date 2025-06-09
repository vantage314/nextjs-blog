import request from 'supertest';
import { app } from '../../index';
import { User } from '../../models/user';

describe('Auth Performance Test', () => {
  const testUsers = Array.from({ length: 100 }, (_, i) => ({
    email: `test${i}@example.com`,
    password: 'password123',
    name: `Test User ${i}`,
  }));

  beforeAll(async () => {
    // 批量创建测试用户
    await User.insertMany(testUsers);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('Login Performance', () => {
    it('should handle multiple concurrent login requests', async () => {
      const startTime = Date.now();
      const requests = testUsers.slice(0, 10).map((user) =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: user.email,
            password: user.password,
          })
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // 验证所有请求都成功
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('token');
      });

      // 验证响应时间在可接受范围内（例如，所有请求在 5 秒内完成）
      expect(totalTime).toBeLessThan(5000);
    });
  });

  describe('Profile Update Performance', () => {
    it('should handle multiple concurrent profile updates', async () => {
      // 先登录获取 token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers[0].email,
          password: testUsers[0].password,
        });

      const token = loginResponse.body.data.token;

      const startTime = Date.now();
      const requests = Array.from({ length: 10 }, (_, i) =>
        request(app)
          .put('/api/auth/profile')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: `Updated Name ${i}`,
            phone: `1380013${i.toString().padStart(4, '0')}`,
          })
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // 验证所有请求都成功
      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });

      // 验证响应时间在可接受范围内
      expect(totalTime).toBeLessThan(5000);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limits on login attempts', async () => {
      const startTime = Date.now();
      const requests = Array.from({ length: 150 }, () =>
        request(app)
          .post('/api/auth/login')
          .send({
            email: 'test@example.com',
            password: 'wrongpassword',
          })
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // 验证部分请求被限制
      const rateLimitedResponses = responses.filter(
        (response) => response.status === 429
      );
      expect(rateLimitedResponses.length).toBeGreaterThan(0);

      // 验证响应时间在可接受范围内
      expect(totalTime).toBeLessThan(10000);
    });
  });
}); 