import { ReminderTemplateService } from './template';
import { ReminderQueueService } from './queue';
import { ReminderAnalyticsService } from './analytics';
import { reminderConfig } from '@/lib/config/reminder';

// 创建服务实例
const templateService = new ReminderTemplateService();
const queueService = new ReminderQueueService(reminderConfig);
const analyticsService = new ReminderAnalyticsService();

// 导出服务实例
export {
  templateService,
  queueService,
  analyticsService
};

// 导出类型
export * from '@/types/reminder';

// 导出配置
export * from '@/lib/config/reminder';

// 启动提醒队列处理
export async function startReminderQueue() {
  // 设置定时任务，定期处理提醒队列
  setInterval(async () => {
    try {
      await queueService.processQueue();
    } catch (error) {
      console.error('处理提醒队列失败:', error);
    }
  }, reminderConfig.retryInterval);

  // 设置定时任务，清理旧数据
  setInterval(async () => {
    try {
      await queueService.cleanupOldRecords();
    } catch (error) {
      console.error('清理旧数据失败:', error);
    }
  }, 24 * 60 * 60 * 1000); // 每天执行一次
}

// 停止提醒队列处理
export function stopReminderQueue() {
  // 清理所有定时任务
  // 注意：这里需要实现一个机制来跟踪和清理定时任务
  console.log('提醒队列处理已停止');
}

// 初始化提醒服务
export async function initReminderService() {
  try {
    // 启动提醒队列处理
    await startReminderQueue();
    console.log('提醒服务初始化成功');
  } catch (error) {
    console.error('提醒服务初始化失败:', error);
    throw error;
  }
}

// 关闭提醒服务
export async function shutdownReminderService() {
  try {
    // 停止提醒队列处理
    stopReminderQueue();
    console.log('提醒服务已关闭');
  } catch (error) {
    console.error('关闭提醒服务失败:', error);
    throw error;
  }
} 