import axiosClient from '../api/axiosClient';
import type { Warehouse } from '../types'; 

export const warehouseService = {
  // Kho bãi
  getWarehouses: async (): Promise<Warehouse[]> => {
    return axiosClient.get('/api/Warehouse');
  },

  getWarehouseById: async (id: string): Promise<Warehouse> => {
    return axiosClient.get(`/api/Warehouse/${id}`);
  },

  createWarehouse: async (data: Partial<Warehouse>): Promise<Warehouse> => {
    return axiosClient.post('/api/Warehouse', data);
  },

  updateWarehouse: async (id: string, data: Partial<Warehouse>): Promise<Warehouse> => {
    return axiosClient.put(`/api/Warehouse/${id}`, data);
  },

  deleteWarehouse: async (id: string): Promise<void> => {
    return axiosClient.delete(`/api/Warehouse/${id}`);
  },

  getOrderReservations: async (orderId: string): Promise<any[]> => {
    return axiosClient.get(`/api/Warehouse/reservations/order/${orderId}`);
  },

  // Tồn kho
  addInventory: async (warehouseId: string, data: { productId: string; quantity: number }): Promise<void> => {
    return axiosClient.post(`/api/Warehouse/${warehouseId}/inventory`, data);
  },

  directStockOut: async (warehouseId: string, data: { productId: string; quantity: number; reason: string }): Promise<void> => {
    return axiosClient.post(`/api/Warehouse/${warehouseId}/stock-out`, data);
  },

  transferInventory: async (warehouseId: string, data: { toWarehouseId: string; productId: string; quantity: number }): Promise<void> => {
    return axiosClient.post(`/api/Warehouse/${warehouseId}/transfer`, data);
  }
};
