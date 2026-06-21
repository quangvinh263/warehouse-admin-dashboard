import React, { useState, useEffect } from 'react';
import { Typography, Card, message } from 'antd';
import { OrderTable } from '../../components/order/OrderTable';
import { OrderDetailsDrawer } from '../../components/order/OrderDetailsDrawer';
import { orderService } from '../../services/orderService';

const { Title } = Typography;

export const OrderPage: React.FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrders();
      setOrders(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách Đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDrawerVisible(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Đơn hàng & Điều phối (Order & Routing)</Title>
      </div>

      <Card variant='borderless' className="shadow-card" style={{ borderRadius: 12 }} loading={loading}>
        <OrderTable orders={orders} onViewDetails={handleViewDetails} />
      </Card>

      <OrderDetailsDrawer 
        isVisible={isDrawerVisible} 
        selectedOrder={selectedOrder} 
        onClose={() => setIsDrawerVisible(false)} 
        onUpdate={fetchOrders}
      />
    </div>
  );
};
