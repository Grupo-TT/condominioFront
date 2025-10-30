// src/lib/config/axios.config.ts
import axios from 'axios';
import { authService } from '../services/auth.service';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

/**
 * Cliente Axios para llamadas al backend
 * 
 * ⚠️ IMPORTANTE: Con HttpOnly cookies, este cliente ya NO es necesario
 * para autenticación desde el cliente. Todas las llamadas autenticadas
 * deben pasar por API Routes de Next.js que manejan las cookies.
 * 
 * Este cliente se mantiene para llamadas públicas o para usar desde
 * API Routes (server-side).
 */
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor de REQUEST: adjunta el token si existe
apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Cliente Axios para llamadas a nuestras propias API Routes
 * Incluye credenciales (cookies) automáticamente
 */
export const internalApiClient = axios.create({
  baseURL: '/', // Rutas relativas a nuestro dominio
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ⭐ Incluir cookies en las peticiones
});

// Interceptor de RESPONSE: maneja sesión expirada
internalApiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Si la sesión expiró, cerrar sesión y redirigir a login
      await authService.logout();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default apiClient;