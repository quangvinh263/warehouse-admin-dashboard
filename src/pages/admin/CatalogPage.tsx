import React, { useState, useEffect } from 'react';
import { Button, Typography, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Product } from '../../types';
import { ProductTable } from '../../components/catalog/ProductTable';
import { ProductModalForm } from '../../components/catalog/ProductModalForm';
import { catalogService } from '../../services/catalogService';

const { Title } = Typography;

export const CatalogPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await catalogService.getProducts();
      setProducts(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm!");
    }
  };

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
      onOk: async () => {
        try {
          await catalogService.deleteProduct(id);
          message.success('Đã xóa sản phẩm thành công!');
          fetchProducts();
        } catch (error) {
          message.error('Lỗi khi xóa sản phẩm!');
        }
      }
    });
  };

  const handleOk = () => {
    form.validateFields().then(async values => {
      try {
        if (editingProduct) {
          await catalogService.updateProduct(editingProduct.id, values);
          message.success('Đã cập nhật sản phẩm thành công!');
        } else {
          await catalogService.createProduct(values);
          message.success('Đã tạo mới sản phẩm thành công!');
        }
        setIsModalVisible(false);
        fetchProducts();
      } catch (error) {
        message.error('Lỗi khi lưu sản phẩm!');
      }
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
