import { ReminderStats, ReminderAnalytics } from '@/types/reminder';
import { db } from '@/lib/db';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { reminderQueue, reminderTemplates } from '@/lib/db/schema';

export class ReminderAnalyticsService {
  async getStats(userId: string, timeRange: 'today' | 'thisWeek' | 'thisMonth'): Promise<ReminderStats> {
    const { startDate, endDate } = this.getDateRange(timeRange);

    const [queueStats, typeStats, statusStats] = await Promise.all([
      this.getQueueStats(userId, startDate, endDate),
      this.getTypeStats(userId, startDate, endDate),
      this.getStatusStats(userId, startDate, endDate)
    ]);

    const totalReminders = queueStats.total;
    const sentReminders = queueStats.sent;
    const failedReminders = queueStats.failed;
    const pendingReminders = queueStats.pending;

    return {
      totalReminders,
      sentReminders,
      failedReminders,
      pendingReminders,
      averageResponseTime: queueStats.averageResponseTime,
      successRate: totalReminders > 0 ? (sentReminders / totalReminders) * 100 : 0,
      byType: typeStats,
      byStatus: statusStats,
      byTimeRange: {
        today: await this.getCountByTimeRange(userId, 'today'),
        thisWeek: await this.getCountByTimeRange(userId, 'thisWeek'),
        thisMonth: await this.getCountByTimeRange(userId, 'thisMonth')
      }
    };
  }

  async getAnalytics(userId: string): Promise<ReminderAnalytics> {
    const stats = await this.getStats(userId, 'thisMonth');
    const [topEvents, topTemplates, responseTimeTrend, failureReasons] = await Promise.all([
      this.getTopEvents(userId),
      this.getTopTemplates(userId),
      this.getResponseTimeTrend(userId),
      this.getFailureReasons(userId)
    ]);

    return {
      userId,
      stats,
      topEvents,
      topTemplates,
      responseTimeTrend,
      failureReasons
    };
  }

  private async getQueueStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<{
    total: number;
    sent: number;
    failed: number;
    pending: number;
    averageResponseTime: number;
  }> {
    const result = await db.select({
      total: sql<number>`count(*)`,
      sent: sql<number>`sum(case when status = 'sent' then 1 else 0 end)`,
      failed: sql<number>`sum(case when status = 'failed' then 1 else 0 end)`,
      pending: sql<number>`sum(case when status = 'pending' then 1 else 0 end)`,
      averageResponseTime: sql<number>`avg(
        case 
          when status = 'sent' and sent_time is not null 
          then extract(epoch from (sent_time - scheduled_time))
          else null 
        end
      )`
    })
    .from(reminderQueue)
    .where(
      and(
        eq(reminderQueue.userId, userId),
        gte(reminderQueue.createdAt, startDate),
        lte(reminderQueue.createdAt, endDate)
      )
    );

    return result[0];
  }

  private async getTypeStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReminderStats['byType']> {
    const result = await db.select({
      type: reminderQueue.type,
      count: sql<number>`count(*)`
    })
    .from(reminderQueue)
    .where(
      and(
        eq(reminderQueue.userId, userId),
        gte(reminderQueue.createdAt, startDate),
        lte(reminderQueue.createdAt, endDate)
      )
    )
    .groupBy(reminderQueue.type);

    return {
      email: result.find(r => r.type === 'email')?.count || 0,
      notification: result.find(r => r.type === 'notification')?.count || 0,
      sms: result.find(r => r.type === 'sms')?.count || 0
    };
  }

