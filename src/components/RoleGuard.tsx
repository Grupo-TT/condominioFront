// src/app/components/RoleGuard.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: string[];
  fallbackPath?: string;
}

export default function RoleGuard({ 
  children, 
  allowedRoles,
  fallbackPath = '/dashboard'
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (!allowedRoles.includes(user.role)) {
        router.push(fallbackPath);
      }
    }
  }, [user, isLoading, allowedRoles, fallbackPath, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Acceso Denegado</AlertTitle>
          <AlertDescription>
            No tienes permisos para acceder a esta página.
            Tu rol: <strong>{user.role}</strong>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}