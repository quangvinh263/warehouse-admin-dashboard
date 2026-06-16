import React, { useState } from 'react';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const res = await authService.signUp({
        username: values.username,
        fullName: values.username, // mock full name if not provided separately
        email: values.email,
        password: values.password,
        phone: values.phone
      });
      
      if (res.isSuccess) {
        message.success(res.message || 'Đăng ký thành công!');
        // Pass accountId to OTP page
        navigate('/otp', { state: { accountId: res.data } });
      } else {
        message.error(res.message || 'Đăng ký thất bại');
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
        width: 450, 
        borderRadius: 16, 
        padding: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
      variant="borderless"
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
          <Button type="primary" htmlType="submit" block icon={<RightOutlined />} loading={loading} style={{ borderRadius: 8 }}>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};
