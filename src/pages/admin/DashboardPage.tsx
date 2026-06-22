import React, { useState, useEffect } from 'react';
import { Col, Row, Typography, Spin, message, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { InventoryItem, Order, Warehouse } from '../../types';
import { StatisticCards } from '../../components/dashboard/StatisticCards';
import { OrderChart } from '../../components/dashboard/OrderChart';
import { LowStockTable } from '../../components/dashboard/LowStockTable';
import { orderService } from '../../services/orderService';
import { warehouseService } from '../../services/warehouseService';

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersData, warehousesData] = await Promise.all([
        orderService.getOrders(),
        warehouseService.getWarehouses()
      ]);
      setOrders(ordersData || []);
      setWarehouses(warehousesData || []);
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi tải dữ liệu thống kê Dashboard!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 1. Thống kê hôm nay
  const today = new Date();
  const todayStr = today.getFullYear() + '-' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(today.getDate()).padStart(2, '0'); // YYYY-MM-DD in local time

  const todayOrders = orders.filter(o => {
    if (!o.createdAt) return false;
    // Cắt chuỗi ISO "YYYY-MM-DDThh:mm:ss" thành "YYYY-MM-DD"
    return o.createdAt.split('T')[0] === todayStr;
  });

  const todayOrdersCount = todayOrders.length;

  const todayRevenue = todayOrders
    .filter(o => o.status !== 'CANCELED' && o.status !== 'PENDING') // Chỉ tính đơn thành công hoặc đã xác nhận
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // 2. Tổng số lượng tồn kho
  let totalInventory = 0;
  warehouses.forEach((w: any) => {
    if (w.inventories) {
      w.inventories.forEach((inv: any) => {
        totalInventory += (inv.quantity || 0);
      });
    }
  });

  // 3. Số đơn hàng chờ xử lý
  const pendingOrdersCount = orders.filter(o => o.status === 'PENDING').length;

  // 4. Danh sách cảnh báo hết hàng (Low Stock Items)
  const lowStockItems: InventoryItem[] = [];
  warehouses.forEach((w: any) => {
    if (w.inventories) {
      w.inventories.forEach((inv: any) => {
        if (inv.quantity < 15) {
          lowStockItems.push({
            id: inv.id || `${w.id}-${inv.productId}`,
            productId: inv.productId,
            productName: inv.productName || inv.productId,
            warehouseId: w.id,
            warehouseName: w.name,
            quantity: inv.quantity
          });
        }
      });
    }
  });

  // 5. Thống kê 7 ngày qua cho biểu đồ
  const chartData: any[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = d.getFullYear() + '-' + 
                    String(d.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(d.getDate()).padStart(2, '0');
    const dateLabel = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

    const dayOrders = orders.filter(o => o.createdAt && o.createdAt.split('T')[0] === dateStr);
    const dayRevenue = dayOrders
      .filter(o => o.status !== 'CANCELED')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    chartData.push({
      name: dateLabel,
      orders: dayOrders.length,
      revenue: dayRevenue
    });
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <Spin size="large" tip="Đang tải dữ liệu tổng quan..." />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 24px' }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Tổng quan (Dashboard)</Title>
        <Button 
          type="default" 
          icon={<ReloadOutlined />} 
          onClick={fetchData}
        >
          Làm mới
        </Button>
      </div>

      <StatisticCards 
        todayOrdersCount={todayOrdersCount}
        todayRevenue={todayRevenue}
        totalInventory={totalInventory}
        pendingOrdersCount={pendingOrdersCount}
      />

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <OrderChart data={chartData} />
        </Col>
        
        <Col xs={24} lg={8}>
          <LowStockTable data={lowStockItems} />
        </Col>
      </Row>
    </div>
  );
};

