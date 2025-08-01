import axios from "axios";

const instance  = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // This is for sending/receiving session cookies
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Maybe auto logout, redirect, or show alert
      console.warn("Unauthorized – Redirecting to login");
    }
    return Promise.reject(error);
  }
);

export default instance ;
