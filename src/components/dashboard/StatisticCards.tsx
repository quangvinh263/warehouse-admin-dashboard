import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { ArrowUpOutlined, ShoppingCartOutlined, InboxOutlined, SyncOutlined } from '@ant-design/icons';

export const StatisticCards: React.FC = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={8}>
        <Card variant = 'borderless' className="shadow-card" style={{ borderRadius: 12 }}>
          <Statistic
            title={<span style={{ fontSize: 16 }}>Tổng đơn hàng hôm nay</span>}
            value={142}
            precision={0}
            styles={{ content: { color: '#3f8600', fontWeight: 'bold' } }}
            prefix={<ShoppingCartOutlined style={{ marginRight: 8 }} />}
            suffix={<span style={{ fontSize: 14, marginLeft: 8 }}><ArrowUpOutlined /> 12%</span>}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card variant = 'borderless' className="shadow-card" style={{ borderRadius: 12 }}>
          <Statistic
            title={<span style={{ fontSize: 16 }}>Tổng số lượng tồn kho</span>}
            value={8800}
            precision={0}
            styles={{ content: { color: '#1677ff', fontWeight: 'bold' } }}
            prefix={<InboxOutlined style={{ marginRight: 8 }} />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card variant = 'borderless' className="shadow-card" style={{ borderRadius: 12 }}>
          <Statistic
            title={<span style={{ fontSize: 16 }}>Số đơn đang chờ xử lý</span>}
            value={15}
            precision={0}
            styles={{ content: { color: '#faad14', fontWeight: 'bold' } }}
            prefix={<SyncOutlined spin style={{ marginRight: 8 }} />}
          />
        </Card>
      </Col>
    </Row>
  );
};
