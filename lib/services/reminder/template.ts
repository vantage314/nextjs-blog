import { ReminderTemplate, ReminderValidationResult } from '@/types/reminder';
import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { reminderTemplates } from '@/lib/db/schema';
import { nanoid } from 'nanoid';

export class ReminderTemplateService {
  private validateTemplate(template: Partial<ReminderTemplate>): ReminderValidationResult {
    const errors: { field: string; message: string }[] = [];
    const warnings: { field: string; message: string }[] = [];

    if (!template.name) {
      errors.push({ field: 'name', message: '模板名称不能为空' });
    }

    if (!template.type) {
      errors.push({ field: 'type', message: '提醒类型不能为空' });
    }

    if (!template.content) {
      errors.push({ field: 'content', message: '模板内容不能为空' });
    }

    // 验证变量格式
    const variableRegex = /\{\{([^}]+)\}\}/g;
    const contentVariables = Array.from(template.content?.matchAll(variableRegex) || [])
      .map(match => match[1]);

    if (template.variables) {
      const missingVariables = template.variables.filter(
        v => !contentVariables.includes(v)
      );
      if (missingVariables.length > 0) {
        warnings.push({
          field: 'variables',
          message: `以下变量在内容中未使用: ${missingVariables.join(', ')}`
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async createTemplate(template: Omit<ReminderTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<ReminderTemplate> {
    const validation = this.validateTemplate(template);
    if (!validation.isValid) {
      throw new Error(`模板验证失败: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const now = new Date();
    const newTemplate: ReminderTemplate = {
      id: nanoid(),
      ...template,
      createdAt: now,
      updatedAt: now
    };

    await db.insert(reminderTemplates).values(newTemplate);
    return newTemplate;
  }

  async updateTemplate(id: string, template: Partial<ReminderTemplate>): Promise<ReminderTemplate> {
    const validation = this.validateTemplate(template);
    if (!validation.isValid) {
      throw new Error(`模板验证失败: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    const existingTemplate = await this.getTemplateById(id);
    if (!existingTemplate) {
      throw new Error('模板不存在');
    }

    const updatedTemplate = {
      ...existingTemplate,
      ...template,
      updatedAt: new Date()
    };

    await db.update(reminderTemplates)
      .set(updatedTemplate)
      .where(eq(reminderTemplates.id, id));

    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<void> {
    const existingTemplate = await this.getTemplateById(id);
    if (!existingTemplate) {
      throw new Error('模板不存在');
    }

    await db.delete(reminderTemplates)
      .where(eq(reminderTemplates.id, id));
  }

  async getTemplateById(id: string): Promise<ReminderTemplate | null> {
    const result = await db.select()
      .from(reminderTemplates)
      .where(eq(reminderTemplates.id, id))
      .limit(1);

    return result[0] || null;
  }

  async getTemplatesByType(type: ReminderTemplate['type']): Promise<ReminderTemplate[]> {
    return db.select()
      .from(reminderTemplates)
      .where(eq(reminderTemplates.type, type));
  }

  async getAllTemplates(): Promise<ReminderTemplate[]> {
    return db.select().from(reminderTemplates);
  }

  async renderTemplate(template: ReminderTemplate, variables: Record<string, string>): Promise<string> {
    let content = template.content;
    
    // 替换变量
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
      content = content.replace(regex, value);
    }

    // 检查是否还有未替换的变量
    const remainingVariables = content.match(/\{\{([^}]+)\}\}/g);
    if (remainingVariables) {
      throw new Error(`模板渲染失败: 以下变量未提供值: ${remainingVariables.join(', ')}`);
    }

    return content;
  }
} 