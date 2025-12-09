// src/app/(propietario)/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AppSidebar } from "@/components/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function PropietarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si terminó de cargar y el usuario es ADMIN, redirigir
    if (!isLoading && user?.role?.toUpperCase() === 'ADMIN') {
      toast.warning('Acceso denegado', {
        description: 'Las páginas de propietarios no están disponibles para administradores.',
      });
      router.replace('/admin/dashboard');
    }
  }, [user, isLoading, router]);

  // Mostrar loading mientras verifica
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Si es admin, no renderizar nada (está siendo redirigido)
  if (user?.role?.toUpperCase() === 'ADMIN') {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-x-hidden">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
