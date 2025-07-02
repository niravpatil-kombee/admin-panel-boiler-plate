import axios from 'axios';
import { refreshSessionAPI } from '../services/auth.api';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true, // Send cookies
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh-session if it's the initial auth check
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.headers['x-initial-auth'] !== 'true'
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('Attempting to refresh session...');
        await refreshSessionAPI();
        console.log('Session refreshed!');
        processQueue(null);
        return axiosInstance(originalRequest); // Retry original
      } catch (refreshError) {
        console.error('Refresh failed:', refreshError);
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
