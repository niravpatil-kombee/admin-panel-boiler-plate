import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true // Always send cookies for session-based auth
});

export default axiosInstance;