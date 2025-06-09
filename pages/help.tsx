import React from 'react';
import { Card, Tabs, Collapse, Typography, Space, Divider, Row, Col } from 'antd';
import { MailOutlined, WechatOutlined, PhoneOutlined, QuestionCircleOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TabPane } = Tabs;

// FAQ 数据
const faqData = [
  {
    key: '1',
    question: '如何开始使用 FinCoach Plus？',
    answer: '注册账号后，您可以通过以下步骤开始使用：\n1. 完善个人资料\n2. 设置投资偏好\n3. 添加关注的股票\n4. 开始接收个性化提醒'
  },
  {
    key: '2',
    question: '如何设置投资提醒？',
    answer: '在"提醒设置"页面，您可以：\n1. 选择提醒类型（邮件/短信/应用内通知）\n2. 设置提醒时间\n3. 自定义提醒内容\n4. 管理提醒规则'
  },
  {
    key: '3',
    question: '如何修改账户信息？',
    answer: '您可以在"个人中心"页面修改：\n1. 基本信息（昵称、头像等）\n2. 联系方式\n3. 密码\n4. 通知偏好'
  },
  {
    key: '4',
    question: '如何导出投资数据？',
    answer: '在"数据管理"页面，您可以：\n1. 选择导出时间范围\n2. 选择导出格式（CSV/Excel）\n3. 选择导出内容\n4. 下载数据文件'
  },
  {
    key: '5',
    question: '如何联系客服？',
    answer: '您可以通过以下方式联系客服：\n1. 在线客服（工作时间内）\n2. 发送邮件\n3. 拨打客服电话\n4. 微信客服'
  }
];

// 联系方式数据
const contactData = [
  {
    icon: <MailOutlined />,
    title: '客服邮箱',
    content: 'support@fincoach.com'
  },
  {
    icon: <WechatOutlined />,
    title: '微信客服',
    content: 'FinCoach_Support'
  },
  {
    icon: <PhoneOutlined />,
    title: '客服电话',
    content: '400-888-8888'
  }
];

const HelpPage: React.FC = () => {
  return (
    <div style={{ maxWidth: 1200, margin: '24px auto', padding: '0 24px' }}>
      <Title level={2}>帮助中心</Title>
      
      <Tabs defaultActiveKey="faq">
        <TabPane tab="常见问题" key="faq">
          <Card>
            <Collapse defaultActiveKey={['1']}>
              {faqData.map(item => (
                <Panel 
                  header={
                    <Space>
                      <QuestionCircleOutlined />
                      <Text strong>{item.question}</Text>
                    </Space>
                  } 
                  key={item.key}
                >
                  <Paragraph style={{ whiteSpace: 'pre-line' }}>
                    {item.answer}
                  </Paragraph>
                </Panel>
              ))}
            </Collapse>
          </Card>
        </TabPane>

        <TabPane tab="联系我们" key="contact">
          <Card>
            <Row gutter={[24, 24]}>
              {contactData.map((item, index) => (
                <Col xs={24} sm={8} key={index}>
                  <Card>
                    <Space direction="vertical" align="center" style={{ width: '100%' }}>
                      <div style={{ fontSize: 24 }}>{item.icon}</div>
                      <Title level={4}>{item.title}</Title>
                      <Text>{item.content}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </TabPane>

        <TabPane tab="功能介绍" key="features">
          <Card>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <Title level={4}>智能投资助手</Title>
                <Paragraph>
                  FinCoach Plus 提供智能投资助手功能，帮助您：
                </Paragraph>
                <ul>
                  <li>实时监控市场动态</li>
                  <li>智能分析投资机会</li>
                  <li>个性化投资建议</li>
                  <li>风险预警提醒</li>
                </ul>
              </div>

              <Divider />

              <div>
                <Title level={4}>功能介绍视频</Title>
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                  <iframe
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                    src="https://www.youtube.com/embed/your-video-id"
                    title="功能介绍"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            </Space>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default HelpPage; 