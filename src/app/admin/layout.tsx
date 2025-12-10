// src/app/admin/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { CasaProvider } from "@/contexts/CasaContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si terminó de cargar y el usuario NO es ADMIN, redirigir
    const role = user?.role?.toUpperCase();
    if (!isLoading && role && role !== 'ADMIN') {
      toast.warning('Acceso denegado', {
        description: 'No tienes permisos para acceder a las páginas de administrador.',
      });
      router.replace('/dashboard');
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

  // Si no es admin, no renderizar nada (está siendo redirigido)
  const role = user?.role?.toUpperCase();
  if (role && role !== 'ADMIN') {
    return null;
  }

  return (
    <CasaProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </CasaProvider>
  )
}
