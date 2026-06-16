import axios from 'axios';

const API_URL = 'http://localhost:5000/api/Auth';

export const authService = {
  signUp: async (data: any) => {
    const response = await axios.post(`${API_URL}/signup`, data);
    return response.data;
  },

  signIn: async (data: any) => {
    const response = await axios.post(`${API_URL}/signin`, data);
    return response.data;
  },

  verifyOtp: async (data: { accountId: string; otp: string }) => {
    const response = await axios.post(`${API_URL}/verify-otp`, data);
    return response.data;
  },

  resendOtp: async (accountId: string) => {
    const response = await axios.post(`${API_URL}/resend-otp?accountId=${accountId}`);
    return response.data;
  },

  signOut: async (refreshToken: string) => {
    const response = await axios.post(`${API_URL}/signout?refreshToken=${refreshToken}`);
    return response.data;
  }
};
