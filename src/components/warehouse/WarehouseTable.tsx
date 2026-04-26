import React from 'react';
import { Table, Tag } from 'antd';
import type { Warehouse } from '../../utils/mockData';

interface WarehouseTableProps {
  warehouses: Warehouse[];
}

export const WarehouseTable: React.FC<WarehouseTableProps> = ({ warehouses }) => {
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
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: 'Đang chứa',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (val: number, record: Warehouse) => {
        const percent = Math.round((val / record.capacity) * 100);
        let color = 'success';
        if (percent > 80) color = 'error';
        else if (percent > 60) color = 'warning';
        return <Tag color={color}>{val.toLocaleString()} ({percent}%)</Tag>;
      }
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
