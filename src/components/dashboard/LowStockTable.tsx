import React from 'react';
import { Card, Table, Tag } from 'antd';
import type { InventoryItem } from '../../utils/mockData';

interface LowStockTableProps {
  data: InventoryItem[];
}

export const LowStockTable: React.FC<LowStockTableProps> = ({ data }) => {
  const lowStockColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string) => <span className="font-bold">{text}</span>,
    },
    {
      title: 'Kho',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
    },
    {
      title: 'Tồn kho',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (qty: number) => <Tag color="error">{qty} cái</Tag>,
    },
  ];

  return (
    <Card 
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 18, color: '#f5222d' }}>Cảnh báo hết hàng</span>
          <Tag color="error" style={{ borderRadius: 12 }}>{data.length}</Tag>
        </div>
      }
      variant='borderless'
      className="shadow-card" 
      style={{ borderRadius: 12, height: '100%' }}
    >
      <Table 
        dataSource={data} 
        columns={lowStockColumns} 
        pagination={false}
        rowKey="id"
        size="small"
      />
    </Card>
  );
};
