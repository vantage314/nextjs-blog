import { ReminderTemplate } from '@/types/reminder';
import { reminderTypeConfig } from '@/lib/config/reminder';
import axios from 'axios';

export class SMSSender {
  private config = reminderTypeConfig.sms;
  private apiKey: string;
  private apiSecret: string;
  private apiEndpoint: string;

  constructor() {
    this.apiKey = process.env.SMS_API_KEY || '';
    this.apiSecret = process.env.SMS_API_SECRET || '';
    this.apiEndpoint = process.env.SMS_API_ENDPOINT || 'https://api.sms.example.com';

    if (!this.apiKey || !this.apiSecret) {
      throw new Error('SMS API 配置缺失');
    }
  }

  async send(
    userId: string,
    template: ReminderTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    try {
      // 验证内容长度
      if (template.content.length > this.config.maxLength) {
        throw new Error(`短信内容超过最大长度限制: ${this.config.maxLength}`);
      }

      // 获取用户手机号
      const phoneNumber = await this.getUserPhoneNumber(userId);
      if (!phoneNumber) {
        throw new Error(`用户 ${userId} 未设置手机号`);
      }

      // 准备短信内容
      const content = this.prepareSMSContent(template, variables);

      // 发送短信
      await this.sendSMS(phoneNumber, content);
    } catch (error) {
      console.error('发送短信失败:', error);
      throw error;
    }
  }

  private async getUserPhoneNumber(userId: string): Promise<string | null> {
    // TODO: 从用户服务获取手机号
    return '13800138000';
  }

  private prepareSMSContent(
    template: ReminderTemplate,
    variables: Record<string, string>
  ): string {
    let content = template.content;

    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, value);
    }

    // 移除多余的空白字符
    content = content.replace(/\s+/g, ' ').trim();

    return content;
  }

  private async sendSMS(phoneNumber: string, content: string): Promise<void> {
    try {
      const response = await axios.post(
        `${this.apiEndpoint}/send`,
        {
          phone: phoneNumber,
          content,
          sign: this.generateSign(phoneNumber, content)
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': this.apiKey
          }
        }
      );

      if (response.data.code !== 0) {
        throw new Error(`短信发送失败: ${response.data.message}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`短信发送失败: ${error.response?.data?.message || error.message}`);
      }
      throw error;
    }
  }

  private generateSign(phoneNumber: string, content: string): string {
    // TODO: 实现签名生成逻辑
    return 'signature';
  }

  async verifyConnection(): Promise<boolean> {
    try {
      const response = await axios.get(
        `${this.apiEndpoint}/status`,
        {
          headers: {
            'X-API-Key': this.apiKey
          }
        }
      );
      return response.data.code === 0;
    } catch (error) {
      console.error('短信服务连接验证失败:', error);
      return false;
    }
  }

  // 获取短信余额
  async getBalance(): Promise<number> {
    try {
      const response = await axios.get(
        `${this.apiEndpoint}/balance`,
        {
          headers: {
            'X-API-Key': this.apiKey
          }
        }
      );

      if (response.data.code !== 0) {
        throw new Error(`获取余额失败: ${response.data.message}`);
      }

      return response.data.data.balance;
    } catch (error) {
      console.error('获取短信余额失败:', error);
      throw error;
    }
  }
} 