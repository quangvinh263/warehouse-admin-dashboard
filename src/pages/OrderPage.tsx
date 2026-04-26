import React, { useState } from 'react';
import { Typography, Card } from 'antd';
import { mockOrders } from '../utils/mockData';
import type { Order } from '../utils/mockData';
import { OrderTable } from '../components/order/OrderTable';
import { OrderDetailsDrawer } from '../components/order/OrderDetailsDrawer';

const { Title } = Typography;

export const OrderPage: React.FC = () => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDrawerVisible(true);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Đơn hàng & Điều phối (Order & Routing)</Title>
      </div>

      <Card variant='borderless' className="shadow-card" style={{ borderRadius: 12 }}>
        <OrderTable orders={mockOrders} onViewDetails={handleViewDetails} />
      </Card>

      <OrderDetailsDrawer 
        isVisible={isDrawerVisible} 
        selectedOrder={selectedOrder} 
        onClose={() => setIsDrawerVisible(false)} 
      />
    </div>
  );
};