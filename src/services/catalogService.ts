import axiosClient from '../api/axiosClient';
import type { Product } from '../utils/mockData'; // Đang mượn tạm Type từ file mock, sau này bạn nên tách Type ra folder riêng

export const catalogService = {
  // Lấy danh sách sản phẩm
  getProducts: async (): Promise<Product[]> => {
    const url = '/api/Product'; 
    return axiosClient.get(url);
  },

  // Lấy chi tiết 1 sản phẩm
  getProductById: async (id: string): Promise<Product> => {
    const url = `/api/Product/${id}`;
    return axiosClient.get(url);
  },

  // Thêm mới sản phẩm
  createProduct: async (data: Partial<Product>): Promise<Product> => {
    const url = '/api/Product';
    return axiosClient.post(url, data);
  },

  // Cập nhật sản phẩm
  updateProduct: async (id: string, data: Partial<Product>): Promise<Product> => {
    const url = `/api/Product/${id}`;
    return axiosClient.put(url, data);
  },

  // Xóa sản phẩm
  deleteProduct: async (id: string): Promise<void> => {
    const url = `/api/Product/${id}`;
    return axiosClient.delete(url);
  }
};
