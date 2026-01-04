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
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  OwnerInfoCard,
  AccountStatusCard,
  MembersCard,
  ReservationsCard,
} from "@/components/owner-dashboard"
import { useDashboardProp } from '@/hooks/useDashboardProp';

// Skeleton for OwnerInfoCard
function OwnerInfoCardSkeleton() {
  return (
    <Card
      className="relative overflow-hidden border-0 rounded-2xl py-0"
      style={{
        background: 'radial-gradient(ellipse at 20% 30%, #ffffff 0%, #fafaf5 20%, #f0f4e8 40%, #e5ede5 60%, #dce8dc 80%, #d4e2d4 100%)',
        width: '100%',
        maxWidth: '780px'
      }}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          <Skeleton className="h-10 w-40 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 flex-1 rounded-2xl" />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

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

  const {
    membersData,
    ownerInfo,
    accountStatus,
    reservations,
    loadingMembers,
    loadingOwnerInfo,
    loadingAccountStatus,
    loadingReservations,
    setIdCasa,
  } = useDashboardProp();

  // Set idCasa from user context when available
  useEffect(() => {
    if (user?.idCasa) {
      setIdCasa(user.idCasa);
    }
  }, [user?.idCasa, setIdCasa]);

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
            {loadingOwnerInfo ? (
              <OwnerInfoCardSkeleton />
            ) : (
              <OwnerInfoCard
                userName={user?.nombre || 'Usuario'}
                userEmail={user?.email || ''}
                numeroCasa={ownerInfo?.numeroCasa || '-'}
                uso={ownerInfo?.tipoUso || '-'}
                membersCount={ownerInfo?.cantidadMiembros || membersData.length}
                mascotasCount={ownerInfo?.cantidadMascotas || 0}
              />
            )}
            <AccountStatusCard
              saldoPendiente={accountStatus?.saldoPendiente || '$0'}
              estadoCasa={accountStatus?.estadoCasa || 'AL_DIA'}
              ultimoPago={accountStatus?.ultimoPago || null}
              loading={loadingAccountStatus}
            />
          </div>

          {/* Second Row - Members, Reservations, Requests */}
          <div className="flex flex-wrap gap-6">
            <MembersCard members={membersData} loading={loadingMembers} />
            <ReservationsCard reservations={reservations} loading={loadingReservations} />
            {/* TODO: Habilitar cuando se implemente la funcionalidad de solicitudes
            <RequestsCard solicitudes={solicitudes} loading={loadingSolicitudes} />
            */}
          </div>
        </div>
      </div>
    </>
  );
}
