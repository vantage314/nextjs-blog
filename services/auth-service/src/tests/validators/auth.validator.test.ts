import Joi from 'joi';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from '../../validators/auth.validator';

describe('Auth Validator Test', () => {
  describe('registerSchema', () => {
    it('should validate valid registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      const { error } = registerSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User',
      };

      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.message).toContain('邮箱');
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
        name: 'Test User',
      };

      const { error } = registerSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.message).toContain('密码');
    });
  });

  describe('loginSchema', () => {
    it('should validate valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const { error } = loginSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should reject missing password', () => {
      const invalidData = {
        email: 'test@example.com',
      };

      const { error } = loginSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.message).toContain('密码');
    });
  });

  describe('updateProfileSchema', () => {
    it('should validate valid profile data', () => {
      const validData = {
        name: 'New Name',
        phone: '13800138000',
      };

      const { error } = updateProfileSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should reject invalid phone number', () => {
      const invalidData = {
        name: 'New Name',
        phone: '123',
      };

      const { error } = updateProfileSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.message).toContain('手机号');
    });
  });

  describe('changePasswordSchema', () => {
    it('should validate valid password change data', () => {
      const validData = {
        currentPassword: 'oldpassword123',
        newPassword: 'newpassword123',
      };

      const { error } = changePasswordSchema.validate(validData);
      expect(error).toBeUndefined();
    });

    it('should reject when new password is same as current', () => {
      const invalidData = {
        currentPassword: 'password123',
        newPassword: 'password123',
      };

      const { error } = changePasswordSchema.validate(invalidData);
      expect(error).toBeDefined();
      expect(error?.message).toContain('不能与当前密码相同');
    });
  });
}); 