import { useNotificationStore } from '@/lib/store/notificationStore';

const mockTitles = [
  '系统更新提醒',
  '投资组合变动',
  '市场行情提醒',
  '账户安全提醒',
  '新功能上线通知'
];

const mockMessages = [
  '您的投资组合已更新，点击查看详情。',
  '市场出现重要变动，建议及时关注。',
  '系统将于今晚进行维护升级。',
  '检测到异常登录，请及时确认。',
  '新功能已上线，快来体验吧！'
];

export const startNotificationMock = () => {
  const addNotification = useNotificationStore.getState().addNotification;
  
  const generateMockNotification = () => {
    const randomIndex = Math.floor(Math.random() * mockTitles.length);
    addNotification({
      title: mockTitles[randomIndex],
      message: mockMessages[randomIndex],
    });
  };

  // 每30秒生成一条测试通知
  const interval = setInterval(generateMockNotification, 30000);
  
  // 立即生成一条通知
  generateMockNotification();
  
  // 返回清理函数
  return () => clearInterval(interval);
}; 