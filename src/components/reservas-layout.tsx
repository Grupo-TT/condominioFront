'use client'

import { ReactNode } from 'react'
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

interface ReservasLayoutProps {
  children: ReactNode
}

export function ReservasLayout({ children }: ReservasLayoutProps) {
  return (
    <div className="absolute inset-0 flex flex-col">
      {/* Header con breadcrumbs */}
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

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        {/* Header con título y descripción */}
        <div className="shrink-0 px-6 pt-6 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Reservas</h1>
            <p className="text-gray-500 mt-1">
              Gestiona las reservas de espacios comunes y recursos del condominio.
            </p>
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}

