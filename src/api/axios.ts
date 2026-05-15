import axios from 'axios';
import BASE_URL from './config';
import { toast } from 'react-hot-toast';

const api = axios.create({
  baseURL: BASE_URL,
});

// ─── Request Interceptor: Attach JWT ────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Global Error Handling ─────────────────────────────
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message || error.message || 'Something went wrong';

    if (status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (status === 403) {
      toast.error('You do not have permission to do this.');
    } else if (status === 404) {
      // Silent — handled by caller
    } else if (status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (status >= 400) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;
