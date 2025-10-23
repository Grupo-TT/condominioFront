'use client'

import { useState, useMemo } from 'react'
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
import { CalendarProvider } from '@/calendar/contexts/calendar-context'
import { ClientContainer } from '@/calendar/components/client-container'
import { ReservasList } from '@/components/reservas-list'
import { PROPIETARIOS_MOCK, RESERVAS_MOCK } from '@/data/reservas.mock'
import { addColorToReservas } from '@/utils/reservas-utils'
import type { TCalendarView } from '@/calendar/types'

export default function ReservasPage() {
  const [currentView, setCurrentView] = useState<TCalendarView>('month')

  // Aplicar colores dinámicamente según el tipo de recurso
  const reservasConColor = useMemo(() => addColorToReservas(RESERVAS_MOCK), [])

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
                <BreadcrumbLink href="/admin/dashboard">
                  Dashboard Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/bienes-comunes">
                  Bienes Comunes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Reservas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Contenido con padding */}
        <div className="flex flex-1 flex-col gap-6 p-6 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
              <p className="text-gray-500 mt-1">
                Gestiona las reservas de espacios comunes y recursos del condominio.
              </p>
            </div>
          </div>

          {/* Layout de dos columnas: Calendario + Lista de Reservas */}
          <CalendarProvider users={PROPIETARIOS_MOCK} events={reservasConColor}>
            <div className="flex flex-col xl:flex-row gap-6 overflow-hidden min-h-0" style={{ height: 'calc(100vh - 210px)', maxHeight: '875px' }}>
              {/* Calendario de Reservas */}
              <div className="flex-1 min-w-0 max-w-full xl:max-w-[calc(100%-444px)]">
                <ClientContainer view={currentView} onViewChange={setCurrentView} />
              </div>

              {/* Lista de Reservas */}
              <div className="border rounded-xl p-4 bg-white overflow-hidden flex flex-col xl:w-[420px] xl:flex-shrink-0">
                <ReservasList reservas={reservasConColor} />
              </div>
            </div>
          </CalendarProvider>
        </div>
      </div>
    </>
  )
}
