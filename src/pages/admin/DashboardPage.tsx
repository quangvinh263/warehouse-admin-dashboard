import React from 'react';
import { Col, Row, Typography } from 'antd';
import type { InventoryItem } from '../../types';
import { StatisticCards } from '../../components/dashboard/StatisticCards';
import { OrderChart } from '../../components/dashboard/OrderChart';
import { LowStockTable } from '../../components/dashboard/LowStockTable';

const { Title } = Typography;

export const DashboardPage: React.FC = () => {
  const chartData: any[] = []; // FIXME: Fetch from API
  const lowStockItems: InventoryItem[] = []; // FIXME: Fetch from API

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Tổng quan (Dashboard)</Title>
      </div>

      <StatisticCards />

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
