"use client"

import * as React from "react"
import Image from "next/image"
import { HugeiconsIcon } from '@hugeicons/react'
import {
  DashboardSquare02Icon,
  House01Icon,
  MoneySafeIcon,
  Package01Icon,
  PresentationLineChart02Icon,
  File02Icon,
  Megaphone03Icon,
} from '@hugeicons/core-free-icons'

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"

const data = {
  // Sección: Inicio
  navInicio: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: <HugeiconsIcon icon={DashboardSquare02Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
      isActive: true,
    },
    {
      title: "Casas",
      url: "/admin/casas",
      icon: <HugeiconsIcon icon={House01Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
    },
  ],
  // Sección: Finanzas
  navFinanzas: [
    {
      title: "Tesorería",
      url: "/admin/tesoreria",
      icon: <HugeiconsIcon icon={MoneySafeIcon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
      items: [
        {
          title: "Cuotas",
          url: "/admin/cuotas",
        },
        {
          title: "Movimientos",
          url: "/admin/movimientos",
        },
        {
          title: "Multas",
          url: "/admin/multas",
        },
      ],
    },
  ],
  // Sección: Comunidad
  navComunidad: [
    {
      title: "Bienes Comunes",
      url: "/admin/bienes-comunes",
      icon: <HugeiconsIcon icon={Package01Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
      items: [
        {
          title: "Reservas",
          url: "/admin/bienes-comunes/reservas",
        },
        {
          title: "Recursos",
          url: "/admin/bienes-comunes/recursos",
        },
      ],
    },
    {
      title: "Asamblea",
      url: "/admin/asamblea",
      icon: <HugeiconsIcon icon={PresentationLineChart02Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
    },
    {
      title: "Comunicados",
      url: "/admin/comunicados",
      icon: <HugeiconsIcon icon={Megaphone03Icon} size={18} strokeWidth={1.8} style={{ width: 18, height: 18 }} />,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin/dashboard">
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
                  <span className="truncate text-xs">Administración</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Sección: Inicio */}
        <NavMain items={data.navInicio} label="Inicio" />

        {/* Sección: Finanzas */}
        <NavMain items={data.navFinanzas} label="Finanzas" />

        {/* Sección: Comunidad */}
        <NavMain items={data.navComunidad} label="Comunidad" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}

