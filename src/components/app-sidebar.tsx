"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare02Icon,
  House01Icon,
  Package01Icon,
  PresentationLineChart02Icon,
  File02Icon,
} from '@hugeicons/core-free-icons'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  // Sección: Inicio
  navInicio: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare02Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
      isActive: true,
    },
    {
      title: "Mi Casa",
      url: "/mi-casa",
      icon: <HugeiconsIcon icon={House01Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
      items: [
        {
          title: "Pagos y Multas",
          url: "/mi-casa/pagos-y-multas",
        },
        {
          title: "Miembros y Mascotas",
          url: "/mi-casa/miembros-hogar",
        },
      ],
    },
  ],
  // Sección: Comunidad
  navComunidad: [
    {
      title: "Reservas",
      url: "/reservas",
      icon: <HugeiconsIcon icon={Package01Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
    },
    {
      title: "Asamblea",
      url: "/asamblea",
      icon: <HugeiconsIcon icon={PresentationLineChart02Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [casaNumero, setCasaNumero] = useState<number | null>(null)

  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user')
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.idCasa) {
          setCasaNumero(user.idCasa)
        }
      }
    } catch {
      // Ignorar errores de parsing
    }
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg p-1" style={{ backgroundColor: '#1A4D3D' }}>
                  <Image
                    src="/logoFondo.svg"
                    alt="Flor Digital Logo"
                    width={24}
                    height={24}
                    className="rounded-sm"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Flor Digital</span>
                  <span className="truncate text-xs" suppressHydrationWarning>
                    {casaNumero ? `Casa N° ${casaNumero}` : 'Mi Residencia'}
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Sección: Inicio */}
        <NavMain items={data.navInicio} label="Inicio" />

        {/* Sección: Comunidad */}
        <NavMain items={data.navComunidad} label="Comunidad" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
