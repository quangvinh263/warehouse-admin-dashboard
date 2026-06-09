import React, { useState } from 'react';
import { Layout, Button, Badge, Drawer, List, Typography, Divider, message, Spin } from 'antd';
import { ShoppingCartOutlined, ShopOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { orderService } from '../../services/orderService';

const { Header, Content } = Layout;
const { Text, Title } = Typography;

export const StoreLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { cart, removeFromCart, totalAmount, clearCart } = useCart();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) {
      message.warning("Giỏ hàng đang trống!");
      return;
    }
    
    setIsCheckingOut(true);
    try {
      // Gọi API đặt hàng với ZaloPay mặc định
      await orderService.createOrder({
        paymentMethod: "ZaloPay",
        items: cart
      });
      message.success("Đặt hàng thành công! Đơn hàng đang được xử lý (Saga started).");
      clearCart();
      setDrawerVisible(false);
      // Bạn có thể chuyển hướng sang trang xem tiến độ đơn hàng hoặc trang cảm ơn
    } catch (error) {
      message.error("Lỗi khi đặt hàng!");
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Header style={{ background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={() => navigate('/shop')}>
          <ShopOutlined style={{ fontSize: 28, color: '#1677ff', marginRight: 12 }} />
          <Title level={4} style={{ margin: 0, color: '#1677ff' }}>TechStore</Title>
        </div>
        
        <div>
          <Badge count={cart.length} showZero>
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
          <Button type="text" style={{ marginLeft: 16 }} onClick={() => navigate('/')}>
            Trang Admin
          </Button>
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
        width={400}
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
                description={`Số lượng: ${item.quantity} x $${item.unitPrice}`}
              />
              <div style={{ fontWeight: 'bold' }}>${item.quantity * item.unitPrice}</div>
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
              disabled={isCheckingOut}
            >
              {isCheckingOut ? <Spin size="small" /> : 'Tiến hành Thanh toán (Checkout)'}
            </Button>
          </div>
        )}
      </Drawer>
    </Layout>
  );
};
