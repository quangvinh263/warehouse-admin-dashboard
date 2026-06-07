import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AdminLayout } from './components/layout/AdminLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { DashboardPage } from './pages/DashboardPage';
import { CatalogPage } from './pages/CatalogPage';
import { WarehousePage } from './pages/WarehousePage';
import { OrderPage } from './pages/OrderPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { OtpPage } from './pages/auth/OtpPage';

const App: React.FC = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 8,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          colorBgContainer: '#ffffff',
        },
        components: {
          Card: {
            boxShadowTertiary: '0 4px 12px rgba(0,0,0,0.05)',
          }
        }
      }}
    >
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="/otp" element={<AuthLayout><OtpPage /></AuthLayout>} />

        {/* Dashboard / Admin Routes */}
        <Route path="/" element={<AdminLayout><DashboardPage /></AdminLayout>} />
        <Route path="/catalog" element={<AdminLayout><CatalogPage /></AdminLayout>} />
        <Route path="/warehouse" element={<AdminLayout><WarehousePage /></AdminLayout>} />
        <Route path="/order" element={<AdminLayout><OrderPage /></AdminLayout>} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;