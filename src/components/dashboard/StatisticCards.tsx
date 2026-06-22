import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { ShoppingCartOutlined, InboxOutlined, SyncOutlined, DollarOutlined } from '@ant-design/icons';

interface StatisticCardsProps {
  todayOrdersCount: number;
  todayRevenue: number;
  totalInventory: number;
  pendingOrdersCount: number;
}

export const StatisticCards: React.FC<StatisticCardsProps> = ({
  todayOrdersCount,
  todayRevenue,
  totalInventory,
  pendingOrdersCount
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  return (
    <Row gutter={[24, 24]}>
      {/* Doanh thu hôm nay */}
      <Col xs={24} sm={12} lg={6}>
        <Card 
          variant='borderless' 
          className="premium-stat-card" 
          style={{ '--accent-color': '#10b981' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <Statistic
                title={<span style={{ fontSize: 14, color: '#8c8c8c', fontWeight: 500 }}>Doanh thu hôm nay</span>}
                value={todayRevenue}
                formatter={(val) => <span style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{formatCurrency(Number(val))}</span>}
              />
            </div>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
              <DollarOutlined />
            </div>
          </div>
        </Card>
      </Col>

      {/* Tổng đơn hàng hôm nay */}
      <Col xs={24} sm={12} lg={6}>
        <Card 
          variant='borderless' 
          className="premium-stat-card" 
          style={{ '--accent-color': '#3b82f6' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <Statistic
                title={<span style={{ fontSize: 14, color: '#8c8c8c', fontWeight: 500 }}>Đơn hàng mới hôm nay</span>}
                value={todayOrdersCount}
                formatter={(val) => <span style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{formatNumber(Number(val))} đơn</span>}
              />
            </div>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
              <ShoppingCartOutlined />
            </div>
          </div>
        </Card>
      </Col>

      {/* Tổng tồn kho */}
      <Col xs={24} sm={12} lg={6}>
        <Card 
          variant='borderless' 
          className="premium-stat-card" 
          style={{ '--accent-color': '#8b5cf6' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <Statistic
                title={<span style={{ fontSize: 14, color: '#8c8c8c', fontWeight: 500 }}>Tổng số lượng tồn kho</span>}
                value={totalInventory}
                formatter={(val) => <span style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{formatNumber(Number(val))} cái</span>}
              />
            </div>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
              <InboxOutlined />
            </div>
          </div>
        </Card>
      </Col>

      {/* Đơn hàng chờ xử lý */}
      <Col xs={24} sm={12} lg={6}>
        <Card 
          variant='borderless' 
          className="premium-stat-card" 
          style={{ '--accent-color': '#f59e0b' } as React.CSSProperties}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ flex: 1 }}>
              <Statistic
                title={<span style={{ fontSize: 14, color: '#8c8c8c', fontWeight: 500 }}>Đơn hàng chờ xử lý</span>}
                value={pendingOrdersCount}
                formatter={(val) => <span style={{ fontSize: 22, fontWeight: 700, color: '#1f2937' }}>{formatNumber(Number(val))} đơn</span>}
              />
            </div>
            <div className="stat-icon-wrapper" style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
              <SyncOutlined spin={pendingOrdersCount > 0} />
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

