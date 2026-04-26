import React from 'react';
import { Drawer, Typography, Card, Tag, Timeline, Divider, List, Space } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, UndoOutlined, CarOutlined } from '@ant-design/icons';
import type { Order, SagaStep } from '../../utils/mockData';

const { Text } = Typography;

interface OrderDetailsDrawerProps {
  isVisible: boolean;
  selectedOrder: Order | null;
  onClose: () => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ isVisible, selectedOrder, onClose }) => {
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return <Tag color="success">CONFIRMED</Tag>;
      case 'PENDING': return <Tag color="warning">PENDING</Tag>;
      case 'CANCELED': return <Tag color="error">CANCELED</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const getSagaIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'FAILED': return <CloseCircleOutlined style={{ color: '#f5222d' }} />;
      case 'PENDING': return <SyncOutlined spin style={{ color: '#1677ff' }} />;
      case 'COMPENSATED': return <UndoOutlined style={{ color: '#faad14' }} />;
      default: return null;
    }
  };

  return (
    <Drawer
      title={<span style={{ fontSize: 20 }}>Chi tiết Đơn hàng {selectedOrder?.id}</span>}
      placement="right"
      width={700}
      onClose={onClose}
      open={isVisible}
      bodyStyle={{ padding: '0 24px 24px' }}
    >
      {selectedOrder && (
        <div>
          <div style={{ marginBottom: 24, marginTop: 24 }}>
            <Space size="large">
              <Text type="secondary">Khách hàng:</Text>
              <Text strong>{selectedOrder.customerName}</Text>
              <Divider type="vertical" />
              <Text type="secondary">Trạng thái:</Text>
              {getStatusTag(selectedOrder.status)}
              <Divider type="vertical" />
              <Text type="secondary">Tổng tiền:</Text>
              <Text strong className="text-primary" style={{ fontSize: 18 }}>${selectedOrder.totalAmount}</Text>
            </Space>
          </div>

          <Card size="small" title="Danh sách sản phẩm mua" style={{ marginBottom: 24, borderRadius: 8 }}>
            <List
              itemLayout="horizontal"
              dataSource={selectedOrder.items}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    title={<span className="font-bold">{item.productName}</span>}
                    description={`Mã SP: ${item.productId}`}
                  />
                  <div>{item.quantity} x ${item.price}</div>
                </List.Item>
              )}
            />
          </Card>

          <Divider>Luồng Điều phối (Routing)</Divider>
          {selectedOrder.routings.length > 0 ? (
            <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
              {selectedOrder.routings.map((routing, idx) => (
                <Card key={idx} size="small" style={{ backgroundColor: '#f0f5ff', border: '1px solid #adc6ff', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                    <CarOutlined style={{ fontSize: 20, color: '#1677ff', marginRight: 12 }} />
                    <Text strong style={{ fontSize: 16 }}>{routing.warehouseName} (Mã kho: {routing.warehouseId})</Text>
                    <Tag color="processing" style={{ marginLeft: 'auto' }}>Mã xuất kho: {routing.shipmentId}</Tag>
                  </div>
                  <List
                    size="small"
                    dataSource={routing.items}
                    renderItem={item => (
                      <List.Item style={{ padding: '4px 0' }}>
                        Xuất <Text strong>{item.quantity}</Text> x <Text strong className="text-primary">{item.productName}</Text>
                      </List.Item>
                    )}
                  />
                </Card>
              ))}
            </Space>
          ) : (
            <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 8 }}>
              <Text type="danger">Không có thông tin điều phối (Có thể đơn hàng bị hủy do không đủ tồn kho).</Text>
            </div>
          )}

          <Divider>Lịch sử Trạng thái (Saga Execution Timeline)</Divider>
          <Card bordered={false} style={{ backgroundColor: '#fafafa', borderRadius: 8 }}>
            <Timeline
              mode="left"
              items={selectedOrder.sagaHistory.map((step: SagaStep) => ({
                label: <Text type="secondary">{step.timestamp}</Text>,
                dot: getSagaIcon(step.status),
                children: (
                  <div style={{ marginBottom: 16 }}>
                    <Text strong style={{ display: 'block', fontSize: 15 }}>{step.step}</Text>
                    <Text type="secondary">{step.message}</Text>
                    <br />
                    <Tag color={
                      step.status === 'SUCCESS' ? 'success' :
                        step.status === 'FAILED' ? 'error' :
                          step.status === 'COMPENSATED' ? 'warning' : 'processing'
                    } style={{ marginTop: 8 }}>
                      {step.status}
                    </Tag>
                  </div>
                ),
              }))}
            />
          </Card>
        </div>
      )}
    </Drawer>
  );
};
