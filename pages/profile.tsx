import React, { useState } from 'react';
import { Card, Form, Input, Button, Upload, message, Progress } from 'antd';
import { UserOutlined, UploadOutlined } from '@ant-design/icons';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { ErrorAlert } from '@/components/common/ErrorAlert';
import type { UploadProps } from 'antd';
import type { RcFile } from 'antd/es/upload';

const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useSettingsStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      await updateProfile(values);
      message.success('个人资料更新成功');
    } catch (error) {
      setError('更新失败，请重试');
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file: RcFile) => {
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isImage) {
      message.error('只能上传 JPG/PNG 格式的图片！');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
      return false;
    }
    return true;
  };

  const uploadProps: UploadProps = {
    name: 'avatar',
    showUploadList: false,
    beforeUpload,
    customRequest: ({ file, onSuccess, onError }) => {
      // 模拟上传进度
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          // 这里应该调用上传 API，这里仅作演示
          const url = URL.createObjectURL(file as Blob);
          updateProfile({ avatar: url });
          onSuccess?.('ok');
          message.success('头像上传成功');
        }
      }, 200);
    },
    onChange: (info) => {
      if (info.file.status === 'error') {
        setError('头像上传失败，请重试');
        setUploadProgress(0);
      }
    },
  };

  return (
    <div style={{ maxWidth: 600, margin: '24px auto', padding: '0 24px' }}>
      <Card title="个人资料">
        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setError(null)}
          />
        )}
        <Form
          form={form}
          layout="vertical"
          initialValues={profile}
          onFinish={handleSubmit}
        >
          <Form.Item label="头像">
            <Upload {...uploadProps}>
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt="avatar"
                    style={{ width: 100, height: 100, borderRadius: '50%' }}
                  />
                ) : (
                  <div
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      background: '#f0f0f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserOutlined style={{ fontSize: 40 }} />
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <Button icon={<UploadOutlined />}>更换头像</Button>
                </div>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <Progress percent={uploadProgress} size="small" />
                )}
              </div>
            </Upload>
          </Form.Item>

          <Form.Item
            name="nickname"
            label="昵称"
            rules={[
              { required: true, message: '请输入昵称' },
              { min: 2, max: 20, message: '昵称长度应在 2-20 个字符之间' }
            ]}
          >
            <Input placeholder="请输入昵称" />
          </Form.Item>

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' },
              { pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: '邮箱格式不正确' }
            ]}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              保存修改
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ProfilePage; 