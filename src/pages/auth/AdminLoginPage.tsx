import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await authService.signIn(values);
      if (res.isSuccess) {
        message.success('Đăng nhập Admin thành công!');
        login(res.data.accountId, res.data.accessToken, res.data.refreshToken);
        navigate('/'); // Redirect to Admin Dashboard
      } else {
        message.error(res.message || 'Đăng nhập thất bại');
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error('Lỗi kết nối đến máy chủ');
      }
    } finally {
      setLoading(false);
    }
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
        backgroundColor: 'rgba(30, 30, 30, 0.9)', // Darker background for Admin
        color: '#fff'
      }}
      variant="borderless"
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ margin: 0, color: '#ff4d4f' }}>Admin Portal</Title>
        <Text style={{ color: '#ccc' }}>Đăng nhập quyền quản trị</Text>
      </div>

      <Form
        name="admin-login"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        layout="vertical"
        size="large"
      >
        <Form.Item
          name="email"
          rules={[
            { required: true, message: 'Vui lòng nhập Email Admin!' },
            { type: 'email', message: 'Email không hợp lệ!' }
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="Admin Email" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: 'Vui lòng nhập Mật khẩu!' }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu Admin" style={{ borderRadius: 8 }} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" danger htmlType="submit" block icon={<LoginOutlined />} loading={loading} style={{ borderRadius: 8 }}>
            Đăng nhập Quản trị
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
