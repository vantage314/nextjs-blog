import { WebSocket } from 'ws';
import { Redis } from 'ioredis';
import { config } from '../config';

interface Notification {
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: any;
}

export class NotificationService {
  private redis: Redis;
  private wsClients: Map<string, WebSocket>;

  constructor() {
    this.redis = new Redis(config.redis);
    this.wsClients = new Map();
  }

  // 发送通知
  async sendNotification(notification: Notification): Promise<void> {
    // 存储通知到 Redis
    await this.storeNotification(notification);

    // 如果用户在线，通过 WebSocket 发送实时通知
    if (this.wsClients.has(notification.userId)) {
      const ws = this.wsClients.get(notification.userId);
      ws?.send(JSON.stringify(notification));
    }

    // 发送系统通知
    await this.sendSystemNotification(notification);
  }

  // 存储通知
  private async storeNotification(notification: Notification): Promise<void> {
    const key = `notifications:${notification.userId}`;
    await this.redis.lpush(key, JSON.stringify(notification));
    await this.redis.ltrim(key, 0, 99); // 只保留最近 100 条通知
  }

  // 发送系统通知
  private async sendSystemNotification(notification: Notification): Promise<void> {
    // 根据操作系统发送系统通知
    if (process.platform === 'win32') {
      // Windows 系统通知
      // TODO: 实现 Windows 系统通知
    } else if (process.platform === 'darwin') {
      // macOS 系统通知
      // TODO: 实现 macOS 系统通知
    } else {
      // Linux 系统通知
      // TODO: 实现 Linux 系统通知
    }
  }

  // 注册 WebSocket 客户端
  registerClient(userId: string, ws: WebSocket): void {
    this.wsClients.set(userId, ws);
  }

  // 移除 WebSocket 客户端
  removeClient(userId: string): void {
    this.wsClients.delete(userId);
  }

  // 获取用户通知历史
  async getNotificationHistory(userId: string, limit: number = 20): Promise<Notification[]> {
    const key = `notifications:${userId}`;
    const notifications = await this.redis.lrange(key, 0, limit - 1);
    return notifications.map(n => JSON.parse(n));
  }

  // 标记通知为已读
  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const key = `notifications:${userId}:read`;
    await this.redis.sadd(key, notificationId);
  }

  // 获取未读通知数量
  async getUnreadCount(userId: string): Promise<number> {
    const key = `notifications:${userId}:read`;
    const total = await this.redis.llen(`notifications:${userId}`);
    const read = await this.redis.scard(key);
    return total - read;
  }
} 