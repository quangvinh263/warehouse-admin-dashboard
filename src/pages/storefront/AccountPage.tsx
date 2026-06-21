import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, List, Tag, Spin, message, Modal, Form, Input, Checkbox } from 'antd';
import { PlusOutlined, EnvironmentOutlined, HomeOutlined, DeleteOutlined, EditOutlined, StarOutlined, StarFilled } from '@ant-design/icons';
import { StoreLayout } from '../../components/store/StoreLayout';
import { accountService } from '../../services/accountService';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const formatAddress = (addr: any) => {
  const parts = [];
  if (addr.streetAddress) parts.push(addr.streetAddress);
  if (addr.ward) parts.push(`Phường/Xã ${addr.ward}`);
  if (addr.district) parts.push(`Quận/Huyện ${addr.district}`);
  if (addr.province) parts.push(`Tỉnh/TP ${addr.province}`);
  return parts.join(', ');
};

export const AccountPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [isAuthenticated, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await accountService.getAddresses();
      if (res.isSuccess) {
        setAddresses(res.data);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách địa chỉ");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrEdit = async (values: any) => {
    try {
      if (editingId) {
        const res = await accountService.updateAddress(editingId, values);
        if (res.isSuccess) message.success('Cập nhật địa chỉ thành công');
      } else {
        const res = await accountService.createAddress(values);
        if (res.isSuccess) message.success('Thêm địa chỉ mới thành công');
      }
      setIsModalOpen(false);
      fetchAddresses();
    } catch (error) {
      message.error("Lỗi lưu địa chỉ");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await accountService.deleteAddress(id);
      if (res.isSuccess) {
        message.success("Đã xóa địa chỉ");
        fetchAddresses();
      }
    } catch (error) {
      message.error("Lỗi khi xóa");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const res = await accountService.setDefaultAddress(id);
      if (res.isSuccess) {
        message.success("Đã đặt làm địa chỉ mặc định");
        fetchAddresses();
      }
    } catch (error) {
      message.error("Lỗi thiết lập mặc định");
    }
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      form.setFieldsValue(item);
    } else {
      setEditingId(null);
      form.resetFields();
    }
    setIsModalOpen(true);
  };

  return (
    <StoreLayout>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <Title level={2}>Tài khoản của tôi</Title>
        <Card title={<><EnvironmentOutlined /> Sổ địa chỉ giao hàng</>} variant="borderless" className="shadow-card" style={{ borderRadius: 12 }}>
          <div style={{ marginBottom: 16, textAlign: 'right' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
              Thêm địa chỉ mới
            </Button>
          </div>
          
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}><Spin size="large" /></div>
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={addresses}
              locale={{ emptyText: "Bạn chưa có địa chỉ nào" }}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    <Button type="text" icon={item.isDefault ? <StarFilled style={{ color: '#faad14' }}/> : <StarOutlined />} onClick={() => handleSetDefault(item.id)}>
                      {item.isDefault ? 'Mặc định' : 'Đặt mặc định'}
                    </Button>,
                    <Button type="text" icon={<EditOutlined />} onClick={() => openModal(item)}>Sửa</Button>,
                    <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(item.id)}>Xóa</Button>
                  ]}
                  style={{ background: item.isDefault ? '#f6ffed' : 'transparent', padding: '16px', borderRadius: 8, marginBottom: 8, border: item.isDefault ? '1px solid #b7eb8f' : '1px solid #f0f0f0' }}
                >
                  <List.Item.Meta
                    avatar={<HomeOutlined style={{ fontSize: 24, color: item.isDefault ? '#52c41a' : '#8c8c8c' }} />}
                    title={
                      <div>
                        {item.receiverName} - {item.receiverPhone} 
                        {item.isDefault && <Tag color="success" style={{ marginLeft: 8 }}>Mặc định</Tag>}
                      </div>
                    }
                    description={formatAddress(item)}
                  />
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>

      <Modal
        title={editingId ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleAddOrEdit}>
          <Form.Item name="receiverName" label="Tên người nhận" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="receiverPhone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="province" label="Tỉnh/Thành phố" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="district" label="Quận/Huyện" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ward" label="Phường/Xã" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="streetAddress" label="Địa chỉ cụ thể (Số nhà, đường...)" rules={[{ required: true }]}>
            <Input.TextArea rows={2} />
          </Form.Item>
          <Form.Item name="isDefault" valuePropName="checked">
            <Checkbox>Đặt làm địa chỉ mặc định</Checkbox>
          </Form.Item>
          <Form.Item style={{ textAlign: 'right', marginBottom: 0 }}>
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>Hủy</Button>
            <Button type="primary" htmlType="submit">Lưu địa chỉ</Button>
          </Form.Item>
        </Form>
      </Modal>
    </StoreLayout>
  );
};
