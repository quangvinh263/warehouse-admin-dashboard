import axios from 'axios';

// Khởi tạo một instance của Axios
const axiosClient = axios.create({
  baseURL: 'http://localhost:5000', // Đổi thành Port của Ocelot API Gateway của bạn
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor cho REQUEST: Tự động đính kèm Token vào mọi request gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    // Lấy token từ localStorage (sau khi IdentityService đăng nhập thành công)
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor cho RESPONSE: Xử lý dữ liệu trả về hoặc bắt lỗi chung toàn hệ thống
axiosClient.interceptors.response.use(
  (response) => {
    // Hệ thống backend trả về { statusCode, data, message, ... }
    // Ta có thể bóc tách lấy `data` luôn ở đây cho tiện
    if (response.data && response.data.data) {
        return response.data.data;
    }
    return response.data;
  },
  (error) => {
    // Bắt lỗi 401 (Chưa đăng nhập hoặc Token hết hạn)
    if (error.response?.status === 401) {
      console.error('Lỗi 401: Token hết hạn hoặc không hợp lệ.');
      // Xóa token cũ
      localStorage.removeItem('accessToken');
      // Đá người dùng về trang đăng nhập
      // window.location.href = '/login'; 
    }
    
    // Bắt lỗi 403 (Không đủ quyền)
    if (error.response?.status === 403) {
      console.error('Lỗi 403: Không có quyền truy cập.');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
