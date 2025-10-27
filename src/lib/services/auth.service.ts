// src/lib/services/auth.service.ts
import axios from 'axios';
import Cookies from 'js-cookie';
import { LoginCredentials, LoginResponse } from '@/types/auth.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Servicio de autenticación
 * 
 * ✅ Con HTTPS habilitado:
 * - Flag Secure: Las cookies solo se transmiten por HTTPS
 * - Protección contra interceptación man-in-the-middle
 */
class AuthService {
  /**
   * Inicia sesión con las credenciales proporcionadas
   * @param credentials - Usuario, contraseña y opción de recordar sesión
   * @returns Promise con la respuesta del login
   */
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login`,
        credentials
      );
      
      if (response.data.token) {
        const rememberMe = credentials.rememberMe || false;
        
        // Configurar cookies con flag Secure para HTTPS
        const cookieOptions = {
          sameSite: 'strict' as const,
          secure: process.env.NODE_ENV === 'production'  // ⭐ Solo HTTPS en producción
        };
        
        if (rememberMe) {
          // Con "Recordarme": guardar refreshToken con expiración de 7 días
          if (response.data.refreshToken) {
            Cookies.set('refresh_token', response.data.refreshToken, {
              ...cookieOptions,
              expires: 7  // 7 días
            });
          }
          
          // También guardar el access_token con expiración para que persista
          Cookies.set('access_token', response.data.token, {
            ...cookieOptions,
            expires: 7  // 7 días
          });
        } else {
          // Sin "Recordarme": solo guardar access_token como session cookie
          Cookies.set('access_token', response.data.token, cookieOptions);
        }

        if (response.data.user) {
          // Crear objeto user con la estructura esperada (tomar primer rol)
          const userData = {
            email: response.data.user.email,
            nombre: response.data.user.nombre,
            role: response.data.user.roles[0] // Tomar el primer rol
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          
          // Guardar el rol en cookie con la misma configuración
          const roleOptions = rememberMe
            ? { ...cookieOptions, expires: 7 }
            : cookieOptions;
          
          Cookies.set('user_role', userData.role, roleOptions);
        }
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           `Error al iniciar sesión (${error.response?.status})`;
        throw new Error(errorMessage);
      }
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario
   * Elimina tokens y datos de usuario almacenados
   */
  logout() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_role');
    localStorage.removeItem('user');
  }

  /**
   * Obtiene el token de acceso actual
   * @returns Token de acceso o undefined si no existe
   */
  getToken(): string | undefined {
    return Cookies.get('access_token');
  }

  /**
   * Obtiene el refresh token actual
   * @returns Refresh token o undefined si no existe
   */
  getRefreshToken(): string | undefined {
    return Cookies.get('refresh_token');
  }

  /**
   * Obtiene los datos del usuario actual desde localStorage
   * @returns Datos del usuario o null si no existe
   */
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Verifica si el usuario está autenticado
   * @returns true si existe un token de acceso válido
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();