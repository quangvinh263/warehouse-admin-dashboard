import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import type { Warehouse } from '../../types';
import { catalogService } from '../../services/catalogService';

interface AddInventoryModalProps {
  isVisible: boolean;
  warehouses: Warehouse[];
  onCancel: () => void;
  onOk: (values: { warehouseId: string; productId: string; quantity: number }) => void;
  form: any;
}

export const AddInventoryModal: React.FC<AddInventoryModalProps> = ({ isVisible, warehouses, onCancel, onOk, form }) => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (isVisible) {
      catalogService.getProducts().then(setProducts).catch(() => message.error('Không thể tải danh sách sản phẩm'));
    }
  }, [isVisible]);

  return (
    <Modal
      title="Thêm tồn kho (Nhập kho mới)"
      open={isVisible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onOk}>
        <Form.Item name="warehouseId" label="Chọn kho bãi" rules={[{ required: true, message: 'Vui lòng chọn kho' }]}>
          <Select placeholder="Chọn kho">
            {warehouses.map(w => (
              <Select.Option key={w.id} value={w.id}>{w.name}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="productId" label="Chọn sản phẩm" rules={[{ required: true, message: 'Vui lòng chọn sản phẩm' }]}>
          <Select placeholder="Chọn sản phẩm" showSearch filterOption={(input, option: any) => option.children.toLowerCase().includes(input.toLowerCase())}>
            {products.map(p => (
              <Select.Option key={p.id} value={p.id}>{p.name} - {p.id}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="quantity" label="Số lượng nhập" rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}>
          <InputNumber min={1} style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
