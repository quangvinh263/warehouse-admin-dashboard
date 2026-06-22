import React from 'react';
import { Card, Table, Tag } from 'antd';
import type { InventoryItem } from '../../types';

interface LowStockTableProps {
  data: InventoryItem[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ data }) => {
  const lowStockColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string) => <span style={{ fontWeight: 600, color: '#374151' }}>{text}</span>,
    },
    {
      title: 'Kho bãi',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      render: (text: string) => <span style={{ color: '#6b7280', fontSize: 13 }}>{text}</span>,
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      render: (qty: number) => (
        <Tag color="red-inverse" style={{ borderRadius: 6, fontWeight: 500 }}>
          {qty} cái
        </Tag>
      ),
    },
  ];

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0' }}>
          <span style={{ fontSize: 18, fontWeight: 600, color: '#111827' }}>Cảnh báo hết hàng</span>
          <Tag color="red" style={{ borderRadius: 12, fontWeight: 600 }}>{data.length} mặt hàng</Tag>
        </div>
      }
      variant='borderless'
      className="premium-stat-card" 
      style={{ borderRadius: 16, height: '100%' }}
    >
      <Table 
        dataSource={data} 
        columns={lowStockColumns} 
        pagination={data.length > 5 ? { pageSize: 5, size: 'small', showSizeChanger: false } : false}
        rowKey="id"
        size="small"
        locale={{ emptyText: 'Không có sản phẩm nào sắp hết hàng' }}
        style={{ marginTop: 8 }}
      />
    </Card>
  );
};

