import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import type { Warehouse } from '../../utils/mockData';

interface WarehouseModalFormProps {
  isVisible: boolean;
  editingWarehouse: Warehouse | null;
  onCancel: () => void;
  onOk: () => void;
  form: any;
}

export const WarehouseModalForm: React.FC<WarehouseModalFormProps> = ({
  isVisible,
  editingWarehouse,
  onCancel,
  onOk,
  form,
}) => {
  useEffect(() => {
    if (isVisible && !editingWarehouse) {
      form.resetFields();
    }
  }, [isVisible, editingWarehouse, form]);

  return (
    <Modal
      title={editingWarehouse ? 'Chỉnh sửa Kho bãi' : 'Thêm mới Kho bãi'}
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Lưu"
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" name="warehouseForm">
        <Form.Item
          name="name"
          label="Tên Kho"
          rules={[{ required: true, message: 'Vui lòng nhập tên kho!' }]}
        >
          <Input placeholder="Ví dụ: Kho Thủ Đức - HCM" />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
        >
          <Input placeholder="Ví dụ: Khu Công Nghệ Cao, Thủ Đức..." />
        </Form.Item>
        <Form.Item
          name="capacity"
          label="Sức chứa tối đa"
          rules={[{ required: true, message: 'Vui lòng nhập sức chứa!' }]}
        >
          <InputNumber style={{ width: '100%' }} min={0} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
