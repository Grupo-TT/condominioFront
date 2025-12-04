'use client'

import { Separator } from '@/components/ui/separator'
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
import { FinanzasCards } from '@/components/FinanzasCards'
import { useObligacionesCasa } from '@/hooks/useFinanzas'

export default function FinanzasPage() {
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const casaNumero = user.idCasa;
  const { data, loading } = useObligacionesCasa(casaNumero);

  if (loading) return <p className="px-6 py-6">Cargando...</p>;

  if (!data) return <p className="px-6 py-6 text-red-500">No se pudo cargar la información.</p>;

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
          <FinanzasCards
            saldoPendiente={data.saldoPendienteTotal}
            obligacionesPendientesCount={data.obligacionesPendientesCount}
            fechaUltimoPago={data.ultimoPago}
            multasPendientesCount={data.multasPendientesCount}
          />

          {/* Sección de Finanzas */}
          <FinanzasSection 
            obligaciones ={data.obligaciones}
            multas = {data.multas}/>
        </div>
      </div>
    </>
  )
}

