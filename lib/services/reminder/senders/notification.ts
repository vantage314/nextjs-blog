import { ReminderTemplate } from '@/types/reminder';
import { reminderTypeConfig } from '@/lib/config/reminder';
import { WebSocket } from 'ws';

export class NotificationSender {
  private config = reminderTypeConfig.notification;
  private wsServer: WebSocket.Server;
  private connections: Map<string, WebSocket> = new Map();

  constructor(port: number = 8080) {
    this.wsServer = new WebSocket.Server({ port });
    this.setupWebSocketServer();
  }

  private setupWebSocketServer() {
    this.wsServer.on('connection', (ws: WebSocket, req) => {
      const userId = this.getUserIdFromRequest(req);
      if (userId) {
        this.connections.set(userId, ws);
        
        ws.on('close', () => {
          this.connections.delete(userId);
        });

        ws.on('error', (error) => {
          console.error(`WebSocket 错误 (用户 ${userId}):`, error);
          this.connections.delete(userId);
        });
      }
    });
  }

  private getUserIdFromRequest(req: any): string | null {
    // TODO: 从请求中获取用户ID
    // 这里需要根据实际的认证机制来实现
    return req.headers['user-id'] || null;
  }

  async send(
    userId: string,
    template: ReminderTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    try {
      // 验证内容长度
      if (template.content.length > this.config.maxLength) {
        throw new Error(`通知内容超过最大长度限制: ${this.config.maxLength}`);
      }

      // 获取用户连接
      const ws = this.connections.get(userId);
      if (!ws) {
        throw new Error(`用户 ${userId} 未连接`);
      }

      // 准备通知内容
      const content = this.prepareNotificationContent(template, variables);

      // 发送通知
      ws.send(JSON.stringify({
        type: 'reminder',
        data: {
          id: template.id,
          content,
          timestamp: new Date().toISOString()
        }
      }));
    } catch (error) {
      console.error('发送通知失败:', error);
      throw error;
    }
  }

  private prepareNotificationContent(
    template: ReminderTemplate,
    variables: Record<string, string>
  ): string {
    let content = template.content;

    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, value);
    }

    return content;
  }

  // 广播通知给所有在线用户
  async broadcast(
    template: ReminderTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    const content = this.prepareNotificationContent(template, variables);
    const message = JSON.stringify({
      type: 'broadcast',
      data: {
        id: template.id,
        content,
        timestamp: new Date().toISOString()
      }
    });

    for (const [userId, ws] of this.connections) {
      try {
        ws.send(message);
      } catch (error) {
        console.error(`广播通知失败 (用户 ${userId}):`, error);
      }
    }
  }

  // 获取在线用户数
  getOnlineUsers(): number {
    return this.connections.size;
  }

  // 获取在线用户列表
  getOnlineUserIds(): string[] {
    return Array.from(this.connections.keys());
  }

  // 关闭服务器
  close(): void {
    this.wsServer.close();
  }
} 