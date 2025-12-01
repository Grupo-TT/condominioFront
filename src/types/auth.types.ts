// src/types/auth.types.ts

/**
 * Credenciales para el login
 */
export interface LoginCredentials {
  username: string;
  password: string;
  rememberMe?: boolean;
}

/**
 * Respuesta del endpoint de login
 */
export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    email: string;
    nombre: string;
    roles: string[];
    idCasa: number;
    idPersona: number;
  };
}

/**
 * Usuario autenticado en el contexto de la aplicación
 */
export interface User {
  email: string;
  nombre: string;
  role: string;
  idCasa: number;
  idPersona: number;
}

/**
 * Contexto de autenticación
 */
export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  navigateToRoute: (routeName: string) => void;
}
