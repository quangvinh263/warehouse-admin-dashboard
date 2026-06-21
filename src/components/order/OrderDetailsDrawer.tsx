import React, { useState, useEffect } from 'react';
import { Drawer, Typography, Card, Tag, Timeline, Divider, List, Space, Spin, message, Select, Button } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, SyncOutlined, UndoOutlined, CarOutlined } from '@ant-design/icons';
import { orderService } from '../../services/orderService';
import { warehouseService } from '../../services/warehouseService';

const { Text } = Typography;

interface OrderDetailsDrawerProps {
  isVisible: boolean;
  selectedOrder: any | null;
  onClose: () => void;
  onUpdate?: () => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({ isVisible, selectedOrder, onClose, onUpdate }) => {
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
    } else if (state.currentState === 'Failed') {
       steps.push({
        step: 'Thanh toán (PaymentProcessed)',
        status: 'FAILED',
        message: 'Lỗi thanh toán.',
        time: state.updatedAt
      });
    } else if (state.currentState !== 'Cancelled') {
      steps.push({
        step: 'Đang chờ Thanh toán (AwaitingPayment)',
        status: 'PENDING',
        message: 'Chờ phản hồi từ Payment Gateway.',
        time: state.updatedAt
      });
    }

    // Bước 3: Xuất kho
    if (state.isStockAllocated) {
      steps.push({
        step: 'Giữ hàng trong Kho (InventoryAllocated)',
        status: 'SUCCESS',
        message: 'Hàng đã được điều phối cho đơn này.',
        time: state.updatedAt
      });
    } else if (state.currentState === 'Failed') {
       steps.push({
        step: 'Giữ hàng trong Kho (InventoryAllocated)',
        status: 'FAILED',
        message: 'Không đủ số lượng trong kho.',
        time: state.updatedAt
      });
    } else if (state.currentState !== 'Cancelled') {
      steps.push({
        step: 'Đang điều phối Kho (AllocatingStock)',
        status: 'PENDING',
        message: 'Đang check tồn kho ở tất cả Warehouse.',
        time: state.updatedAt
      });
    }

    // Bước 4: Hủy đơn hàng
    if (state.currentState === 'Cancelled') {
      steps.push({
        step: 'Đơn hàng bị Hủy (OrderCancelled)',
        status: 'FAILED',
        message: 'Đơn hàng đã bị hủy bởi Admin hoặc Khách hàng.',
        time: state.updatedAt
      });
      if (state.isStockAllocated) {
        steps.push({
          step: 'Nhả hàng về Kho (StockReleased)',
          status: 'COMPENSATED',
          message: 'Hệ thống đã tự động hoàn trả số lượng sản phẩm vào kho.',
          time: state.updatedAt
        });
      }
      if (state.isPaid) {
        steps.push({
          step: 'Hoàn tiền (RefundCompensated)',
          status: 'COMPENSATED',
          message: 'Hủy đơn, bắt đầu hoàn tiền.',
          time: state.updatedAt
        });
      }
    }

    // Bước 5: Hoàn thành Saga
    if (state.currentState === 'Completed') {
      steps.push({
        step: 'Saga Hoàn tất (Completed)',
        status: 'SUCCESS',
        message: 'Hệ thống đã chốt đơn thành công.',
        time: state.updatedAt
      });
    }

    // Bước 5: Các trạng thái giao hàng vật lý
    const orderStatus = selectedOrder?.status;
    if (orderStatus === 'Confirmed' || orderStatus === 'Shipped' || orderStatus === 'Delivered') {
      steps.push({
        step: 'Đã xác nhận (Confirmed)',
        status: 'SUCCESS',
        message: 'Đơn hàng đã được Admin xác nhận.',
        time: selectedOrder?.updatedAt || state.updatedAt
      });
    }
    
    if (orderStatus === 'Shipped' || orderStatus === 'Delivered') {
      steps.push({
        step: 'Đang giao hàng (Shipped)',
        status: 'SUCCESS',
        message: 'Đơn hàng đang trên đường giao.',
        time: selectedOrder?.updatedAt || state.updatedAt
      });
    }

