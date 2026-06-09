import axiosClient from '../api/axiosClient';

export interface OrderItemPayload {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderPayload {
  paymentMethod: string;
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
  }
};
