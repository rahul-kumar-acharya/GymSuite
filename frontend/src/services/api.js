import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to inject JWT access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('gymsuite_access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for auto-refreshing expired tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('gymsuite_refresh_token');
      if (refreshToken) {
        try {
          const res = await axios.post(`${API_URL}/auth/refresh/`, { refresh: refreshToken });
          const newAccess = res.data.access;
          localStorage.setItem('gymsuite_access_token', newAccess);
          api.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
          return api(originalRequest);
        } catch (refreshErr) {
          localStorage.removeItem('gymsuite_access_token');
          localStorage.removeItem('gymsuite_refresh_token');
          localStorage.removeItem('gymsuite_user');
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
