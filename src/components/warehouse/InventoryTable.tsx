import React from 'react';
import { Table, Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { InventoryItem, Warehouse } from '../../types';

interface InventoryTableProps {
  inventory: InventoryItem[];
  warehouses: Warehouse[];
  searchText: string;
  setSearchText: (text: string) => void;
  selectedWarehouse: string | null;
  setSelectedWarehouse: (id: string | null) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({ 
  inventory, warehouses, searchText, setSearchText, selectedWarehouse, setSelectedWarehouse 
}) => {
  const inventoryColumns = [
    {
      title: 'Mã Tồn kho',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Mã Sản phẩm',
      dataIndex: 'productId',
      key: 'productId',
      render: (text: string) => <span className="text-primary">{text}</span>,
    },
    {
      title: 'Tên Sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      render: (text: string) => <span className="font-bold">{text}</span>,
    },
    {
      title: 'Kho chứa',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (val: number) => (
        <span className={val <= 10 ? 'text-danger font-bold' : ''}>
          {val.toLocaleString()}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Tìm tên hoặc mã sản phẩm..." 
          prefix={<SearchOutlined />} 
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
        <Select
          allowClear
          placeholder="Lọc theo Kho"
          style={{ width: 200 }}
          value={selectedWarehouse}
          onChange={setSelectedWarehouse}
          options={warehouses.map(w => ({ value: w.id, label: w.name }))}
        />
      </Space>
      <Table 
        columns={inventoryColumns} 
        dataSource={inventory} 
        rowKey="id" 
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};
