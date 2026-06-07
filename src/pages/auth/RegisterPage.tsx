import React from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Register values:', values);
    // Mock register success -> go to OTP page
    navigate('/otp');
  };

  return (
    <Card 
      className="shadow-card" 
      style={{ 
        width: 450, 
        borderRadius: 16, 
        padding: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
      bordered={false}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: '#1677ff' }}>Tạo tài khoản</Title>
        <Text type="secondary">Điền thông tin để tham gia hệ thống</Text>
      </div>

      <Form
        name="register"
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: 'Vui lòng nhập Username!' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Username" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập Email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="Email" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          name="phone"
          rules={[{ required: true, message: 'Vui lòng nhập Số điện thoại!' }]}
        >
          <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại Mật khẩu!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Mật khẩu nhập lại không khớp!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại Mật khẩu" style={{ borderRadius: 8 }} />
        </Form.Item>

        <div style={{ marginBottom: 24, textAlign: 'center' }}>
          <Text type="secondary">Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link></Text>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block icon={<RightOutlined />} style={{ borderRadius: 8 }}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
