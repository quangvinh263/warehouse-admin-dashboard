import React from 'react';
import { Card, Form, Input, Button, Typography } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const onFinish = (values: any) => {
    console.log('Login Success:', values);
    // Mock login success -> go to dashboard
    navigate('/');
  };

  return (
    <Card 
      className="shadow-card" 
      style={{ 
        width: 400, 
        borderRadius: 16, 
        padding: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
      bordered={false}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: '#1677ff' }}>Warehouse App</Title>
        <Text type="secondary">Đăng nhập vào hệ thống quản lý</Text>
      </div>

      <Form
        name="login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập Email!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Email" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" style={{ borderRadius: 8 }} />
        </Form.Item>

        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
          <Link to="/register">Tạo tài khoản mới</Link>
          <a style={{ color: '#8c8c8c' }} href="#">Quên mật khẩu?</a>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block icon={<LoginOutlined />} style={{ borderRadius: 8 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
