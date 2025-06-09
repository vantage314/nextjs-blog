import React, { useState } from 'react';
import { Card, Form, Select, Switch, Button, message, Space, Divider } from 'antd';
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useTheme } from '@/hooks/useTheme';
import { ErrorAlert } from '@/components/common/ErrorAlert';

const { Option } = Select;

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetSettings } = useSettingsStore();
  const { setTheme } = useTheme();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      setError(null);
      await updateSettings(values);
      setTheme(values.theme);
      message.success('设置已保存');
    } catch (error) {
      setError('保存失败，请重试');
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      setError(null);
      form.resetFields();
      await resetSettings();
      setTheme(settings.theme);
      message.success('已恢复默认设置');
    } catch (error) {
      setError('重置失败，请重试');
      message.error('重置失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '24px auto', padding: '0 24px' }}>
      <Card title="系统设置">
        {error && (
          <ErrorAlert
            message={error}
            onClose={() => setError(null)}
          />
        )}
        <Form
          form={form}
          layout="vertical"
          initialValues={settings}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="language"
            label="界面语言"
            rules={[{ required: true, message: '请选择语言' }]}
          >
            <Select>
              <Option value="zh_CN">简体中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="theme"
            label="主题设置"
            rules={[{ required: true, message: '请选择主题' }]}
          >
            <Select>
              <Option value="light">浅色主题</Option>
              <Option value="dark">深色主题</Option>
            </Select>
          </Form.Item>

          <Divider orientation="left">通知设置</Divider>

          <Form.Item
            name={['notifications', 'enabled']}
            label="启用通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={['notifications', 'sound']}
            label="通知声音"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name={['notifications', 'email']}
            label="邮件通知"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存设置
              </Button>
              <Button onClick={handleReset} loading={loading}>
                恢复默认
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsPage; 