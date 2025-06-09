import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { User } from '../../models/user';

describe('Auth Controller Test', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let authController: AuthController;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    authController = new AuthController();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            email: 'test@example.com',
            name: 'Test User',
          }),
        })
      );
    });

    it('should fail to register with existing email', async () => {
      // 先创建一个用户
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User 2',
      };

      await authController.register(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('邮箱已被注册'),
        })
      );
    });
  });

  describe('login', () => {
    beforeEach(async () => {
      // 创建一个测试用户
      await User.create({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    });

    it('should login successfully with correct credentials', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            token: expect.any(String),
            user: expect.objectContaining({
              email: 'test@example.com',
              name: 'Test User',
            }),
          }),
        })
      );
    });

    it('should fail to login with incorrect password', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await authController.login(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: expect.stringContaining('密码错误'),
        })
      );
    });
  });
}); 