import React from 'react';
import { Layout, Menu } from 'antd';
import {
  HomeOutlined,
  BellOutlined,
  SettingOutlined,
  UserOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/router';

const { Sider } = Layout;

export const Sidebar: React.FC = () => {
  const router = useRouter();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link href="/">首页</Link>,
    },
    {
      key: '/notifications',
      icon: <BellOutlined />,
      label: <Link href="/notifications">通知中心</Link>,
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: <Link href="/profile">个人资料</Link>,
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: <Link href="/settings">系统设置</Link>,
    },
    {
      key: '/help',
      icon: <QuestionCircleOutlined />,
      label: <Link href="/help">帮助中心</Link>,
    },
  ];

  return (
    <Sider
      width={200}
      style={{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <div style={{ height: 64, padding: '16px', textAlign: 'center' }}>
        <img src="/logo.png" alt="FinCoach Plus" style={{ height: 32 }} />
      </div>
      <Menu
        mode="inline"
        selectedKeys={[router.pathname]}
        items={menuItems}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
}; 