  private async getStatusStats(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ReminderStats['byStatus']> {
    const result = await db.select({
      status: reminderQueue.status,
      count: sql<number>`count(*)`
    })
    .from(reminderQueue)
    .where(
      and(
        eq(reminderQueue.userId, userId),
        gte(reminderQueue.createdAt, startDate),
        lte(reminderQueue.createdAt, endDate)
      )
    )
    .groupBy(reminderQueue.status);

    return {
      pending: result.find(r => r.status === 'pending')?.count || 0,
      processing: result.find(r => r.status === 'processing')?.count || 0,
      sent: result.find(r => r.status === 'sent')?.count || 0,
      failed: result.find(r => r.status === 'failed')?.count || 0
    };
  }

  private async getCountByTimeRange(
    userId: string,
    timeRange: 'today' | 'thisWeek' | 'thisMonth'
  ): Promise<number> {
    const { startDate, endDate } = this.getDateRange(timeRange);

    const result = await db.select({
      count: sql<number>`count(*)`
    })
    .from(reminderQueue)
    .where(
      and(
        eq(reminderQueue.userId, userId),
        gte(reminderQueue.createdAt, startDate),
        lte(reminderQueue.createdAt, endDate)
      )
    );

    return result[0].count;
  }

  private async getTopEvents(userId: string): Promise<ReminderAnalytics['topEvents']> {
    const result = await db.select({
      eventId: reminderQueue.eventId,
      count: sql<number>`count(*)`
    })
    .from(reminderQueue)
    .where(eq(reminderQueue.userId, userId))
    .groupBy(reminderQueue.eventId)
    .orderBy(sql`count(*) desc`)
    .limit(5);

    // 这里需要根据 eventId 获取事件标题
    // 示例实现
    return result.map(r => ({
      eventId: r.eventId,
      eventTitle: `事件 ${r.eventId}`,
      reminderCount: r.count
    }));
  }

  private async getTopTemplates(userId: string): Promise<ReminderAnalytics['topTemplates']> {
    const result = await db.select({
      templateId: reminderQueue.ruleId,
      count: sql<number>`count(*)`
    })
    .from(reminderQueue)
    .where(eq(reminderQueue.userId, userId))
    .groupBy(reminderQueue.ruleId)
    .orderBy(sql`count(*) desc`)
    .limit(5);

    // 获取模板名称
    const templates = await Promise.all(
      result.map(async r => {
        const template = await db.select()
          .from(reminderTemplates)
          .where(eq(reminderTemplates.id, r.templateId))
          .limit(1);
        
        return {
          templateId: r.templateId,
          templateName: template[0]?.name || '未知模板',
          usageCount: r.count
        };
      })
    );

    return templates;
  }

  private async getResponseTimeTrend(userId: string): Promise<ReminderAnalytics['responseTimeTrend']> {
    const result = await db.select({
      date: sql<string>`to_char(sent_time, 'YYYY-MM-DD')`,
      averageResponseTime: sql<number>`avg(
        extract(epoch from (sent_time - scheduled_time))
      )`
    })
    .from(reminderQueue)
    .where(
      and(
        eq(reminderQueue.userId, userId),
        eq(reminderQueue.status, 'sent')
      )
    )
    .groupBy(sql`to_char(sent_time, 'YYYY-MM-DD')`)
    .orderBy(sql`to_char(sent_time, 'YYYY-MM-DD')`)
    .limit(30);

    return result.map(r => ({
      date: r.date,
      averageResponseTime: r.averageResponseTime
    }));
  }

  private async getFailureReasons(userId: string): Promise<ReminderAnalytics['failureReasons']> {
    const result = await db.select({
      reason: reminderQueue.error,
      count: sql<number>`count(*)`
    })
    .from(reminderQueue)
    .where(
      and(
        eq(reminderQueue.userId, userId),
        eq(reminderQueue.status, 'failed')
      )
    )
    .groupBy(reminderQueue.error)
    .orderBy(sql`count(*) desc`)
    .limit(5);

    return result.map(r => ({
      reason: r.reason || '未知原因',
      count: r.count
    }));
  }

  private getDateRange(timeRange: 'today' | 'thisWeek' | 'thisMonth'): { startDate: Date; endDate: Date } {
    const endDate = new Date();
    const startDate = new Date();

    switch (timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'thisWeek':
        startDate.setDate(startDate.getDate() - startDate.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'thisMonth':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
    }

    return { startDate, endDate };
  }
} 