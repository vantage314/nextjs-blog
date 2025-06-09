import { Schema, model, Document } from 'mongoose';

export interface IReminderRule extends Document {
  eventId: string;
  userId: string;
  ruleType: 'time' | 'interval' | 'custom';
  ruleValue: {
    time?: Date;
    interval?: {
      value: number;
      unit: 'minutes' | 'hours' | 'days';
    };
    custom?: {
      days: number[];
      time: string;
    };
  };
  createdAt: Date;
}

const ReminderRuleSchema = new Schema<IReminderRule>(
  {
    eventId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    ruleType: {
      type: String,
      enum: ['time', 'interval', 'custom'],
      required: true,
    },
    ruleValue: {
      time: Date,
      interval: {
        value: Number,
        unit: {
          type: String,
          enum: ['minutes', 'hours', 'days'],
        },
      },
      custom: {
        days: [Number],
        time: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

// 索引优化
ReminderRuleSchema.index({ eventId: 1, userId: 1 });
ReminderRuleSchema.index({ userId: 1, 'ruleValue.time': 1 });

export const ReminderRule = model<IReminderRule>('ReminderRule', ReminderRuleSchema); 