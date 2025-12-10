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
import { MiembrosTab } from '@/components/MiembrosTab'
import { MascotasTab } from '@/components/MascotasTab'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function HogarPage() {
  useDocumentTitle('Miembros y Mascotas | Flor Digital');

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
                <BreadcrumbPage>Miembros y Mascotas</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold text-gray-900">Miembros y Mascotas</h1>
              <p className="text-gray-500 mt-1">
                Gestiona la información de las personas y mascotas registradas en tu vivienda.
              </p>
            </div>
          </div>

          {/* Sección de Miembros */}
          <div className="space-y-6">
            <MiembrosTab />

            {/* Separador */}
            <div className="border-t border-gray-200 my-6"></div>

            {/* Sección de Mascotas */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Mascotas</h2>
              <MascotasTab />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

