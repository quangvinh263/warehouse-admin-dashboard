import React, { useState, useEffect } from 'react';
import { Tabs, Typography, Card, message, Button, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Warehouse, InventoryItem } from '../../types';
import { WarehouseTable } from '../../components/warehouse/WarehouseTable';
import { InventoryTable } from '../../components/warehouse/InventoryTable';
import { WarehouseModalForm } from '../../components/warehouse/WarehouseModalForm';
import { AddInventoryModal } from '../../components/warehouse/AddInventoryModal';
import { warehouseService } from '../../services/warehouseService';

const { Title } = Typography;

export const WarehousePage: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(null);
  
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // Modal states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [form] = Form.useForm();

  const [isAddInvVisible, setIsAddInvVisible] = useState(false);
  const [invForm] = Form.useForm();

  useEffect(() => {
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (selectedWarehouse) {
      fetchInventory(selectedWarehouse);
    } else {
      setInventory([]);
    }
  }, [selectedWarehouse]);

  const fetchWarehouses = async () => {
    try {
      const data = await warehouseService.getWarehouses();
      setWarehouses(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách kho!");
    }
  };

  const fetchInventory = async (warehouseId: string) => {
    try {
      const w = await warehouseService.getWarehouseById(warehouseId);
      let invItems: InventoryItem[] = [];
      if (w.inventories) {
        w.inventories.forEach((inv: any) => {
          invItems.push({
            id: inv.id || Math.random().toString(),
            productId: inv.productId,
            productName: inv.productName || inv.productId, 
            warehouseId: w.id,
            warehouseName: w.name,
            quantity: inv.quantity
          });
        });
      }
      setInventory(invItems);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết tồn kho!");
    }
  };

  const handleAdd = () => {
    setEditingWarehouse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Warehouse) => {
    setEditingWarehouse(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa kho bãi này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await warehouseService.deleteWarehouse(id);
          message.success('Đã xóa kho bãi thành công!');
          fetchWarehouses();
        } catch (error) {
          message.error('Lỗi khi xóa kho bãi!');
        }
      }
    });
  };

  const handleOk = () => {
    form.validateFields().then(async values => {
      try {
        if (editingWarehouse) {
          await warehouseService.updateWarehouse(editingWarehouse.id, values);
          message.success('Đã cập nhật kho bãi thành công!');
        } else {
          await warehouseService.createWarehouse(values);
          message.success('Đã tạo mới kho bãi thành công!');
        }
        setIsModalVisible(false);
        fetchWarehouses();
      } catch (error) {
        message.error('Lỗi khi lưu kho bãi!');
      }
    });
  };

  const handleAddInvOk = (values: { warehouseId: string; productId: string; quantity: number }) => {
    warehouseService.addInventory(values.warehouseId, { productId: values.productId, quantity: values.quantity })
      .then(() => {
        message.success('Nhập kho thành công!');
        setIsAddInvVisible(false);
        invForm.resetFields();
        // Refresh inventory if the currently selected warehouse is the one we just added to
        if (selectedWarehouse === values.warehouseId) {
          fetchInventory(values.warehouseId);
        }
      })
      .catch(() => message.error('Lỗi khi nhập kho!'));
  };

  const filteredInventory = inventory.filter(item => {
    const matchName = item.productName?.toLowerCase().includes(searchText.toLowerCase()) || 
                      item.productId?.toLowerCase().includes(searchText.toLowerCase());
    const matchWarehouse = selectedWarehouse ? item.warehouseId === selectedWarehouse : true;
    return matchName && matchWarehouse;
  });

  const items = [
    {
      key: '1',
      label: 'Danh sách Kho bãi',
      children: <WarehouseTable warehouses={warehouses} onEdit={handleEdit} onDelete={handleDelete} />,
    },
    {
      key: '2',
      label: 'Chi tiết Tồn kho (Inventory)',
      children: (
        <InventoryTable 
          inventory={filteredInventory} 
          warehouses={warehouses} 
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
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2} style={{ margin: 0 }}>Quản lý Kho & Tồn kho (Inventory Service)</Title>
        <div>
          <Button type="default" onClick={() => setIsAddInvVisible(true)} size="large" style={{ borderRadius: 8, marginRight: 8 }}>
            Nhập Tồn Kho
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} size="large" style={{ borderRadius: 8 }}>
            Thêm Kho bãi
          </Button>
        </div>
      </div>

      <Card variant='borderless' className="shadow-card" style={{ borderRadius: 12 }}>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>

      <WarehouseModalForm 
        isVisible={isModalVisible}
        editingWarehouse={editingWarehouse}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        form={form}
      />

      <AddInventoryModal
        isVisible={isAddInvVisible}
        warehouses={warehouses}
        onCancel={() => setIsAddInvVisible(false)}
        onOk={handleAddInvOk}
        form={invForm}
      />
    </div>
  );
};
