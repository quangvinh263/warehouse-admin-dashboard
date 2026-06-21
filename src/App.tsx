import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { AdminLayout } from './components/layout/AdminLayout';
import { AuthLayout } from './components/layout/AuthLayout';
import { StoreLayout } from './components/store/StoreLayout';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { DashboardPage } from './pages/admin/DashboardPage';
import { CatalogPage } from './pages/admin/CatalogPage';
import { WarehousePage } from './pages/admin/WarehousePage';
import { OrderPage } from './pages/admin/OrderPage';
import { StorePage } from './pages/storefront/StorePage';
import { AccountPage } from './pages/storefront/AccountPage';
import { OrderHistoryPage } from './pages/storefront/OrderHistoryPage';
import CheckoutPage from './pages/storefront/CheckoutPage';
import { LoginPage } from './pages/auth/LoginPage';
import { AdminLoginPage } from './pages/auth/AdminLoginPage';
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
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
            <Route path="/admin-login" element={<AuthLayout><AdminLoginPage /></AuthLayout>} />
            <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
            <Route path="/otp" element={<AuthLayout><OtpPage /></AuthLayout>} />

            {/* Storefront Routes (User UI) */}
            <Route path="/shop" element={<StoreLayout><StorePage /></StoreLayout>} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/checkout" element={<StoreLayout><CheckoutPage /></StoreLayout>} />

            {/* Dashboard / Admin Routes */}
            <Route path="/" element={<AdminLayout><DashboardPage /></AdminLayout>} />
            <Route path="/catalog" element={<AdminLayout><CatalogPage /></AdminLayout>} />
            <Route path="/warehouse" element={<AdminLayout><WarehousePage /></AdminLayout>} />
            <Route path="/order" element={<AdminLayout><OrderPage /></AdminLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
