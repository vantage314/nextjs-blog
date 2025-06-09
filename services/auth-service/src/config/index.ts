import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export const config = {
  // 服务器配置
  port: process.env.PORT || 3001,
  env: process.env.NODE_ENV || 'development',

  // 数据库配置
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/fincoach-auth',

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    issuer: process.env.JWT_ISSUER || 'fincoach-plus',
    audience: process.env.JWT_AUDIENCE || 'fincoach-users',
    algorithm: 'HS256'
  },

  // 跨域配置
  corsOrigin: process.env.CORS_ORIGIN || '*',

  // 日志配置
  logLevel: process.env.LOG_LEVEL || 'info',

  // 安全配置
  security: {
    bcryptSaltRounds: 10,
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100, // 最大请求次数
      loginMax: 5 // 登录接口每分钟最大请求次数
    },
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true
    },
    csrf: {
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN'
    }
  },

  // 监控配置
  monitoring: {
    prometheus: {
      enabled: process.env.ENABLE_PROMETHEUS === 'true',
      port: process.env.PROMETHEUS_PORT || 9090
    },
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV || 'development'
    }
  }
}; 