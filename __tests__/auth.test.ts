import { validatePassword } from '../services/auth-service/src/middleware/passwordPolicy';
import { generateToken, verifyToken } from '../services/auth-service/src/utils/jwt';
import { config } from '../services/auth-service/src/config';

describe('密码策略测试', () => {
  test('密码符合要求', () => {
    const result = validatePassword('Test123!@#');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('密码长度不足', () => {
    const result = validatePassword('Test1!');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码长度至少为 8 个字符');
  });

  test('密码缺少大写字母', () => {
    const result = validatePassword('test123!@#');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码必须包含大写字母');
  });

  test('密码缺少小写字母', () => {
    const result = validatePassword('TEST123!@#');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码必须包含小写字母');
  });

  test('密码缺少数字', () => {
    const result = validatePassword('Test!@#');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码必须包含数字');
  });

  test('密码缺少特殊字符', () => {
    const result = validatePassword('Test123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('密码必须包含特殊字符');
  });
});

describe('JWT 测试', () => {
  const payload = {
    userId: '123',
    role: 'user'
  };

  test('生成和验证 token', () => {
    const token = generateToken(payload);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded).toMatchObject(payload);
  });

  test('验证过期 token', () => {
    const token = generateToken(payload, '1ms');
    setTimeout(() => {
      expect(() => verifyToken(token)).toThrow('Token已过期');
    }, 10);
  });

  test('验证无效 token', () => {
    expect(() => verifyToken('invalid-token')).toThrow('无效的token');
  });
});

describe('认证中间件测试', () => {
  const mockRequest = {
    headers: {
      authorization: 'Bearer valid-token'
    },
    user: undefined
  };

  const mockResponse = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  const nextFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('验证有效 token', async () => {
    const token = generateToken({ userId: '123', role: 'user' });
    mockRequest.headers.authorization = `Bearer ${token}`;

    await authenticate(mockRequest as any, mockResponse as any, nextFunction);

    expect(nextFunction).toHaveBeenCalled();
    expect(mockRequest.user).toBeDefined();
    expect(mockRequest.user?.userId).toBe('123');
  });

  test('验证无效 token', async () => {
    mockRequest.headers.authorization = 'Bearer invalid-token';

    await authenticate(mockRequest as any, mockResponse as any, nextFunction);

    expect(nextFunction).not.toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('无效的token')
      })
    );
  });
}); 