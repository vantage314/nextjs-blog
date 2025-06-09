import { ReminderQueue, ReminderServiceConfig } from '@/types/reminder';
import { db } from '@/lib/db';
import { eq, and, lte, gte } from 'drizzle-orm';
import { reminderQueue } from '@/lib/db/schema';
import { nanoid } from 'nanoid';
import { ReminderTemplateService } from './template';
import { sendEmail } from '@/lib/email';
import { sendNotification } from '@/lib/notification';
import { sendSMS } from '@/lib/sms';

export class ReminderQueueService {
  private config: ReminderServiceConfig;
  private templateService: ReminderTemplateService;
  private processing: boolean = false;

  constructor(config: ReminderServiceConfig) {
    this.config = config;
    this.templateService = new ReminderTemplateService();
  }

  async addToQueue(queueItem: Omit<ReminderQueue, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReminderQueue> {
    const now = new Date();
    const newQueueItem: ReminderQueue = {
      id: nanoid(),
      ...queueItem,
      status: 'pending',
      retryCount: 0,
      maxRetries: this.config.maxRetries,
      createdAt: now,
      updatedAt: now
    };

    await db.insert(reminderQueue).values(newQueueItem);
    return newQueueItem;
  }

  async processQueue(): Promise<void> {
    if (this.processing) {
      return;
    }

    this.processing = true;
    try {
      const pendingItems = await this.getPendingItems();
      
      for (const item of pendingItems) {
        try {
          await this.processItem(item);
        } catch (error) {
          console.error(`处理提醒失败: ${error.message}`);
          await this.handleFailure(item, error.message);
        }
      }
    } finally {
      this.processing = false;
    }
  }

  private async getPendingItems(): Promise<ReminderQueue[]> {
    const now = new Date();
    return db.select()
      .from(reminderQueue)
      .where(
        and(
          eq(reminderQueue.status, 'pending'),
          lte(reminderQueue.scheduledTime, now)
        )
      )
      .limit(this.config.batchSize);
  }

  private async processItem(item: ReminderQueue): Promise<void> {
    // 更新状态为处理中
    await this.updateStatus(item.id, 'processing');

    // 获取模板
    const template = await this.templateService.getTemplateById(item.ruleId);
    if (!template) {
      throw new Error('找不到对应的提醒模板');
    }

    // 准备变量
    const variables = await this.prepareVariables(item);

    // 渲染模板
    const content = await this.templateService.renderTemplate(template, variables);

    // 发送提醒
    switch (item.type) {
      case 'email':
        await sendEmail(item.userId, content);
        break;
      case 'notification':
        await sendNotification(item.userId, content);
        break;
      case 'sms':
        await sendSMS(item.userId, content);
        break;
      default:
        throw new Error(`不支持的提醒类型: ${item.type}`);
    }

    // 更新状态为已发送
    await this.updateStatus(item.id, 'sent', { sentTime: new Date() });
  }

  private async handleFailure(item: ReminderQueue, error: string): Promise<void> {
    const retryCount = item.retryCount + 1;
    
    if (retryCount >= item.maxRetries) {
      await this.updateStatus(item.id, 'failed', { error });
    } else {
      const nextRetryTime = new Date(Date.now() + this.config.retryInterval);
      await this.updateStatus(item.id, 'pending', {
        retryCount,
        scheduledTime: nextRetryTime,
        error
      });
    }
  }

  private async updateStatus(
    id: string,
    status: ReminderQueue['status'],
    updates: Partial<ReminderQueue> = {}
  ): Promise<void> {
    await db.update(reminderQueue)
      .set({
        status,
        ...updates,
        updatedAt: new Date()
      })
      .where(eq(reminderQueue.id, id));
  }

  private async prepareVariables(item: ReminderQueue): Promise<Record<string, string>> {
    // 这里需要根据实际情况获取事件和用户信息
    // 示例实现
    return {
      eventId: item.eventId,
      userId: item.userId,
      scheduledTime: item.scheduledTime.toISOString()
    };
  }

  async getQueueStats(): Promise<{
    pending: number;
    processing: number;
    sent: number;
    failed: number;
  }> {
    const stats = await db.select({
      status: reminderQueue.status,
      count: db.fn.count()
    })
    .from(reminderQueue)
    .groupBy(reminderQueue.status);

    return {
      pending: stats.find(s => s.status === 'pending')?.count || 0,
      processing: stats.find(s => s.status === 'processing')?.count || 0,
      sent: stats.find(s => s.status === 'sent')?.count || 0,
      failed: stats.find(s => s.status === 'failed')?.count || 0
    };
  }

  async cleanupOldRecords(days: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    await db.delete(reminderQueue)
      .where(
        and(
          eq(reminderQueue.status, 'sent'),
          lte(reminderQueue.sentTime, cutoffDate)
        )
      );
  }
} 