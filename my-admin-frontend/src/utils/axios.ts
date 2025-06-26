import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api', // Your backend API URL
});

// Interceptor to add the auth token to every request
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default axiosInstance;