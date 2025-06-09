import { Schema, model, Document } from 'mongoose';

export interface IEvent extends Document {
  userId: string;
  title: string;
  description?: string;
  eventDate: Date;
  eventType: 'dividend' | 'earnings' | 'ipo' | 'meeting' | 'other';
  reminder: boolean;
  reminderTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    eventDate: { type: Date, required: true },
    eventType: {
      type: String,
      enum: ['dividend', 'earnings', 'ipo', 'meeting', 'other'],
      required: true,
    },
    reminder: { type: Boolean, default: false },
    reminderTime: { type: Date },
  },
  {
    timestamps: true,
  }
);

// 索引优化
EventSchema.index({ userId: 1, eventDate: 1 });
EventSchema.index({ userId: 1, reminder: 1, reminderTime: 1 });

export const Event = model<IEvent>('Event', EventSchema); 