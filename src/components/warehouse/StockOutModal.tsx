import React from 'react';
import { Modal, Form, InputNumber, Input, Typography } from 'antd';
import type { InventoryItem } from '../../types';

const { Text } = Typography;

interface StockOutModalProps {
  isVisible: boolean;
  inventory: InventoryItem | null;
  onCancel: () => void;
  onSubmit: (values: { quantity: number; reason: string }) => void;
  confirmLoading: boolean;
}

export const StockOutModal: React.FC<StockOutModalProps> = ({
  isVisible,
  inventory,
  onCancel,
  onSubmit,
  confirmLoading,
}) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (isVisible) {
      form.resetFields();
    }
  }, [isVisible, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title="Xuất kho thủ công"
      open={isVisible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      okText="Xác nhận xuất"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#fafafa', borderRadius: 8 }}>
        <Text strong>Sản phẩm:</Text> {inventory?.productName} <br />
        <Text strong>Mã SP:</Text> {inventory?.productId} <br />
        <Text strong>Tồn kho hiện tại:</Text> <Text type="success">{inventory?.quantity} sản phẩm</Text>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="quantity"
          label="Số lượng cần xuất"
          rules={[
            { required: true, message: 'Vui lòng nhập số lượng' },
            { type: 'number', min: 1, message: 'Số lượng tối thiểu là 1' },
            { 
              type: 'number', 
              max: inventory?.quantity || 1, 
              message: `Số lượng xuất không được vượt quá tồn kho (${inventory?.quantity})` 
            }
          ]}
        >
          <InputNumber style={{ width: '100%' }} min={1} max={inventory?.quantity} placeholder="Nhập số lượng..." />
        </Form.Item>

        <Form.Item
          name="reason"
          label="Lý do xuất kho"
          rules={[
            { required: true, message: 'Vui lòng nhập lý do xuất kho' },
            { min: 5, message: 'Lý do quá ngắn' }
          ]}
        >
          <Input.TextArea rows={3} placeholder="Ví dụ: Xuất bảo hành, hao hụt, tiêu hủy..." />
        </Form.Item>
      </Form>
    </Modal>
  );
};
