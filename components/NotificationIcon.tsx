import React from 'react';
import { Badge, Popover, Button, List, Typography, Space } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNotificationStore } from '@/lib/store/notificationStore';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Text } = Typography;

export const NotificationIcon: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const content = (
    <div style={{ width: 300, maxHeight: 400, overflow: 'auto' }}>
      <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0' }}>
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Text strong>通知中心</Text>
          {unreadCount > 0 && (
            <Button type="link" size="small" onClick={markAllAsRead}>
              全部标为已读
            </Button>
          )}
        </Space>
      </div>
      <List
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item
            style={{
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: item.read ? 'transparent' : '#f5f5f5',
            }}
            onClick={() => markAsRead(item.id)}
          >
            <List.Item.Meta
              title={
                <Space>
                  <Text strong>{item.title}</Text>
                  {!item.read && (
                    <Badge status="processing" size="small" />
                  )}
                </Space>
              }
              description={
                <Space direction="vertical" size={0}>
                  <Text type="secondary">{item.message}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {dayjs(item.timestamp).fromNow()}
                  </Text>
                </Space>
              }
            />
          </List.Item>
        )}
        locale={{ emptyText: '暂无通知' }}
      />
    </div>
  );

  return (
    <Popover
      content={content}
      trigger="click"
      placement="bottomRight"
      overlayStyle={{ padding: 0 }}
    >
      <Badge count={unreadCount} offset={[-2, 2]}>
        <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
      </Badge>
    </Popover>
  );
}; 