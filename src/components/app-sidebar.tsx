"use client"

import * as React from "react"
import {
  Building2,
  Home,
  Wallet,
  Package,
  Users,
  FileText,
  Megaphone,
} from "lucide-react"

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
  user: {
    name: "Propietario",
    email: "propietario@flordigital.com",
    avatar: "",
  },
  // Sección: Inicio
  navInicio: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Casas",
      url: "/casas",
      icon: Building2,
    },
  ],
  // Sección: Finanzas
  navFinanzas: [
    {
      title: "Tesorería",
      url: "/tesoreria",
      icon: Wallet,
      items: [
        {
          title: "Cuotas",
          url: "/tesoreria/cuotas",
        },
        {
          title: "Movimientos",
          url: "/tesoreria/movimientos",
        },
        {
          title: "Multas",
          url: "/tesoreria/multas",
        },
      ],
    },
  ],
  // Sección: Comunidad
  navComunidad: [
    {
      title: "Bienes Comunes",
      url: "/bienes-comunes",
      icon: Package,
    },
    {
      title: "Asamblea",
      url: "/asamblea",
      icon: Users,
    },
    {
      title: "Solicitudes",
      url: "/solicitudes",
      icon: FileText,
    },
    {
      title: "Comunicados",
      url: "/comunicados",
      icon: Megaphone,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Flor Digital</span>
                  <span className="truncate text-xs">Mi Residencia</span>
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

