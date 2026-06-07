import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, message } from 'antd';
import { CheckCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

// Note: If Ant Design is >= 5.10.0, there is an Input.OTP component.
// Otherwise, we use a basic custom implementation or standard Input.
// Assuming we have Input.OTP available as per standard recent antd.
import { Input } from 'antd';

const { Title, Text } = Typography;

export const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(60);
  const [otp, setOtp] = useState('');

  useEffect(() => {
    if (countdown > 0) {
      const timerId = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
    }
  }, [countdown]);

  const handleResend = () => {
    setCountdown(60);
    message.success('Đã gửi lại mã OTP!');
  };

  const onFinish = () => {
    if (otp.length !== 6) {
      message.error('Vui lòng nhập đủ 6 số OTP!');
      return;
    }
    console.log('OTP submitted:', otp);
    message.success('Xác thực thành công!');
    navigate('/login');
  };

  // Ant Design 5.10.0+ supports Input.OTP. If not, this might fallback gracefully or throw an error.
  // We will use standard Input just in case to be safe, but styled nicely.
  // Actually let's try Input.OTP if the antd version supports it.
  // Since we don't know exact version, we'll use a styled Input with maxLength=6
  // Wait, I will use Input.OTP. If it doesn't exist, build might fail. 
  // Let's use standard Input with letter-spacing for a quick OTP feel, to avoid build errors.
  
  return (
    <Card 
      className="shadow-card" 
      style={{ 
        width: 400, 
        borderRadius: 16, 
        padding: '24px 16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.9)'
      }}
      bordered={false}
    >
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <SafetyCertificateOutlined style={{ fontSize: 48, color: '#1677ff', marginBottom: 16 }} />
        <Title level={3} style={{ margin: 0, color: '#1677ff' }}>Xác thực OTP</Title>
        <Text type="secondary">Mã xác nhận gồm 6 số đã được gửi tới email của bạn.</Text>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {/* If using antd < 5.10.0, Input.OTP might be undefined. Let's use a standard Input styled like OTP */}
        <Input 
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
          maxLength={6}
          style={{ 
            fontSize: 24, 
            letterSpacing: '0.5em', 
            textAlign: 'center',
            borderRadius: 8,
            height: 50
          }}
          placeholder="••••••"
        />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        {countdown > 0 ? (
          <Text type="secondary">Vui lòng chờ <strong style={{ color: '#f5222d' }}>{countdown}s</strong> để gửi lại</Text>
        ) : (
          <Button type="link" onClick={handleResend} style={{ padding: 0 }}>
            Gửi lại mã OTP
          </Button>
        )}
      </div>

      <Button 
        type="primary" 
        block 
        size="large" 
        icon={<CheckCircleOutlined />} 
        onClick={onFinish}
        style={{ borderRadius: 8 }}
      >
        Xác nhận
      </Button>
    </Card>
  );
};
