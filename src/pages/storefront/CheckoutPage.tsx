import React, { useEffect, useState } from 'react';
import { Layout, Typography, Row, Col, Card, Radio, Button, List, Spin, Divider, Empty, Space } from 'antd';
import { CreditCardOutlined, EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { accountService } from '../../services/accountService';
import { orderService } from '../../services/orderService';
import { useNavigate } from 'react-router-dom';
import { App as AntdApp } from 'antd';

const { Content } = Layout;
const { Title, Text } = Typography;

const formatAddress = (addr: any) => {
  const parts = [];
  if (addr.streetAddress) parts.push(addr.streetAddress);
  if (addr.ward) parts.push(`Phường/Xã ${addr.ward}`);
  if (addr.district) parts.push(`Quận/Huyện ${addr.district}`);
  if (addr.province) parts.push(`Tỉnh/TP ${addr.province}`);
  return parts.join(', ');
};

const CheckoutPage: React.FC = () => {
  const { message } = AntdApp.useApp();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, totalAmount, clearCart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>('ZaloPay');
  const [loading, setLoading] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để tiến hành thanh toán!');
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, navigate, message]);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const data = await accountService.getAddresses();
      // data may be an array if direct, or wrapped in a response object.
      // IdentityService returns ApiResponse<List<CustomerAddressDTO>> where data is in data.data
      const addressList = data.data || data;
      if (Array.isArray(addressList)) {
        setAddresses(addressList);
        const defaultAddr = addressList.find(a => a.isDefault);
        if (defaultAddr) setSelectedAddressId(defaultAddr.id);
        else if (addressList.length > 0) setSelectedAddressId(addressList[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch addresses', error);
      message.error('Không thể tải địa chỉ giao hàng.');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      message.error('Giỏ hàng trống!');
      return;
    }
    if (!selectedAddressId) {
      message.error('Vui lòng chọn địa chỉ giao hàng!');
      return;
    }

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    if (!selectedAddress) return;

    try {
      setLoading(true);
      const fullAddress = formatAddress(selectedAddress);

      const EXCHANGE_RATE = 1000; // 1 USD = 1000 VND (Hạ tỷ giá để lọt vào Sandbox ZaloPay)
      const convertedCart = cart.map(item => ({
        ...item,
        unitPrice: Math.round(item.unitPrice * EXCHANGE_RATE)
      }));

      const payload = {
        paymentMethod: paymentMethod,
        receiverName: selectedAddress.receiverName || 'Người nhận',
        receiverPhone: selectedAddress.receiverPhone || '000000000',
        shippingAddress: fullAddress,
        items: convertedCart
      };

      const res = await orderService.createOrder(payload);
      clearCart();
      message.success('Đặt hàng thành công!');

      // ZaloPay redirect logic
      if (paymentMethod === 'ZaloPay' && res?.paymentInfo?.paymentUrl) {
        message.info('Đang chuyển hướng sang ZaloPay...');
        setTimeout(() => {
          window.location.href = res.paymentInfo.paymentUrl;
        }, 1000);
      } else {
        navigate('/orders');
      }

    } catch (error) {
      console.error('Order failed', error);
      message.error('Đặt hàng thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0 && !loading) {
    return (
      <Layout style={{ minHeight: '80vh', padding: '40px 20px', background: '#f5f5f5' }}>
        <Content style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
          <Card>
            <Empty description="Giỏ hàng của bạn đang trống" />
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" onClick={() => navigate('/store')}>Tiếp tục mua sắm</Button>
            </div>
          </Card>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '80vh', padding: '40px 20px', background: '#f5f5f5' }}>
      <Content style={{ maxWidth: 1200, margin: '0 auto', width: '100%' }}>
        <Title level={2} style={{ marginBottom: 24 }}>Thanh toán</Title>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card title={<><EnvironmentOutlined /> Địa chỉ giao hàng</>} style={{ marginBottom: 24 }}>
              {loadingAddresses ? (
                <div style={{ textAlign: 'center', padding: '20px' }}><Spin /></div>
              ) : addresses.length === 0 ? (
                <Empty description="Bạn chưa có địa chỉ giao hàng nào">
                  <Button type="primary" onClick={() => navigate('/profile')}>Thêm địa chỉ mới trong Profile</Button>
                </Empty>
              ) : (
                <Radio.Group
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  value={selectedAddressId}
                  style={{ width: '100%' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {addresses.map(addr => (
                      <Card size="small" key={addr.id} style={{
                        borderColor: selectedAddressId === addr.id ? '#1890ff' : '#f0f0f0',
                        backgroundColor: selectedAddressId === addr.id ? '#e6f7ff' : '#ffffff',
                      }}>
                        <Radio value={addr.id}>
                          <div>
                            <Text strong>{addr.receiverName}</Text> | <Text>{addr.receiverPhone}</Text>
                            {addr.isDefault && <Text type="success" style={{ marginLeft: 8 }}>[Mặc định]</Text>}
                          </div>
                          <div>
                            <Text type="secondary">{formatAddress(addr)}</Text>
                          </div>
                        </Radio>
                      </Card>
                    ))}
                  </Space>
                </Radio.Group>
              )}
            </Card>

            <Card title={<><CreditCardOutlined /> Phương thức thanh toán</>}>
              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
              >
                <Space direction="vertical">
                  <Radio value="ZaloPay">
                    <img src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png" alt="ZaloPay" style={{ width: 24, height: 24, marginRight: 8, verticalAlign: 'middle' }} />
                    Thanh toán qua Ví ZaloPay
                  </Radio>
                  <Radio value="COD">
                    <DollarOutlined style={{ fontSize: 24, marginRight: 8, verticalAlign: 'middle', color: '#52c41a' }} />
                    Thanh toán khi nhận hàng (COD)
                  </Radio>
                </Space>
              </Radio.Group>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="Tóm tắt đơn hàng" bordered={false}>
              <List
                itemLayout="horizontal"
                dataSource={cart}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text ellipsis>{item.productName}</Text>}
                      description={`SL: ${item.quantity}`}
                    />
                    <div>{(Math.round(item.unitPrice * 25400) * item.quantity).toLocaleString('vi-VN')} ₫</div>
                  </List.Item>
                )}
              />
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Tạm tính ({totalItems} sp):</Text>
                <Text>{Math.round(totalAmount * 1000).toLocaleString('vi-VN')} ₫</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text>Phí giao hàng:</Text>
                <Text>Miễn phí</Text>
              </div>
              <Divider />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <Text strong style={{ fontSize: 18 }}>Tổng cộng:</Text>
                <Text strong style={{ fontSize: 20, color: '#f5222d' }}>{Math.round(totalAmount * 1000).toLocaleString('vi-VN')} ₫</Text>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={handlePlaceOrder}
                loading={loading}
                disabled={!selectedAddressId}
              >
                Đặt hàng
              </Button>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default CheckoutPage;
