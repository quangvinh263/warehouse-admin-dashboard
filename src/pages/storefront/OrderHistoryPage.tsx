import React, { useState, useEffect } from 'react';
import { Card, Typography, List, Tag, Spin, message, Button, Collapse } from 'antd';
import { ShoppingOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { StoreLayout } from '../../components/store/StoreLayout';
import { orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { Panel } = Collapse;

export const OrderHistoryPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getOrderHistoryByAccount();
      // axiosClient interceptor returns response.data.data
      setOrders(res || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Pending': return <Tag color="processing">Đang xử lý</Tag>;
      case 'Confirmed': return <Tag color="blue">Đã xác nhận</Tag>;
      case 'Shipped': return <Tag color="purple">Đang giao hàng</Tag>;
      case 'Delivered': return <Tag color="success">Đã giao</Tag>;
      case 'Cancelled': return <Tag color="error">Đã hủy</Tag>;
      default: return <Tag color="default">{status}</Tag>;
    }
  };

  return (
    <StoreLayout>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <Title level={2}>Lịch sử Đơn hàng</Title>
        <Card variant="borderless" className="shadow-card" style={{ borderRadius: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin size="large" /></div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <ShoppingOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
              <p>Bạn chưa có đơn hàng nào.</p>
              <Button type="primary" onClick={() => navigate('/shop')}>Tiếp tục mua sắm</Button>
            </div>
          ) : (
            <Collapse defaultActiveKey={['0']}>
              {orders.map((order, index) => (
                <Panel 
                  header={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <Text strong style={{ marginRight: 16 }}>Mã ĐH: {order.id.substring(0, 8).toUpperCase()}</Text>
                        <span style={{ color: '#8c8c8c' }}><ClockCircleOutlined /> {new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Text strong style={{ color: '#cf1322', marginRight: 16 }}>{order.totalAmount.toLocaleString('vi-VN')} ₫</Text>
                        {getStatusTag(order.status)}
                      </div>
                    </div>
                  } 
                  key={index.toString()}
                >
                  <List
                    itemLayout="horizontal"
                    dataSource={order.orderItems || []}
                    renderItem={(item: any) => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.productName}
                          description={`Số lượng: ${item.quantity}`}
                        />
                        <div style={{ fontWeight: 'bold' }}>{item.unitPrice.toLocaleString('vi-VN')} ₫</div>
                      </List.Item>
                    )}
                  />
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between' }}>
                    <Text type="secondary">Phương thức thanh toán: {order.paymentMethod || 'ZaloPay'}</Text>
                    {order.status === 'Pending' && (
                      <Button danger type="primary" size="small" onClick={() => {/* Handle Cancel */}}>
                        Hủy đơn hàng
                      </Button>
                    )}
                  </div>
                  {(order.receiverName || order.shippingAddress) && (
                    <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                      <Text strong>Thông tin giao hàng:</Text>
                      <div><Text>{order.receiverName} - {order.receiverPhone}</Text></div>
                      <div><Text type="secondary">{order.shippingAddress}</Text></div>
                    </div>
                  )}
                </Panel>
              ))}
            </Collapse>
          )}
        </Card>
      </div>
    </StoreLayout>
  );
};
