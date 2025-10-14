// src/app/context/AuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '@/lib/services/auth.service';
import { LoginCredentials, User, AuthContextType } from '@/types/auth.types';
import { useRouter } from 'next/navigation';
import { getDashboardRoute, getCorrectRoute } from '@/lib/utils/role-routes';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.user) {
        // Convertir el formato de respuesta al formato del contexto
        const user = {
          ...response.user,
          role: response.user.roles[0] || 'user' // Tomar el primer rol o usar 'user' por defecto
        };
        setUser(user);
        // Redirigir al dashboard correspondiente según el rol
        const dashboardRoute = getDashboardRoute(user.role);
        router.push(dashboardRoute);
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    router.push('/login');
  };

  /**
   * Navega a una ruta específica usando la versión correcta según el rol del usuario
   * @param routeName - Nombre de la ruta (ej: 'perfil', 'configuracion')
   * 
   * @example
   * navigateToRoute('perfil') 
   * // Si es ADMIN → navega a /admin/perfil
   * // Si es PROPIETARIO → navega a /perfil
   */
  const navigateToRoute = (routeName: string) => {
    if (!user) return;
    const correctRoute = getCorrectRoute(routeName, user.role);
    router.push(correctRoute);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        navigateToRoute,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}