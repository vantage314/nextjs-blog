import { EmailSender } from './email';
import { NotificationSender } from './notification';
import { SMSSender } from './sms';
import { ReminderTemplate } from '@/types/reminder';

export type SenderType = 'email' | 'notification' | 'sms';

export interface Sender {
  send(
    userId: string,
    template: ReminderTemplate,
    variables: Record<string, string>
  ): Promise<void>;
  verifyConnection(): Promise<boolean>;
}

export class SenderFactory {
  private static instance: SenderFactory;
  private senders: Map<SenderType, Sender> = new Map();

  private constructor() {
    // 初始化发送器实例
    this.senders.set('email', new EmailSender());
    this.senders.set('notification', new NotificationSender());
    this.senders.set('sms', new SMSSender());
  }

  public static getInstance(): SenderFactory {
    if (!SenderFactory.instance) {
      SenderFactory.instance = new SenderFactory();
    }
    return SenderFactory.instance;
  }

  public getSender(type: SenderType): Sender {
    const sender = this.senders.get(type);
    if (!sender) {
      throw new Error(`不支持的发送类型: ${type}`);
    }
    return sender;
  }

  public async verifyAllConnections(): Promise<Record<SenderType, boolean>> {
    const results: Record<SenderType, boolean> = {
      email: false,
      notification: false,
      sms: false
    };

    for (const [type, sender] of this.senders) {
      try {
        results[type] = await sender.verifyConnection();
      } catch (error) {
        console.error(`${type} 连接验证失败:`, error);
        results[type] = false;
      }
    }

    return results;
  }

  public async send(
    type: SenderType,
    userId: string,
    template: ReminderTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    const sender = this.getSender(type);
    await sender.send(userId, template, variables);
  }

  public async sendAll(
    userId: string,
    template: ReminderTemplate,
    variables: Record<string, string>
  ): Promise<Record<SenderType, boolean>> {
    const results: Record<SenderType, boolean> = {
      email: false,
      notification: false,
      sms: false
    };

    const promises = Array.from(this.senders.entries()).map(
      async ([type, sender]) => {
        try {
          await sender.send(userId, template, variables);
          results[type] = true;
        } catch (error) {
          console.error(`${type} 发送失败:`, error);
          results[type] = false;
        }
      }
    );

    await Promise.all(promises);
    return results;
  }
} 