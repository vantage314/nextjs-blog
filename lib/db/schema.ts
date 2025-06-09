import { sql } from 'drizzle-orm';
import {
  text,
  timestamp,
  pgTable,
  serial,
  integer,
  boolean,
  json,
  varchar,
  primaryKey
} from 'drizzle-orm/pg-core';

export const reminderTemplates = pgTable('reminder_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type', { enum: ['email', 'notification', 'sms'] }).notNull(),
  content: text('content').notNull(),
  variables: json('variables').$type<string[]>(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const reminderQueue = pgTable('reminder_queue', {
  id: text('id').primaryKey(),
  eventId: text('event_id').notNull(),
  ruleId: text('rule_id').notNull(),
  userId: text('user_id').notNull(),
  type: text('type', { enum: ['email', 'notification', 'sms'] }).notNull(),
  status: text('status', { enum: ['pending', 'processing', 'sent', 'failed'] }).notNull(),
  scheduledTime: timestamp('scheduled_time').notNull(),
  sentTime: timestamp('sent_time'),
  error: text('error'),
  retryCount: integer('retry_count').default(0).notNull(),
  maxRetries: integer('max_retries').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const reminderHistory = pgTable('reminder_history', {
  id: text('id').primaryKey(),
  queueId: text('queue_id').notNull(),
  userId: text('user_id').notNull(),
  eventId: text('event_id').notNull(),
  type: text('type', { enum: ['email', 'notification', 'sms'] }).notNull(),
  status: text('status', { enum: ['sent', 'failed'] }).notNull(),
  sentTime: timestamp('sent_time').notNull(),
  error: text('error'),
  responseTime: integer('response_time'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export const reminderStats = pgTable('reminder_stats', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull(),
  date: timestamp('date').notNull(),
  totalReminders: integer('total_reminders').default(0).notNull(),
  sentReminders: integer('sent_reminders').default(0).notNull(),
  failedReminders: integer('failed_reminders').default(0).notNull(),
  averageResponseTime: integer('average_response_time'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// 索引
export const reminderQueueIndexes = {
  userId: sql`CREATE INDEX IF NOT EXISTS idx_reminder_queue_user_id ON reminder_queue(user_id)`,
  eventId: sql`CREATE INDEX IF NOT EXISTS idx_reminder_queue_event_id ON reminder_queue(event_id)`,
  status: sql`CREATE INDEX IF NOT EXISTS idx_reminder_queue_status ON reminder_queue(status)`,
  scheduledTime: sql`CREATE INDEX IF NOT EXISTS idx_reminder_queue_scheduled_time ON reminder_queue(scheduled_time)`
};

export const reminderHistoryIndexes = {
  userId: sql`CREATE INDEX IF NOT EXISTS idx_reminder_history_user_id ON reminder_history(user_id)`,
  eventId: sql`CREATE INDEX IF NOT EXISTS idx_reminder_history_event_id ON reminder_history(event_id)`,
  sentTime: sql`CREATE INDEX IF NOT EXISTS idx_reminder_history_sent_time ON reminder_history(sent_time)`
};

export const reminderStatsIndexes = {
  userId: sql`CREATE INDEX IF NOT EXISTS idx_reminder_stats_user_id ON reminder_stats(user_id)`,
  date: sql`CREATE INDEX IF NOT EXISTS idx_reminder_stats_date ON reminder_stats(date)`
}; 