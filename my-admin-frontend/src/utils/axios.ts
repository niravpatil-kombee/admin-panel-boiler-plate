import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true, // This is CRITICAL for sending/receiving session cookies
});

// 2. A flag to prevent multiple refresh calls from firing simultaneously
let isRefreshing = false;

// 3. A queue to hold requests that failed and are waiting for a new session
let failedQueue: {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}[] = [];

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

// 4. The Response Interceptor - This is where the magic happens
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // First, check if this is the special initial auth call.
    // If our custom header is present, we should not attempt to refresh.
    // We just reject the promise immediately.
    if (
      error.response?.status === 401 &&
      originalRequest.headers["X-No-Retry-On-401"] === "true"
    ) {
      return Promise.reject(error);
    }

    // This is the existing logic for all *other* 401 errors
    if (error.response?.status === 401 && !originalRequest._retry) {
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
        await axiosInstance.post("/refresh-session");
        processQueue(null, null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Session refresh failed:", refreshError);
        processQueue(refreshError, null);
        // Redirect to login page
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
