import { SenderFactory, SenderType } from './senders/factory';
import { ReminderQueueService } from './queue';
import { ReminderAnalyticsService } from './analytics';
import { reminderConfig } from '@/lib/config/reminder';

interface MonitorMetrics {
  queueSize: number;
  processingRate: number;
  errorRate: number;
  averageResponseTime: number;
  senderStatus: Record<SenderType, boolean>;
  onlineUsers: number;
  smsBalance: number;
}

interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: MonitorMetrics) => boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  cooldown: number; // 冷却时间（毫秒）
  lastTriggered?: number;
}

export class ReminderMonitor {
  private static instance: ReminderMonitor;
  private metrics: MonitorMetrics;
  private alertRules: AlertRule[] = [];
  private isMonitoring: boolean = false;
  private monitorInterval: NodeJS.Timeout | null = null;

  private constructor(
    private queueService: ReminderQueueService,
    private analyticsService: ReminderAnalyticsService,
    private senderFactory: SenderFactory
  ) {
    this.metrics = this.getInitialMetrics();
    this.setupAlertRules();
  }

  public static getInstance(
    queueService: ReminderQueueService,
    analyticsService: ReminderAnalyticsService,
    senderFactory: SenderFactory
  ): ReminderMonitor {
    if (!ReminderMonitor.instance) {
      ReminderMonitor.instance = new ReminderMonitor(
        queueService,
        analyticsService,
        senderFactory
      );
    }
    return ReminderMonitor.instance;
  }

  private getInitialMetrics(): MonitorMetrics {
    return {
      queueSize: 0,
      processingRate: 0,
      errorRate: 0,
      averageResponseTime: 0,
      senderStatus: {
        email: false,
        notification: false,
        sms: false
      },
      onlineUsers: 0,
      smsBalance: 0
    };
  }

  private setupAlertRules() {
    this.alertRules = [
      {
        id: 'queue-size',
        name: '队列大小告警',
        condition: (metrics) => metrics.queueSize > 1000,
        severity: 'warning',
        message: '提醒队列积压超过1000条',
        cooldown: 5 * 60 * 1000 // 5分钟
      },
      {
        id: 'error-rate',
        name: '错误率告警',
        condition: (metrics) => metrics.errorRate > 0.1,
        severity: 'error',
        message: '提醒发送错误率超过10%',
        cooldown: 5 * 60 * 1000
      },
      {
        id: 'response-time',
        name: '响应时间告警',
        condition: (metrics) => metrics.averageResponseTime > 5000,
        severity: 'warning',
        message: '平均响应时间超过5秒',
        cooldown: 5 * 60 * 1000
      },
      {
        id: 'sender-status',
        name: '发送服务状态告警',
        condition: (metrics) => 
          Object.values(metrics.senderStatus).some(status => !status),
        severity: 'error',
        message: '部分发送服务不可用',
        cooldown: 1 * 60 * 1000
      },
      {
        id: 'sms-balance',
        name: '短信余额告警',
        condition: (metrics) => metrics.smsBalance < 100,
        severity: 'warning',
        message: '短信余额不足100条',
        cooldown: 30 * 60 * 1000 // 30分钟
      }
    ];
  }

  public async startMonitoring(interval: number = 60000): Promise<void> {
    if (this.isMonitoring) {
      return;
    }

    this.isMonitoring = true;
    this.monitorInterval = setInterval(async () => {
      try {
        await this.collectMetrics();
        await this.checkAlerts();
      } catch (error) {
        console.error('监控指标收集失败:', error);
      }
    }, interval);
  }

  public stopMonitoring(): void {
    if (this.monitorInterval) {
      clearInterval(this.monitorInterval);
      this.monitorInterval = null;
    }
    this.isMonitoring = false;
  }

  private async collectMetrics(): Promise<void> {
    const [
      queueStats,
      senderStatus,
      smsBalance
    ] = await Promise.all([
      this.queueService.getQueueStats(),
      this.senderFactory.verifyAllConnections(),
      this.getSMSBalance()
    ]);

    this.metrics = {
      queueSize: queueStats.pending + queueStats.processing,
      processingRate: this.calculateProcessingRate(queueStats),
      errorRate: this.calculateErrorRate(queueStats),
      averageResponseTime: await this.getAverageResponseTime(),
      senderStatus,
      onlineUsers: await this.getOnlineUsers(),
      smsBalance
    };
  }

  private calculateProcessingRate(stats: any): number {
    const total = stats.pending + stats.processing + stats.sent + stats.failed;
    return total > 0 ? stats.sent / total : 0;
  }

  private calculateErrorRate(stats: any): number {
    const total = stats.sent + stats.failed;
    return total > 0 ? stats.failed / total : 0;
  }

  private async getAverageResponseTime(): Promise<number> {
    // TODO: 从分析服务获取平均响应时间
    return 0;
  }

  private async getOnlineUsers(): Promise<number> {
    // TODO: 从通知服务获取在线用户数
    return 0;
  }

  private async getSMSBalance(): Promise<number> {
    try {
      const smsSender = this.senderFactory.getSender('sms') as any;
      return await smsSender.getBalance();
    } catch (error) {
      console.error('获取短信余额失败:', error);
      return 0;
    }
  }

  private async checkAlerts(): Promise<void> {
    const now = Date.now();

    for (const rule of this.alertRules) {
      if (
        rule.condition(this.metrics) &&
        (!rule.lastTriggered || now - rule.lastTriggered >= rule.cooldown)
      ) {
        await this.triggerAlert(rule);
        rule.lastTriggered = now;
      }
    }
  }

  private async triggerAlert(rule: AlertRule): Promise<void> {
    try {
      // TODO: 实现告警通知逻辑
      console.log(`[${rule.severity.toUpperCase()}] ${rule.message}`, this.metrics);
    } catch (error) {
      console.error('触发告警失败:', error);
    }
  }

  public getMetrics(): MonitorMetrics {
    return { ...this.metrics };
  }

  public addAlertRule(rule: AlertRule): void {
    this.alertRules.push(rule);
  }

  public removeAlertRule(ruleId: string): void {
    this.alertRules = this.alertRules.filter(rule => rule.id !== ruleId);
  }
} 