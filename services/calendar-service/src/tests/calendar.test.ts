import { CalendarService } from '../services/CalendarService';
import { Event } from '../models/Event';
import { ReminderRule } from '../models/ReminderRule';
import mongoose from 'mongoose';

describe('CalendarService', () => {
  let calendarService: CalendarService;
  const userId = 'test-user-id';

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fincoach-test');
    calendarService = new CalendarService();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Event.deleteMany({});
    await ReminderRule.deleteMany({});
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        eventDate: new Date(),
        eventType: 'meeting' as const,
        reminder: true,
      };

      const event = await calendarService.createEvent({
        ...eventData,
        userId,
      });

      expect(event).toBeDefined();
      expect(event.title).toBe(eventData.title);
      expect(event.userId).toBe(userId);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', async () => {
      const event = await Event.create({
        title: 'Original Title',
        eventDate: new Date(),
        eventType: 'meeting',
        userId,
      });

      const updatedEvent = await calendarService.updateEvent(
        event._id.toString(),
        userId,
        { title: 'Updated Title' }
      );

      expect(updatedEvent).toBeDefined();
      expect(updatedEvent?.title).toBe('Updated Title');
    });
  });

  describe('deleteEvent', () => {
    it('should delete an existing event', async () => {
      const event = await Event.create({
        title: 'Test Event',
        eventDate: new Date(),
        eventType: 'meeting',
        userId,
      });

      const success = await calendarService.deleteEvent(
        event._id.toString(),
        userId
      );

      expect(success).toBe(true);
      const deletedEvent = await Event.findById(event._id);
      expect(deletedEvent).toBeNull();
    });
  });

  describe('getUserEvents', () => {
    it('should return events within date range', async () => {
      const startDate = new Date();
      const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

      await Event.create([
        {
          title: 'Event 1',
          eventDate: startDate,
          eventType: 'meeting',
          userId,
        },
        {
          title: 'Event 2',
          eventDate: endDate,
          eventType: 'meeting',
          userId,
        },
      ]);

      const events = await calendarService.getUserEvents(
        userId,
        startDate,
        endDate
      );

      expect(events).toHaveLength(2);
    });
  });

  describe('processReminders', () => {
    it('should process upcoming reminders', async () => {
      const now = new Date();
      const reminderTime = new Date(now.getTime() + 15 * 60 * 1000);

      await Event.create({
        title: 'Reminder Event',
        eventDate: reminderTime,
        eventType: 'meeting',
        reminder: true,
        reminderTime,
        userId,
      });

      await calendarService.processReminders();

      // 验证通知是否已发送
      // TODO: 添加通知验证逻辑
    });
  });
}); 