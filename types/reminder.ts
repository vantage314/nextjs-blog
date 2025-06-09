export interface ReminderTemplate {
  id: string;
  name: string;
  description?: string;
  type: 'email' | 'notification' | 'sms';
  content: string;
  variables: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderQueue {
  id: string;
  eventId: string;
  ruleId: string;
  userId: string;
  type: 'email' | 'notification' | 'sms';
  status: 'pending' | 'processing' | 'sent' | 'failed';
  scheduledTime: Date;
  sentTime?: Date;
  error?: string;
  retryCount: number;
  maxRetries: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReminderStats {
  totalReminders: number;
  sentReminders: number;
  failedReminders: number;
  pendingReminders: number;
  averageResponseTime: number;
  successRate: number;
  byType: {
    email: number;
    notification: number;
    sms: number;
  };
  byStatus: {
    pending: number;
    processing: number;
    sent: number;
    failed: number;
  };
  byTimeRange: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export interface ReminderAnalytics {
  userId: string;
  stats: ReminderStats;
  topEvents: {
    eventId: string;
    eventTitle: string;
    reminderCount: number;
  }[];
  topTemplates: {
    templateId: string;
    templateName: string;
    usageCount: number;
  }[];
  responseTimeTrend: {
    date: string;
    averageResponseTime: number;
  }[];
  failureReasons: {
    reason: string;
    count: number;
  }[];
}

export interface ReminderValidationResult {
  isValid: boolean;
  errors: {
    field: string;
    message: string;
  }[];
  warnings: {
    field: string;
    message: string;
  }[];
}

export interface ReminderServiceConfig {
  maxRetries: number;
  retryInterval: number;
  batchSize: number;
  concurrency: number;
  timeout: number;
  rateLimit: {
    maxRequests: number;
    timeWindow: number;
  };
} 