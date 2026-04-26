import React, { useState } from 'react';
import { Button, Typography, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { mockProducts } from '../utils/mockData';
import type { Product } from '../utils/mockData';
import { ProductTable } from '../components/catalog/ProductTable';
import { ProductModalForm } from '../components/catalog/ProductModalForm';

const { Title } = Typography;

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: () => {
        setProducts(products.filter(p => p.id !== id));
        message.success('Đã gửi sự kiện xóa sản phẩm qua RabbitMQ!');
      }
    });
  };

  const handleOk = () => {
    form.validateFields().then(values => {
      if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...values } : p));
        message.success(`Đã gửi sự kiện cập nhật sản phẩm [${editingProduct.id}] qua RabbitMQ!`);
      } else {
        const newProduct = {
          ...values,
          id: `P${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        };
        setProducts([...products, newProduct]);
        message.success('Đã gửi sự kiện tạo mới sản phẩm qua RabbitMQ!');
      }
      setIsModalVisible(false);
    });
  };

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Sản phẩm (Catalog Service)</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large" style={{ borderRadius: 8 }}>
          Thêm Sản phẩm
        </Button>
      </div>

      <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />

      <ProductModalForm 
        isVisible={isModalVisible} 
        editingProduct={editingProduct} 
        onCancel={() => setIsModalVisible(false)} 
        onOk={handleOk} 
        form={form} 
      />
    </div>
  );
};