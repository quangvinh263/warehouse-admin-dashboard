import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Warehouse } from '../../utils/mockData';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  onEdit: (record: Warehouse) => void;
  onDelete: (id: string) => void;
}

export const WarehouseTable: React.FC<WarehouseTableProps> = ({ warehouses, onEdit, onDelete }) => {
  const warehouseColumns = [
    {
      title: 'Mã Kho',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Tên Kho',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span className="font-bold">{text}</span>,
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Sức chứa',
      dataIndex: 'capacity',
      key: 'capacity',
      render: (val: number) => val?.toLocaleString(),
    },
    {
      title: 'Đang chứa',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (val: number, record: Warehouse) => {
        if (record.capacity === 0) return <Tag color="default">0 (0%)</Tag>;
        const current = val || 0;
        const percent = Math.round((current / record.capacity) * 100);
        let color = 'success';
        if (percent > 80) color = 'error';
        else if (percent > 60) color = 'warning';
        return <Tag color={color}>{current.toLocaleString()} ({percent}%)</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Warehouse) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => onEdit(record)}
            style={{ color: '#1677ff' }}
          />
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => onDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={warehouseColumns} 
      dataSource={warehouses} 
      rowKey="id" 
      pagination={false}
    />
  );
};
