// src/lib/services/auth.service.ts
import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface LoginCredentials {
  correoElectronico: string;
  contrasenia: string;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    role: string;
  };
}


class AuthService {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/login`,
        credentials
      );
      
      if (response.data.token) {
        Cookies.set('access_token', response.data.token, {
          expires: 1,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });

        if (response.data.refreshToken) {
          Cookies.set('refresh_token', response.data.refreshToken, {
            expires: 7,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          });
        }

        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // Guardar el rol en cookie para que el middleware pueda acceder a él
          Cookies.set('user_role', response.data.user.role, {
            expires: 1,
            sameSite: 'strict',
            secure: process.env.NODE_ENV === 'production'
          });
        }
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || 'Error al iniciar sesión'
        );
      }
      throw error;
    }
  }

  logout() {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_role');
    localStorage.removeItem('user');
  }

  getToken(): string | undefined {
    return Cookies.get('access_token');
  }

  getRefreshToken(): string | undefined {
    return Cookies.get('refresh_token');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();