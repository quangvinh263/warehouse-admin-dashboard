import React from 'react';
import { Table, Button, Space, Image, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Product } from '../../types';

interface ProductTableProps {
  products: Product[];
  onEdit: (record: Product) => void;
  onDelete: (id: string) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-bold">{text}</span>,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (url: string) => (
        <Image src={url} width={50} height={50} style={{ objectFit: 'contain' }} fallback="https://via.placeholder.com/50" />
      ),
    },
    {
      title: 'Tên Sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Giá bán',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <span className="text-primary font-bold">${price}</span>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Product) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => onEdit(record)} style={{ color: '#1677ff' }} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => onDelete(record.id)} />
        </Space>
      ),
    },
  ];

  return (
    <Card variant='borderless' className="shadow-card" style={{ borderRadius: 12 }}>
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </Card>
  );
};
