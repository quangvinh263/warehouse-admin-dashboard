import React, { useState } from 'react';
import { Layout, Button, Badge, Drawer, List, Typography, message, Dropdown, type MenuProps } from 'antd';
import { ShoppingCartOutlined, ShopOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

import { useAuth } from '../../contexts/AuthContext';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

export const StoreLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, totalAmount } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);


  const handleCheckout = async () => {
    if (!isAuthenticated) {
      message.warning("Vui lòng đăng nhập để tiến hành thanh toán!");
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      message.warning("Giỏ hàng đang trống!");
      return;
    }

    setDrawerVisible(false);
    navigate('/checkout');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Tài khoản của tôi',
      onClick: () => navigate('/account'),
    },
    {
      key: '2',
      label: 'Đơn hàng',
      onClick: () => navigate('/orders'),
    },
    {
      type: 'divider',
    },
    {
      key: '3',
      label: 'Đăng xuất',
      danger: true,
      onClick: () => {
        logout();
        message.success('Đã đăng xuất');
        navigate('/shop');
      },
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/shop')}>
          <ShopOutlined style={{ fontSize: 28, color: '#1677ff', marginRight: 12 }} />
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>TechStore</Title>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Badge count={cart.length} showZero style={{ marginRight: 16 }}>
            <Button
              type="primary"
              shape="round"
              icon={<ShoppingCartOutlined />}
              size="large"
              onClick={() => setDrawerVisible(true)}
            >
              Giỏ hàng
            </Button>
          </Badge>

          {isAuthenticated ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" arrow>
              <Button type="default" shape="circle" icon={<UserOutlined />} size="large" style={{ marginLeft: 16 }} />
            </Dropdown>
          ) : (
            <Button type="default" size="large" onClick={() => navigate('/login')} style={{ marginLeft: 16 }}>
              Đăng nhập
            </Button>
          )}
        </div>
      </Header>

      <Content style={{ padding: '50px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        {children}
      </Content>

      <Drawer
        title="Giỏ hàng của bạn"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        size="default"
      >
        <List
          itemLayout="horizontal"
          dataSource={cart}
          locale={{ emptyText: "Giỏ hàng trống" }}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeFromCart(item.productId)} />
              ]}
            >
              <List.Item.Meta
                title={item.productName}
                description={`Số lượng: ${item.quantity} x $${(item.unitPrice || (item as any).price)}`}
              />
              <div style={{ fontWeight: 'bold' }}>${item.quantity * (item.unitPrice || (item as any).price)}</div>
            </List.Item>
          )}
        />

        {cart.length > 0 && (
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 24, background: '#fff', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Text strong style={{ fontSize: 18 }}>Tổng tiền:</Text>
              <Text strong style={{ fontSize: 18, color: '#cf1322' }}>${totalAmount}</Text>
            </div>
            <Button
              type="primary"
              block
              size="large"
              onClick={handleCheckout}
              disabled={false}
            >
              Tiến hành Thanh toán (Checkout)
            </Button>
          </div>
        )}
      </Drawer>
    </Layout>
  );
};
