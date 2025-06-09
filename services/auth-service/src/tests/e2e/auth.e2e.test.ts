import request from 'supertest';
import { app } from '../../index';
import { User } from '../../models/user';

describe('Auth E2E Test', () => {
  let authToken: string;
  let testUser: any;

  beforeAll(async () => {
    // 清理测试数据
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
  });

  describe('User Registration and Login Flow', () => {
    it('should complete full registration and login flow', async () => {
      // 1. 注册新用户
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'e2etest@example.com',
          password: 'password123',
          name: 'E2E Test User',
        });

      expect(registerResponse.status).toBe(201);
      expect(registerResponse.body.success).toBe(true);
      expect(registerResponse.body.data).toHaveProperty('email', 'e2etest@example.com');

      // 2. 使用新注册的账号登录
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2etest@example.com',
          password: 'password123',
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body.success).toBe(true);
      expect(loginResponse.body.data).toHaveProperty('token');
      expect(loginResponse.body.data).toHaveProperty('user');

      authToken = loginResponse.body.data.token;
      testUser = loginResponse.body.data.user;
    });
  });

  describe('Profile Management Flow', () => {
    it('should complete full profile management flow', async () => {
      // 1. 获取当前用户资料
      const getProfileResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(getProfileResponse.status).toBe(200);
      expect(getProfileResponse.body.success).toBe(true);
      expect(getProfileResponse.body.data).toHaveProperty('email', 'e2etest@example.com');

      // 2. 更新用户资料
      const updateProfileResponse = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Updated E2E User',
          phone: '13800138000',
        });

      expect(updateProfileResponse.status).toBe(200);
      expect(updateProfileResponse.body.success).toBe(true);
      expect(updateProfileResponse.body.data).toHaveProperty('name', 'Updated E2E User');
      expect(updateProfileResponse.body.data).toHaveProperty('phone', '13800138000');

      // 3. 验证资料已更新
      const verifyProfileResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(verifyProfileResponse.status).toBe(200);
      expect(verifyProfileResponse.body.success).toBe(true);
      expect(verifyProfileResponse.body.data).toHaveProperty('name', 'Updated E2E User');
      expect(verifyProfileResponse.body.data).toHaveProperty('phone', '13800138000');
    });
  });

  describe('Password Management Flow', () => {
    it('should complete full password management flow', async () => {
      // 1. 修改密码
      const changePasswordResponse = await request(app)
        .put('/api/auth/password')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          currentPassword: 'password123',
          newPassword: 'newpassword123',
        });

      expect(changePasswordResponse.status).toBe(200);
      expect(changePasswordResponse.body.success).toBe(true);

      // 2. 使用旧密码尝试登录（应该失败）
      const loginWithOldPasswordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2etest@example.com',
          password: 'password123',
        });

      expect(loginWithOldPasswordResponse.status).toBe(401);
      expect(loginWithOldPasswordResponse.body.success).toBe(false);

      // 3. 使用新密码登录（应该成功）
      const loginWithNewPasswordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2etest@example.com',
          password: 'newpassword123',
        });

      expect(loginWithNewPasswordResponse.status).toBe(200);
      expect(loginWithNewPasswordResponse.body.success).toBe(true);
      expect(loginWithNewPasswordResponse.body.data).toHaveProperty('token');

      // 更新 token
      authToken = loginWithNewPasswordResponse.body.data.token;
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle various error scenarios', async () => {
      // 1. 尝试使用无效的 token 访问受保护的资源
      const invalidTokenResponse = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token');

      expect(invalidTokenResponse.status).toBe(401);
      expect(invalidTokenResponse.body.success).toBe(false);

      // 2. 尝试使用已存在的邮箱注册
      const duplicateEmailResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'e2etest@example.com',
          password: 'password123',
          name: 'Another User',
        });

      expect(duplicateEmailResponse.status).toBe(400);
      expect(duplicateEmailResponse.body.success).toBe(false);

      // 3. 尝试使用无效的邮箱格式注册
      const invalidEmailResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          name: 'Invalid User',
        });

      expect(invalidEmailResponse.status).toBe(400);
      expect(invalidEmailResponse.body.success).toBe(false);

      // 4. 尝试使用过短的密码
      const shortPasswordResponse = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'newuser@example.com',
          password: '123',
          name: 'Short Password User',
        });

      expect(shortPasswordResponse.status).toBe(400);
      expect(shortPasswordResponse.body.success).toBe(false);
    });
  });

  describe('Security Flow', () => {
    it('should enforce security measures', async () => {
      // 1. 尝试使用错误的密码登录
      const wrongPasswordResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'e2etest@example.com',
          password: 'wrongpassword',
        });

      expect(wrongPasswordResponse.status).toBe(401);
      expect(wrongPasswordResponse.body.success).toBe(false);

      // 2. 尝试使用不存在的邮箱登录
      const nonexistentEmailResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        });

      expect(nonexistentEmailResponse.status).toBe(401);
      expect(nonexistentEmailResponse.body.success).toBe(false);

      // 3. 尝试使用无效的 token 更新资料
      const invalidTokenUpdateResponse = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer invalid-token')
        .send({
          name: 'Should Not Update',
        });

      expect(invalidTokenUpdateResponse.status).toBe(401);
      expect(invalidTokenUpdateResponse.body.success).toBe(false);
    });
  });
}); 