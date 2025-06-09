import nodemailer from 'nodemailer';
import { ReminderTemplate } from '@/types/reminder';
import { reminderTypeConfig } from '@/lib/config/reminder';

export class EmailSender {
  private transporter: nodemailer.Transporter;
  private config = reminderTypeConfig.email;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async send(
    userId: string,
    template: ReminderTemplate,
    variables: Record<string, string>
  ): Promise<void> {
    try {
      // 验证内容长度
      if (template.content.length > this.config.maxLength) {
        throw new Error(`邮件内容超过最大长度限制: ${this.config.maxLength}`);
      }

      // 获取用户邮箱
      const userEmail = await this.getUserEmail(userId);
      if (!userEmail) {
        throw new Error(`用户 ${userId} 未设置邮箱`);
      }

      // 准备邮件内容
      const { subject, content } = this.prepareEmailContent(template, variables);

      // 发送邮件
      await this.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: userEmail,
        subject,
        html: content
      });
    } catch (error) {
      console.error('发送邮件失败:', error);
      throw error;
    }
  }

  private async getUserEmail(userId: string): Promise<string | null> {
    // TODO: 从用户服务获取邮箱
    return 'user@example.com';
  }

  private prepareEmailContent(
    template: ReminderTemplate,
    variables: Record<string, string>
  ): { subject: string; content: string } {
    // 从内容中提取主题
    const subjectMatch = template.content.match(/^# (.*?)$/m);
    const subject = subjectMatch ? subjectMatch[1] : '提醒通知';

    // 验证主题长度
    if (subject.length > this.config.subjectMaxLength) {
      throw new Error(`邮件主题超过最大长度限制: ${this.config.subjectMaxLength}`);
    }

    // 处理内容
    let content = template.content;
    if (subjectMatch) {
      content = content.replace(/^# .*?$/m, '');
    }

    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, value);
    }

    // 添加样式
    content = this.addStyles(content);

    return { subject, content };
  }

  private addStyles(content: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .reminder-content {
              background-color: #f9f9f9;
              border-radius: 5px;
              padding: 20px;
              margin: 20px 0;
            }
            .reminder-footer {
              font-size: 12px;
              color: #666;
              border-top: 1px solid #eee;
              margin-top: 20px;
              padding-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="reminder-content">
            ${content}
          </div>
          <div class="reminder-footer">
            <p>此邮件由系统自动发送，请勿直接回复。</p>
          </div>
        </body>
      </html>
    `;
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('邮件服务连接验证失败:', error);
      return false;
    }
  }
} 