import axios from 'axios';

const API_URL = 'http://localhost:5000/api/customer-addresses';

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const accountService = {
  getAddresses: async () => {
    const response = await axios.get(API_URL, getHeaders());
    return response.data;
  },

  createAddress: async (data: any) => {
    const response = await axios.post(API_URL, data, getHeaders());
    return response.data;
  },

  updateAddress: async (id: string, data: any) => {
    const response = await axios.put(`${API_URL}/${id}`, data, getHeaders());
    return response.data;
  },

  deleteAddress: async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`, getHeaders());
    return response.data;
  },

  setDefaultAddress: async (id: string) => {
    const response = await axios.put(`${API_URL}/${id}/default`, {}, getHeaders());
    return response.data;
  }
};
