import React, { useState } from 'react';
import { Tabs, Typography, Card } from 'antd';
import { mockWarehouses, mockInventory } from '../utils/mockData';
import { WarehouseTable } from '../components/warehouse/WarehouseTable';
import { InventoryTable } from '../components/warehouse/InventoryTable';

const { Title } = Typography;

export const WarehousePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);

  const filteredInventory = mockInventory.filter(item => {
    const matchName = item.productName.toLowerCase().includes(searchText.toLowerCase()) || 
                      item.productId.toLowerCase().includes(searchText.toLowerCase());
    const matchWarehouse = selectedWarehouse ? item.warehouseId === selectedWarehouse : true;
    return matchName && matchWarehouse;
  });

  const items = [
    {
      key: '1',
      label: 'Danh sách Kho bãi',
      children: <WarehouseTable warehouses={mockWarehouses} />,
    },
    {
      key: '2',
      label: 'Chi tiết Tồn kho (Inventory)',
      children: (
        <InventoryTable 
          inventory={filteredInventory} 
          warehouses={mockWarehouses} 
          searchText={searchText}
          setSearchText={setSearchText}
          selectedWarehouse={selectedWarehouse}
          setSelectedWarehouse={setSelectedWarehouse}
        />
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Kho & Tồn kho (Inventory Service)</Title>
      </div>

      <Card variant='borderless' className="shadow-card" style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};