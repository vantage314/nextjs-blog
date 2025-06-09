import { Event, IEvent } from '../models/Event';
import { ReminderRule, IReminderRule } from '../models/ReminderRule';
import { NotificationService } from './NotificationService';

export class CalendarService {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationService();
  }

  // 创建事件
  async createEvent(eventData: Partial<IEvent>, reminderRule?: Partial<IReminderRule>): Promise<IEvent> {
    const event = await Event.create(eventData);
    
    if (reminderRule) {
      await ReminderRule.create({
        ...reminderRule,
        eventId: event._id,
        userId: event.userId,
      });
    }

    return event;
  }

  // 更新事件
  async updateEvent(eventId: string, userId: string, eventData: Partial<IEvent>): Promise<IEvent | null> {
    const event = await Event.findOneAndUpdate(
      { _id: eventId, userId },
      { $set: eventData },
      { new: true }
    );

    if (!event) return null;

    // 如果更新了提醒设置，同步更新提醒规则
    if (eventData.reminder !== undefined) {
      await ReminderRule.updateOne(
        { eventId, userId },
        { $set: { active: eventData.reminder } }
      );
    }

    return event;
  }

  // 删除事件
  async deleteEvent(eventId: string, userId: string): Promise<boolean> {
    const result = await Event.deleteOne({ _id: eventId, userId });
    if (result.deletedCount > 0) {
      await ReminderRule.deleteMany({ eventId, userId });
      return true;
    }
    return false;
  }

  // 获取用户事件列表
  async getUserEvents(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<IEvent[]> {
    return Event.find({
      userId,
      eventDate: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ eventDate: 1 });
  }

  // 获取待提醒事件
  async getUpcomingReminders(userId: string, minutes: number = 30): Promise<IEvent[]> {
    const now = new Date();
    const futureTime = new Date(now.getTime() + minutes * 60000);

    return Event.find({
      userId,
      reminder: true,
      reminderTime: {
        $gte: now,
        $lte: futureTime,
      },
    });
  }

  // 处理提醒
  async processReminders(): Promise<void> {
    const events = await this.getUpcomingReminders('all', 30);
    
    for (const event of events) {
      await this.notificationService.sendNotification({
        userId: event.userId,
        title: '事件提醒',
        message: `您有一个即将到来的事件：${event.title}`,
        type: 'event_reminder',
        data: {
          eventId: event._id.toString(),
          eventType: event.eventType,
        },
      });
    }
  }

  // 导入事件
  async importEvents(userId: string, events: Partial<IEvent>[]): Promise<IEvent[]> {
    const importedEvents = await Event.insertMany(
      events.map(event => ({
        ...event,
        userId,
      }))
    );
    return importedEvents;
  }

  // 导出事件
  async exportEvents(userId: string, startDate: Date, endDate: Date): Promise<IEvent[]> {
    return this.getUserEvents(userId, startDate, endDate);
  }
} 