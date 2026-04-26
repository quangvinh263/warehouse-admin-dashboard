import React from 'react';
import { Modal, Form, Input, InputNumber, Row, Col } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { Product } from '../../utils/mockData';

interface ProductModalFormProps {
  isVisible: boolean;
  editingProduct: Product | null;
  onCancel: () => void;
  onOk: () => void;
  form: FormInstance;
}

export const ProductModalForm: React.FC<ProductModalFormProps> = ({ isVisible, editingProduct, onCancel, onOk, form }) => {
  return (
    <Modal
      title={editingProduct ? "Sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
      open={isVisible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Lưu (Publish Event)"
      cancelText="Hủy"
      width={600}
    >
      <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
        <Form.Item name="name" label="Tên Sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}>
          <Input placeholder="VD: iPhone 16 Pro Max" />
        </Form.Item>
        <Form.Item name="imageUrl" label="URL Hình ảnh" rules={[{ required: true, message: 'Vui lòng nhập URL hình!' }]}>
          <Input placeholder="https://..." />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="category" label="Danh mục" rules={[{ required: true, message: 'Vui lòng nhập danh mục!' }]}>
              <Input placeholder="VD: Smartphone" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="price" label="Giá bán ($)" rules={[{ required: true, message: 'Vui lòng nhập giá!' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
