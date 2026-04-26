// src/pages/CatalogPage.tsx
import React from 'react';
import { Table, Button, Space, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Product } from '../types/Product';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;

// 1. DỮ LIỆU GIẢ (Mock Data) - Tạm thời thay thế cho API Backend
const mockProducts: Product[] = [
  { id: 'PRO-1001', name: 'iPhone 15 Pro Max 256GB', category: 'Điện thoại', price: 29990000 },
  { id: 'PRO-1002', name: 'MacBook Pro M3 14-inch', category: 'Laptop', price: 39990000 },
  { id: 'PRO-1003', name: 'Tai nghe AirPods Pro 2', category: 'Phụ kiện', price: 6000000 },
  { id: 'PRO-1004', name: 'Samsung Galaxy S24 Ultra', category: 'Điện thoại', price: 33990000 },
];

export const CatalogPage: React.FC = () => {

  // 2. CẤU HÌNH CÁC CỘT CHO BẢNG
  const columns: ColumnsType<Product> = [
    {
      title: 'Mã SP',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <b>{text}</b>, // In đậm mã sản phẩm
    },
    {
      title: 'Tên Sản Phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>, // Đóng tag màu xanh
    },
    {
      title: 'Giá bán (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      // Format số tiền (vd: 29990000 -> 29,990,000)
      render: (price: number) => price.toLocaleString('vi-VN'), 
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {/* Nút Sửa */}
          <Button 
            type="primary" 
            ghost 
            icon={<EditOutlined />} 
            onClick={() => alert(`Bạn muốn sửa sản phẩm: ${record.name}?`)}
          >
            Sửa
          </Button>
          
          {/* Nút Xóa */}
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => alert(`Bạn có chắc muốn xóa: ${record.name}?`)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // 3. RENDER GIAO DIỆN CHÍNH
  return (
    <div>
      {/* Khu vực Tiêu đề và Nút Thêm mới */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Title level={3} style={{ margin: 0 }}>📦 Quản Lý Sản Phẩm</Title>
        <Button type="primary" icon={<PlusOutlined />} size="large">
          Thêm Sản Phẩm Mới
        </Button>
      </div>

      {/* Bảng Dữ liệu */}
      <Table 
        columns={columns} 
        dataSource={mockProducts} 
        rowKey="id" // Giúp React phân biệt các hàng
        pagination={{ pageSize: 5 }} // Phân trang tự động
      />
    </div>
  );
};