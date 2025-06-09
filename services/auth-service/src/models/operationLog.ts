import mongoose, { Document, Schema } from 'mongoose';

export interface IOperationLog extends Document {
  userId: string;
  operation: string;
  method: string;
  path: string;
  ip: string;
  userAgent?: string;
  requestBody?: any;
  responseBody?: any;
  status: number;
  timestamp: Date;
}

const operationLogSchema = new Schema<IOperationLog>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  operation: {
    type: String,
    required: true,
    enum: ['login', 'register', 'changePassword', 'updateProfile', 'deleteAccount']
  },
  method: {
    type: String,
    required: true,
    enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  },
  path: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  },
  userAgent: {
    type: String
  },
  requestBody: {
    type: Schema.Types.Mixed
  },
  responseBody: {
    type: Schema.Types.Mixed
  },
  status: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// 创建索引
operationLogSchema.index({ userId: 1, timestamp: -1 });
operationLogSchema.index({ operation: 1, timestamp: -1 });

export const OperationLog = mongoose.model<IOperationLog>('OperationLog', operationLogSchema); 