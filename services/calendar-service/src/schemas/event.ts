import { z } from 'zod';

export const eventSchema = z.object({
  title: z.string().min(1, '标题不能为空'),
  description: z.string().optional(),
  eventDate: z.string().transform((str) => new Date(str)),
  eventType: z.enum(['dividend', 'earnings', 'ipo', 'meeting', 'other']),
  reminder: z.boolean().default(false),
  reminderTime: z.string().transform((str) => new Date(str)).optional(),
});

export const reminderRuleSchema = z.object({
  ruleType: z.enum(['time', 'interval', 'custom']),
  ruleValue: z.object({
    time: z.string().transform((str) => new Date(str)).optional(),
    interval: z.object({
      value: z.number().min(1),
      unit: z.enum(['minutes', 'hours', 'days']),
    }).optional(),
    custom: z.object({
      days: z.array(z.number().min(0).max(6)),
      time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
    }).optional(),
  }),
}); 