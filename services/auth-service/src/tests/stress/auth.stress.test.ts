import request from 'supertest';
import { app } from '../../index';
import { User } from '../../models/user';

describe('Auth Stress Test', () => {
  const testUsers = Array.from({ length: 5000 }, (_, i) => ({
    email: `stresstest${i}@example.com`,
    password: 'password123',
    name: `Stress Test User ${i}`,
  }));

  beforeAll(async () => {
    // 批量创建测试用户
    await User.insertMany(testUsers);
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('Registration Stress', () => {
    it('should handle extreme volume of registration requests', async () => {
      const startTime = Date.now();
      const newUsers = Array.from({ length: 500 }, (_, i) => ({
        email: `newuser${i}@example.com`,
        password: 'password123',
        name: `New User ${i}`,
      }));

      const requests = newUsers.map((user) =>
        request(app)
          .post('/api/auth/register')
          .send(user)
      );

      const responses = await Promise.all(requests);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // 验证所有请求都成功
      responses.forEach((response) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      // 验证响应时间在可接受范围内
      expect(totalTime).toBeLessThan(60000); // 60 秒内完成所有请求
    });
  });

  describe('Login Stress', () => {
    it('should handle extreme volume of login requests', async () => {
      const startTime = Date.now();
      const requests = testUsers.slice(0, 500).map((user) =>
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

      // 验证响应时间在可接受范围内
      expect(totalTime).toBeLessThan(60000); // 60 秒内完成所有请求
    });
  });

  describe('Profile Update Stress', () => {
    it('should handle extreme volume of profile update requests', async () => {
      // 先登录获取 token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers[0].email,
          password: testUsers[0].password,
        });

      const token = loginResponse.body.data.token;

      const startTime = Date.now();
      const requests = Array.from({ length: 500 }, (_, i) =>
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
      expect(totalTime).toBeLessThan(60000); // 60 秒内完成所有请求
    });
  });

  describe('Mixed Operations Stress', () => {
    it('should handle extreme volume of mixed operations', async () => {
      const startTime = Date.now();
      const operations = [];

      // 注册新用户
      for (let i = 0; i < 100; i++) {
        operations.push(
          request(app)
            .post('/api/auth/register')
            .send({
              email: `mixed${i}@example.com`,
              password: 'password123',
              name: `Mixed User ${i}`,
            })
        );
      }

      // 登录现有用户
      for (let i = 0; i < 100; i++) {
        operations.push(
          request(app)
            .post('/api/auth/login')
            .send({
              email: testUsers[i].email,
              password: testUsers[i].password,
            })
        );
      }

      // 更新用户资料
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUsers[0].email,
          password: testUsers[0].password,
        });

      const token = loginResponse.body.data.token;

      for (let i = 0; i < 100; i++) {
        operations.push(
          request(app)
            .put('/api/auth/profile')
            .set('Authorization', `Bearer ${token}`)
            .send({
              name: `Updated Name ${i}`,
              phone: `1380013${i.toString().padStart(4, '0')}`,
            })
        );
      }

      const responses = await Promise.all(operations);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // 验证所有请求都成功
      responses.forEach((response) => {
        expect(response.status).toBeLessThan(400);
        expect(response.body.success).toBe(true);
      });

      // 验证响应时间在可接受范围内
      expect(totalTime).toBeLessThan(60000); // 60 秒内完成所有请求
    });
  });

  describe('Error Handling Under Stress', () => {
    it('should handle errors gracefully under stress', async () => {
      const startTime = Date.now();
      const operations = [];

      // 无效的注册请求
      for (let i = 0; i < 100; i++) {
        operations.push(
          request(app)
            .post('/api/auth/register')
            .send({
              email: 'invalid-email',
              password: '123',
              name: `Invalid User ${i}`,
            })
        );
      }

      // 无效的登录请求
      for (let i = 0; i < 100; i++) {
        operations.push(
          request(app)
            .post('/api/auth/login')
            .send({
              email: `nonexistent${i}@example.com`,
              password: 'wrongpassword',
            })
        );
      }

      const responses = await Promise.all(operations);
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      // 验证所有请求都返回适当的错误响应
      responses.forEach((response) => {
        expect(response.status).toBeGreaterThanOrEqual(400);
        expect(response.body.success).toBe(false);
      });

      // 验证响应时间在可接受范围内
      expect(totalTime).toBeLessThan(60000); // 60 秒内完成所有请求
    });
  });
}); 