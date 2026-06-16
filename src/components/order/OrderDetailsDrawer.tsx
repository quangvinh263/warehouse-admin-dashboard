import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Card, Tag, Timeline, Divider, List, Space, Spin, message } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, UndoOutlined, CarOutlined } from '@ant-design/icons';
import { orderService } from '../../services/orderService';
import { warehouseService } from '../../services/warehouseService';

const { Text } = Typography;

interface OrderDetailsDrawerProps {
  isVisible: boolean;
  selectedOrder: any | null;
  onClose: () => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ isVisible, selectedOrder, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [sagaTimeline, setSagaTimeline] = useState<any[]>([]);
  const [routings, setRoutings] = useState<any[]>([]);

  useEffect(() => {
    if (isVisible && selectedOrder) {
      fetchOrderDetails(selectedOrder.id);
    } else {
      setSagaTimeline([]);
      setRoutings([]);
    }
  }, [isVisible, selectedOrder]);

  const fetchOrderDetails = async (orderId: string) => {
    setLoading(true);
    try {
      // 1. Lấy trạng thái Saga
      const history = await orderService.getOrderHistory(orderId);
      const timeline = buildTimeline(history);
      setSagaTimeline(timeline);

      // 2. Lấy thông tin điều phối kho
      if (history.isStockAllocated) {
        const reservations = await warehouseService.getOrderReservations(orderId);
        // Gom nhóm theo kho
        const routingMap = new Map();
        reservations.forEach((res: any) => {
          if (!routingMap.has(res.warehouseId)) {
            routingMap.set(res.warehouseId, {
              warehouseId: res.warehouseId,
              warehouseName: res.warehouseName,
              items: []
            });
          }
          routingMap.get(res.warehouseId).items.push(res);
        });
        setRoutings(Array.from(routingMap.values()));
      } else {
        setRoutings([]);
      }

    } catch (error) {
      message.error("Lỗi khi lấy chi tiết đơn hàng (Có thể chưa có State)");
      // Fallback
      setSagaTimeline([{ step: 'Lỗi', status: 'FAILED', message: 'Chưa có thông tin Saga cho đơn hàng này.' }]);
      setRoutings([]);
    } finally {
      setLoading(false);
    }
  };

  const buildTimeline = (state: any) => {
    const steps = [];
    
    // Bước 1: Khởi tạo đơn hàng
    steps.push({
      step: 'Khởi tạo Đơn hàng (OrderCreated)',
      status: 'SUCCESS',
      message: 'Saga đã bắt đầu.',
      time: state.createdAt
    });

    // Bước 2: Thanh toán
    if (state.isPaid) {
      steps.push({
        step: 'Thanh toán hoàn tất (PaymentProcessed)',
        status: 'SUCCESS',
        message: 'ZaloPay trả về thành công.',
        time: state.updatedAt
      });
    } else if (state.currentState === 'Failed' || state.currentState === 'Cancelled') {
       steps.push({
        step: 'Thanh toán (PaymentProcessed)',
        status: 'FAILED',
        message: 'Lỗi thanh toán.',
        time: state.updatedAt
      });
    } else {
      steps.push({
        step: 'Đang chờ Thanh toán (AwaitingPayment)',
        status: 'PENDING',
        message: 'Chờ phản hồi từ Payment Gateway.',
        time: state.updatedAt
      });
    }

    // Bước 3: Xuất kho
    if (state.isPaid) {
      if (state.isStockAllocated) {
        steps.push({
          step: 'Giữ hàng trong Kho (InventoryAllocated)',
          status: 'SUCCESS',
          message: 'Hàng đã được điều phối cho đơn này.',
          time: state.updatedAt
        });
      } else if (state.currentState === 'Failed' || state.currentState === 'Cancelled') {
         steps.push({
          step: 'Giữ hàng trong Kho (InventoryAllocated)',
          status: 'FAILED',
          message: 'Không đủ số lượng trong kho.',
          time: state.updatedAt
        });
        steps.push({
          step: 'Hoàn tiền (RefundCompensated)',
          status: 'COMPENSATED',
          message: 'Hủy đơn, bắt đầu hoàn tiền.',
          time: state.updatedAt
        });
      } else {
        steps.push({
          step: 'Đang điều phối Kho (AllocatingStock)',
          status: 'PENDING',
          message: 'Đang check tồn kho ở tất cả Warehouse.',
          time: state.updatedAt
        });
      }
    }

    // Bước 4: Hoàn thành
    if (state.currentState === 'Completed') {
      steps.push({
        step: 'Đơn hàng Hoàn tất (Completed)',
        status: 'SUCCESS',
        message: 'Luồng Saga kết thúc.',
        time: state.updatedAt
      });
    }

    return steps;
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Completed': return <Tag color="success">COMPLETED</Tag>;
      case 'Pending': return <Tag color="warning">PENDING</Tag>;
      case 'Failed':
      case 'Cancelled': return <Tag color="error">{status.toUpperCase()}</Tag>;
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
      <Spin spinning={loading}>
        {selectedOrder && (
          <div>
            <div style={{ marginBottom: 24, marginTop: 24 }}>
              <Space size="large">
                <Text type="secondary">Trạng thái (Status):</Text>
                {getStatusTag(selectedOrder.status)}
                <Divider type="vertical" />
                <Text type="secondary">Tổng tiền:</Text>
                <Text strong className="text-primary" style={{ fontSize: 18 }}>${selectedOrder.totalAmount}</Text>
              </Space>
            </div>

            <Card size="small" title="Danh sách sản phẩm mua" style={{ marginBottom: 24, borderRadius: 8 }}>
              <List
                itemLayout="horizontal"
                dataSource={selectedOrder.orderItems || selectedOrder.items || []}
                renderItem={(item: any) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<span className="font-bold">{item.productName}</span>}
                      description={`Mã SP: ${item.productId}`}
                    />
                    <div>{item.quantity} x ${item.unitPrice || item.price}</div>
                  </List.Item>
                )}
              />
            </Card>

            <Divider>Luồng Điều phối thực tế (Routings)</Divider>
            {routings.length > 0 ? (
              <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
                {routings.map((routing, idx) => (
                  <Card key={idx} size="small" style={{ backgroundColor: '#f0f5ff', border: '1px solid #adc6ff', borderRadius: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                      <CarOutlined style={{ fontSize: 20, color: '#1677ff', marginRight: 12 }} />
                      <Text strong style={{ fontSize: 16 }}>{routing.warehouseName} (Mã kho: {routing.warehouseId})</Text>
                    </div>
                    <List
                      size="small"
                      dataSource={routing.items}
                      renderItem={(item) => (
                        <List.Item style={{ padding: '4px 0' }}>
                          Biên lai xuất: <Text strong>{item.quantity}</Text> x SP (ID: <Text strong className="text-primary">{item.productId}</Text>)
                        </List.Item>
                      )}
                    />
                  </Card>
                ))}
              </Space>
            ) : (
              <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#fff1f0', border: '1px solid #ffa39e', borderRadius: 8 }}>
                <Text type="danger">Chưa có hoặc không có thông tin điều phối kho (Có thể đang Pending hoặc Đơn hàng bị hủy do thiếu hàng).</Text>
              </div>
            )}

            <Divider>Lịch sử Trạng thái (Saga Execution Timeline)</Divider>
            <Card bordered={false} style={{ backgroundColor: '#fafafa', borderRadius: 8 }}>
              <Timeline
                mode="left"
                items={sagaTimeline.map((step, idx) => ({
                  label: <Text type="secondary">{new Date(step.time).toLocaleString()}</Text>,
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
      </Spin>
    </Drawer>
  );
};
