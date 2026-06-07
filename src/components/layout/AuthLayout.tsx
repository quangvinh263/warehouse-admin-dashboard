import React from 'react';
import { Layout } from 'antd';

const { Content } = Layout;

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Nền mờ cao cấp */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          zIndex: 0,
        }}
      />
      {/* Hiệu ứng bong bóng / hình tròn mờ (Glassmorphism effect) */}
      <div 
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          background: '#1677ff',
          borderRadius: '50%',
          top: -100,
          left: -100,
          filter: 'blur(100px)',
          opacity: 0.3,
          zIndex: 1,
        }}
      />
      <div 
        style={{
          position: 'absolute',
          width: 500,
          height: 500,
          background: '#722ed1',
          borderRadius: '50%',
          bottom: -150,
          right: -100,
          filter: 'blur(120px)',
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      <Content 
        style={{ 
          position: 'relative', 
          zIndex: 2, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: 24,
        }}
      >
        {children}
      </Content>
    </Layout>
  );
};