    if (orderStatus === 'Delivered') {
      steps.push({
        step: 'Đã giao thành công (Delivered)',
        status: 'SUCCESS',
        message: 'Khách hàng đã nhận được sản phẩm.',
        time: selectedOrder?.updatedAt || state.updatedAt
      });
    }

    return steps;
  };

  const getProductName = (productId: string) => {
    const items = selectedOrder?.orderItems || selectedOrder?.items || [];
    const item = items.find((i: any) => i.productId === productId);
    return item ? item.productName : `SP (ID: ${productId})`;
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Pending': return <Tag color="processing">ĐANG XỬ LÝ</Tag>;
      case 'AwaitingPayment': return <Tag color="warning">CHỜ THANH TOÁN</Tag>;
      case 'Paid': return <Tag color="success">ĐÃ THANH TOÁN</Tag>;
      case 'Confirmed': return <Tag color="blue">ĐÃ XÁC NHẬN</Tag>;
      case 'Shipped': return <Tag color="purple">ĐANG GIAO HÀNG</Tag>;
      case 'Delivered': return <Tag color="success">ĐÃ GIAO</Tag>;
      case 'Completed': return <Tag color="success">HOÀN THÀNH</Tag>;
      case 'Failed': return <Tag color="error">THẤT BẠI</Tag>;
      case 'Cancelled': return <Tag color="error">ĐÃ HỦY</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus);
      message.success('Cập nhật trạng thái thành công!');
      if (selectedOrder) {
        selectedOrder.status = newStatus;
      }
      if (onUpdate) onUpdate();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
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
              <Space size="large" align="center">
                <Text type="secondary">Trạng thái (Status):</Text>
                <Select 
                  value={selectedOrder.status} 
                  style={{ width: 160 }} 
                  onChange={handleStatusChange}
                  disabled={selectedOrder.status === 'Completed' || selectedOrder.status === 'Cancelled' || selectedOrder.status === 'Failed'}
                  options={[
                    { value: 'Pending', label: 'Pending' },
                    { value: 'AwaitingPayment', label: 'Awaiting Payment' },
                    { value: 'Paid', label: 'Paid' },
                    { value: 'Confirmed', label: 'Confirmed' },
                    { value: 'Shipped', label: 'Shipped' },
                    { value: 'Delivered', label: 'Delivered' },
                    { value: 'Completed', label: 'Completed' },
                    { value: 'Cancelled', label: 'Cancelled' },
                    { value: 'Failed', label: 'Failed' },
                  ].map((opt, idx, arr) => {
                    const currentIndex = arr.findIndex(x => x.value === selectedOrder.status);
                    if (opt.value === 'Cancelled' || opt.value === 'Failed') return opt;
                    if (idx < currentIndex) return { ...opt, disabled: true };
                    return opt;
                  })}
                />
                <Divider type="vertical" />
                <Text strong className="text-primary" style={{ fontSize: 18 }}>{selectedOrder.totalAmount?.toLocaleString('vi-VN')} ₫</Text>
                {selectedOrder.status === 'AwaitingPayment' && (
                  <Button 
                    type="primary" 
                    danger
                    onClick={async () => {
                      try {
                        await import('../../api/axiosClient').then(m => m.default.post(`/api/Payment/${selectedOrder.id}/mock-payment`));
                        message.success("Giả lập thanh toán thành công!");
                        fetchOrderDetails(selectedOrder.id);
                        if (onUpdate) onUpdate();
                      } catch (e) {
                        message.error("Lỗi giả lập thanh toán.");
                      }
                    }}
                  >
                    Pass Thanh toán (Bypass ZaloPay)
                  </Button>
                )}
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
                    <div>{item.quantity} x {(item.unitPrice || item.price)?.toLocaleString('vi-VN')} ₫</div>
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
                          Biên lai xuất: <Text strong>{item.quantity}</Text> x <Text strong className="text-primary">{getProductName(item.productId)}</Text>
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
                  label: step.time ? <Text type="secondary">{new Date(step.time).toLocaleString()}</Text> : null,
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
