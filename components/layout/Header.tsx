import React from 'react';
import { Layout, Space } from 'antd';
import { NotificationIcon } from '../NotificationIcon';

const { Header: AntHeader } = Layout;

export const Header: React.FC = () => {
  return (
    <AntHeader style={{ 
      background: '#fff', 
      padding: '0 24px',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      boxShadow: '0 1px 4px rgba(0,21,41,.08)'
    }}>
      <Space size={24}>
        <NotificationIcon />
      </Space>
    </AntHeader>
  );
}; 