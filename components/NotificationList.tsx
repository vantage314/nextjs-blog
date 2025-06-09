import React, { useEffect } from 'react';
import { List, Badge, Typography, Space, Tag } from 'antd';
import { FixedSizeList as VirtualList } from 'react-window';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { playNotificationSound } from '@/lib/utils/audio';
import { motion, AnimatePresence } from 'framer-motion';
import { sanitizeHTML } from '@/lib/utils/security';

const { Text } = Typography;

const NotificationList: React.FC = () => {
  const { notifications, markAsRead, settings } = useNotificationStore();
  const listRef = React.useRef<VirtualList>(null);

  // 播放提示音
  useEffect(() => {
    if (notifications.length > 0 && settings.sound) {
      playNotificationSound();
    }
  }, [notifications.length, settings.sound]);

  // 渲染单个通知项
  const renderItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const notification = notifications[index];
    const isUnread = !notification.read;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={style}
      >
        <List.Item
          onClick={() => markAsRead(notification.id)}
          style={{
            padding: '12px 16px',
            cursor: 'pointer',
            backgroundColor: isUnread ? '#f0f7ff' : 'transparent',
            transition: 'background-color 0.3s',
          }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Space>
              <Badge status={isUnread ? 'processing' : 'default'} />
              <Text strong>{notification.title}</Text>
              <Tag color={notification.type === 'system' ? 'blue' : 'green'}>
                {notification.type === 'system' ? '系统' : '投资'}
              </Tag>
            </Space>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {new Date(notification.timestamp).toLocaleString()}
            </Text>
            <div
              dangerouslySetInnerHTML={{
                __html: sanitizeHTML(notification.content),
              }}
            />
          </Space>
        </List.Item>
      </motion.div>
    );
  };

  return (
    <div style={{ height: 400, width: '100%' }}>
      <AnimatePresence>
        <VirtualList
          ref={listRef}
          height={400}
          itemCount={notifications.length}
          itemSize={100}
          width="100%"
        >
          {renderItem}
        </VirtualList>
      </AnimatePresence>
    </div>
  );
};

export default NotificationList; 