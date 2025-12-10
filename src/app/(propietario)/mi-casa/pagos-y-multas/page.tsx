'use client'

import { Separator } from '@/components/ui/separator'

import { useState, useEffect } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { FinanzasSection } from '@/components/FinanzasSection'
import { FinanzasCards, FinanzasCardsSkeleton } from '@/components/FinanzasCards'
import { useObligacionesCasa } from '@/hooks/useFinanzas'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function FinanzasPage() {
  useDocumentTitle('Pagos y Multas | Flor Digital');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);

  useEffect(() => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        setUser(JSON.parse(userStr));
      }
    } catch (e) {
      console.error("Error parsing user from localStorage", e);
    } finally {
      setIsCheckingUser(false);
    }
  }, []);

  const casaNumero = user?.idCasa;
  const { data, loading, error } = useObligacionesCasa(casaNumero);

  const showSkeleton = isCheckingUser || loading;

  if (!casaNumero && !showSkeleton) return <p className="px-6 py-6 text-red-500">No se encontró información del usuario.</p>;
  if (error) return <p className="px-6 py-6 text-red-500">{error}</p>;
  if (!data && !showSkeleton) return <p className="px-6 py-6 text-red-500">No se pudo cargar la información.</p>;

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">
                  Dashboard Propietario
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <span className="text-muted-foreground">Mi Casa</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Pagos y Multas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col overflow-x-hidden">
        <div className="flex flex-1 flex-col gap-4 px-6 pt-6 pb-0 overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pagos y Multas</h1>
              <p className="text-gray-500 mt-1">
                Revisa tu saldo pendiente, tus pagos y las multas asociadas a tu propiedad.
              </p>
            </div>
          </div>

          {/* Tarjetas de finanzas */}
          {showSkeleton ? (
            <FinanzasCardsSkeleton />
          ) : (
            <FinanzasCards
              saldoPendiente={data.saldoPendienteTotal}
              obligacionesPendientesCount={data.obligacionesPendientesCount}
              fechaUltimoPago={data.ultimoPago}
              multasPendientesCount={data.multasPendientesCount}
            />
          )}

          {/* Sección de Finanzas */}
          <FinanzasSection
            obligaciones={data?.obligaciones}
            multas={data?.multas}
            loading={showSkeleton}
          />
        </div>
      </div>
    </>
  )
}
