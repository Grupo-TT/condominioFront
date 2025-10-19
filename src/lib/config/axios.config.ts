// src/lib/config/axios.config.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { authService } from '../services/auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

console.log('🧭 API_URL actual:', process.env.NEXT_PUBLIC_API_URL)
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de REQUEST: agrega el token a cada petición
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de RESPONSE: maneja token expirado
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si el token expiró, simplemente cerrar sesión y redirigir a login
      // No intentar renovar automáticamente
      authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;