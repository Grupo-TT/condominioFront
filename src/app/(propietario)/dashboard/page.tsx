'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { toast } from 'sonner';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  OwnerInfoCard,
  AccountStatusCard,
  MembersCard,
  ReservationsCard,
  RequestsCard,
} from "@/components/owner-dashboard"
import { useDashboardProp } from '@/hooks/useDashboardProp';

// Datos de ejemplo
const ownerData = {
  numeroCasa: "A-15",
  uso: "Residencial",
  mascotas: 2,
  multasActivas: 1,
  nombreCompleto: "Juan Carlos Pérez González",
  email: "jcperez@email.com",
  saldoActual: "$2,450.00",
  ultimoPago: "$850.00",
  conceptoUltimoPago: "Pago de administración Mayo 2025",
  fechaUltimoPago: "15 Nov 2024",
  proximoPago: "$850.00",
  fechaProximoPago: "15 Dic 2024",
  estadoCuenta: "Al día"
};

export default function PropietarioDashboard() {
  useDocumentTitle('Dashboard | Flor Digital');

  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Detectar si fue redirigido por falta de permisos
  useEffect(() => {
    const accessDenied = searchParams.get('access_denied');
    if (accessDenied === 'admin') {
      toast.warning('Acceso denegado', {
        description: 'No tienes permisos para acceder a las páginas de administrador.',
      });
      // Limpiar el parámetro de la URL sin recargar
      router.replace('/dashboard', { scroll: false });
    }
  }, [searchParams, router]);
  const { membersData } = useDashboardProp();

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inicio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4 p-6">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              ¡Bienvenido de vuelta, Propietario!
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Gestiona tu propiedad, miembros del hogar, pagos y solicitudes desde un solo lugar.
            </p>
          </div>

          {/* First Row - Owner Info and Account Status */}
          <div className="flex flex-wrap gap-6">
            <OwnerInfoCard
              userName={user?.nombre || ownerData.nombreCompleto}
              userEmail={user?.email || ownerData.email}
              numeroCasa={ownerData.numeroCasa}
              uso={ownerData.uso}
              membersCount={membersData.length}
              mascotasCount={ownerData.mascotas}
            />
            <AccountStatusCard
              saldoActual={ownerData.saldoActual}
              ultimoPago={ownerData.ultimoPago}
              conceptoUltimoPago={ownerData.conceptoUltimoPago}
              fechaUltimoPago={ownerData.fechaUltimoPago}
            />
          </div>

          {/* Second Row - Members, Reservations, Requests */}
          <div className="flex flex-wrap gap-6">
            <MembersCard members={membersData} />
            <ReservationsCard />
            {/* TODO: Habilitar cuando se implemente la funcionalidad de solicitudes
            <RequestsCard />
            */}
          </div>
        </div>
      </div>
    </>
  );
}
