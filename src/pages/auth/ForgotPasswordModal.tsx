import React, { useState } from 'react';
import { Modal, Form, Input, Button, Typography, message, Steps } from 'antd';
import { MailOutlined, KeyOutlined, LockOutlined } from '@ant-design/icons';
import { authService } from '../../services/authService';

const { Title, Text } = Typography;

interface ForgotPasswordModalProps {
  visible: boolean;
  onCancel: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ visible, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [accountId, setAccountId] = useState('');

  const [formEmail] = Form.useForm();
  const [formOtp] = Form.useForm();
  const [formPassword] = Form.useForm();

  const handleSendEmail = async (values: any) => {
    try {
      setLoading(true);
      const res = await authService.resetPasswordRequest(values.email);
      if (res.isSuccess) {
        message.success('Mã xác thực đã được gửi đến email của bạn!');
        setEmail(values.email);
        setAccountId(res.data); // data is accountId
        setCurrentStep(1);
      } else {
        message.error(res.message || 'Không thể gửi yêu cầu');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi kết nối đến máy chủ');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (values: any) => {
    try {
      setLoading(true);
      const res = await authService.verifyResetOtp({ accountId, otp: values.otp });
      if (res.isSuccess) {
        message.success('Xác thực thành công! Vui lòng đặt mật khẩu mới.');
        setCurrentStep(2);
      } else {
        message.error(res.message || 'Mã xác thực không hợp lệ');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi xác thực');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: any) => {
    try {
      setLoading(true);
      const res = await authService.resetPassword({ accountId, password: values.password });
      if (res.isSuccess) {
        message.success('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập bằng mật khẩu mới.');
        resetAndClose();
      } else {
        message.error(res.message || 'Không thể đặt lại mật khẩu');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setCurrentStep(0);
    setEmail('');
    setAccountId('');
    formEmail.resetFields();
    formOtp.resetFields();
    formPassword.resetFields();
    onCancel();
  };

  const handleResendOtp = async () => {
    try {
      setLoading(true);
      const res = await authService.resendResetOtp(accountId);
      if (res.isSuccess) {
        message.success('Gửi lại mã xác thực!');
      } else {
        message.error(res.message || 'Không thể gửi lại mã');
      }
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Quên mật khẩu"
      open={visible}
      onCancel={resetAndClose}
      footer={null}
      destroyOnClose
    >
      <Steps
        current={currentStep}
        items={[
          { title: 'Email' },
          { title: 'Xác thực' },
          { title: 'Mật khẩu mới' }
        ]}
        style={{ marginBottom: 24 }}
      />

      {currentStep === 0 && (
        <Form form={formEmail} layout="vertical" onFinish={handleSendEmail}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Vui lòng nhập email của bạn để nhận mã xác thực lấy lại mật khẩu.
          </Text>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập Email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Nhập email của bạn" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Gửi mã xác thực
          </Button>
        </Form>
      )}

      {currentStep === 1 && (
        <Form form={formOtp} layout="vertical" onFinish={handleVerifyOtp}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Mã xác thực gồm 6 chữ số đã được gửi đến <b>{email}</b>.
          </Text>
          <Form.Item
            name="otp"
            rules={[
              { required: true, message: 'Vui lòng nhập mã OTP!' },
              { len: 6, message: 'Mã OTP phải có 6 chữ số!' }
            ]}
          >
            <Input prefix={<KeyOutlined />} placeholder="Nhập mã OTP (6 số)" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large" style={{ marginBottom: 8 }}>
            Xác thực
          </Button>
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Chưa nhận được mã? </Text>
            <a onClick={handleResendOtp} style={{ pointerEvents: loading ? 'none' : 'auto' }}>Gửi lại</a>
          </div>
        </Form>
      )}

      {currentStep === 2 && (
        <Form form={formPassword} layout="vertical" onFinish={handleResetPassword}>
          <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
            Vui lòng nhập mật khẩu mới cho tài khoản của bạn.
          </Text>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" size="large" />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block size="large">
            Đổi mật khẩu
          </Button>
        </Form>
      )}
    </Modal>
  );
};
