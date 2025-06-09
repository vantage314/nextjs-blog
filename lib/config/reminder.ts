import { ReminderServiceConfig } from '@/types/reminder';

export const reminderConfig: ReminderServiceConfig = {
  // 最大重试次数
  maxRetries: 3,
  
  // 重试间隔（毫秒）
  retryInterval: 5 * 60 * 1000, // 5分钟
  
  // 批处理大小
  batchSize: 100,
  
  // 并发处理数
  concurrency: 5,
  
  // 超时时间（毫秒）
  timeout: 30 * 1000, // 30秒
  
  // 速率限制
  rateLimit: {
    // 每个时间窗口内的最大请求数
    maxRequests: 1000,
    // 时间窗口（毫秒）
    timeWindow: 60 * 1000 // 1分钟
  }
};

// 提醒类型配置
export const reminderTypeConfig = {
  email: {
    enabled: true,
    priority: 1,
    maxLength: 1000,
    subjectMaxLength: 100,
    retryStrategy: {
      maxRetries: 3,
      retryInterval: 5 * 60 * 1000 // 5分钟
    }
  },
  notification: {
    enabled: true,
    priority: 2,
    maxLength: 200,
    retryStrategy: {
      maxRetries: 2,
      retryInterval: 2 * 60 * 1000 // 2分钟
    }
  },
  sms: {
    enabled: true,
    priority: 3,
    maxLength: 160,
    retryStrategy: {
      maxRetries: 1,
      retryInterval: 1 * 60 * 1000 // 1分钟
    }
  }
};

// 提醒模板配置
export const templateConfig = {
  // 默认变量
  defaultVariables: [
    'eventTitle',
    'eventDate',
    'eventType',
    'userName',
    'reminderTime'
  ],
  
  // 变量验证规则
  variableRules: {
    eventTitle: {
      required: true,
      maxLength: 100
    },
    eventDate: {
      required: true,
      format: 'YYYY-MM-DD HH:mm'
    },
    eventType: {
      required: true,
      enum: ['dividend', 'earnings', 'ipo', 'meeting', 'other']
    },
    userName: {
      required: true,
      maxLength: 50
    },
    reminderTime: {
      required: true,
      format: 'YYYY-MM-DD HH:mm'
    }
  },
  
  // 内容验证规则
  contentRules: {
    email: {
      minLength: 10,
      maxLength: 1000,
      requiredVariables: ['eventTitle', 'eventDate', 'userName']
    },
    notification: {
      minLength: 5,
      maxLength: 200,
      requiredVariables: ['eventTitle', 'eventDate']
    },
    sms: {
      minLength: 5,
      maxLength: 160,
      requiredVariables: ['eventTitle', 'eventDate']
    }
  }
};

// 提醒统计配置
export const statsConfig = {
  // 统计时间范围
  timeRanges: {
    today: 'today',
    thisWeek: 'thisWeek',
    thisMonth: 'thisMonth'
  },
  
  // 统计指标
  metrics: {
    totalReminders: true,
    sentReminders: true,
    failedReminders: true,
    pendingReminders: true,
    averageResponseTime: true,
    successRate: true,
    byType: true,
    byStatus: true,
    byTimeRange: true
  },
  
  // 数据保留时间（天）
  retentionDays: 90,
  
  // 统计更新间隔（分钟）
  updateInterval: 5
}; 