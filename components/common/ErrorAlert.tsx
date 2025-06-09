import React from 'react';
import { Alert, Space } from 'antd';
import { CloseCircleOutlined } from '@ant-design/icons';

interface ErrorAlertProps {
  message: string;
  description?: string;
  onClose?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({
  message,
  description,
  onClose,
}) => {
  return (
    <Alert
      message={
        <Space>
          <CloseCircleOutlined />
          {message}
        </Space>
      }
      description={description}
      type="error"
      showIcon
      closable
      onClose={onClose}
      style={{ marginBottom: 16 }}
    />
  );
}; 