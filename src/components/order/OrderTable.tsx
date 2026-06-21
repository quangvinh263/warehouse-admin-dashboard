import React from 'react';
import { Table, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import type { Order } from '../../types';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
}

export const OrderTable: React.FC<OrderTableProps> = ({ orders, onViewDetails }) => {
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'Pending': return <Tag color="processing">ĐANG XỬ LÝ</Tag>;
      case 'AwaitingPayment': return <Tag color="warning">CHỜ THANH TOÁN</Tag>;
      case 'Paid': return <Tag color="success">ĐÃ THANH TOÁN</Tag>;
      case 'Confirmed': return <Tag color="blue">ĐÃ XÁC NHẬN</Tag>;
      case 'Shipped': return <Tag color="purple">ĐANG GIAO HÀNG</Tag>;
      case 'Delivered': return <Tag color="success">ĐÃ GIAO</Tag>;
      case 'Completed': return <Tag color="success">HOÀN THÀNH</Tag>;
      case 'Failed': return <Tag color="error">THẤT BẠI</Tag>;
      case 'Cancelled': return <Tag color="error">ĐÃ HỦY</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    {
      title: 'Mã Đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-bold text-primary">{text}</span>,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => new Date(text).toLocaleString(),
    },
    {
      title: 'Khách hàng',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => <span className="font-bold">{amount?.toLocaleString('vi-VN')} ₫</span>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button
          type="primary"
          ghost
          icon={<EyeOutlined />}
          onClick={() => onViewDetails(record)}
        >
          Chi tiết & Tracking
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={orders}
      rowKey="id"
      pagination={{ pageSize: 10 }}
    />
  );
};
