import axiosClient from '../api/axiosClient';

export interface OrderItemPayload {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  paymentMethod: string;
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  items: OrderItemPayload[];
}

export const orderService = {
  createOrder: async (data: CreateOrderPayload): Promise<any> => {
    return axiosClient.post('/api/Order', data);
  },
  
  getOrders: async (): Promise<any[]> => {
    return axiosClient.get('/api/Order');
  },
  
  getOrderById: async (id: string): Promise<any> => {
    return axiosClient.get(`/api/Order/${id}`);
  },

  getOrderHistory: async (id: string): Promise<any> => {
    return axiosClient.get(`/api/Order/${id}/history`);
  },

  getOrderHistoryByAccount: async (): Promise<any[]> => {
    return axiosClient.get(`/api/Order/account`);
  },

  retryPayment: async (id: string): Promise<any> => {
    return axiosClient.post(`/api/Order/${id}/retry-payment`);
  },

  cancelOrder: async (id: string): Promise<any> => {
    return axiosClient.post(`/api/Order/${id}/cancel`);
  },

  updateOrderStatus: async (id: string, status: string): Promise<any> => {
    return axiosClient.put(`/api/Order/${id}/status`, { status });
  }
};
