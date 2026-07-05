import axios from 'axios';
import { useAdminAuthStore } from '../stores/adminAuth';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor: Attach accessToken
api.interceptors.request.use((config) => {
  const adminAuth = useAdminAuthStore();
  const token = adminAuth.accessToken || localStorage.getItem('accessToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Flag to avoid multiple refresh calls at once
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Handle 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const adminAuth = useAdminAuthStore();
    const originalRequest = error.config;

    // If token expired and we have refreshToken → try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (adminAuth.refreshToken || localStorage.getItem('refreshToken')) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers['Authorization'] = 'Bearer ' + token;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(`${API_BASE}/api/admin/refresh`, {
            refreshToken: adminAuth.refreshToken || localStorage.getItem('refreshToken'),
          });

          if (!data.accessToken) {
            throw new Error('Refresh failed: no accessToken returned');
          }

          // Save new tokens
          adminAuth.loginAdmin({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken || adminAuth.refreshToken,
            user: data.user || adminAuth.adminUser,
          });

          processQueue(null, data.accessToken);
          originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          adminAuth.logoutAdmin();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export { api, API_BASE };
