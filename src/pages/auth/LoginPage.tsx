import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';
import { ForgotPasswordModal } from './ForgotPasswordModal';

const { Title, Text } = Typography;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [forgotModalVisible, setForgotModalVisible] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await authService.signIn(values);
      if (res.isSuccess) {
        message.success('Đăng nhập thành công!');
        login(res.data.accountId, res.data.accessToken, res.data.refreshToken);
        navigate('/shop');
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
      variant="borderless"
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
          <a onClick={() => setForgotModalVisible(true)} style={{ color: '#1677ff' }}>Quên mật khẩu?</a>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Link to="/admin-login" style={{ color: '#ff4d4f' }}>Đăng nhập Admin</Link>
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit" block icon={<LoginOutlined />} loading={loading} style={{ borderRadius: 8 }}>
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
      
      <ForgotPasswordModal 
        visible={forgotModalVisible} 
        onCancel={() => setForgotModalVisible(false)} 
      />
    </Card>
  );
};
