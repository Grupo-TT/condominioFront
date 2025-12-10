"use client"

import { useState, useEffect } from "react"
import {
  Settings,
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"

// Función para leer usuario de localStorage de forma segura
function getUserFromStorage(): { nombre: string; email: string } | null {
  if (typeof window === 'undefined') return null
  try {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      return { nombre: user.nombre, email: user.email }
    }
  } catch {
    // Ignorar errores de parsing
  }
  return null
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user, logout, navigateToRoute } = useAuth()

  // Leer del localStorage inmediatamente
  const [cachedUser, setCachedUser] = useState<{ nombre: string; email: string } | null>(null)

  useEffect(() => {
    const storedUser = getUserFromStorage()
    if (storedUser) {
      setCachedUser(storedUser)
    }
  }, [])

  // Usar datos del contexto si están disponibles, sino usar los cacheados
  const displayUser = user || cachedUser
  const userName = displayUser?.nombre || ""
  const userEmail = displayUser?.email || ""
  const userInitials = userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : ""

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt={userName} />
                <AvatarFallback className="rounded-lg" suppressHydrationWarning>
                  {userInitials || ""}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight" suppressHydrationWarning>
                <span className="truncate font-medium" suppressHydrationWarning>{userName}</span>
                <span className="truncate text-xs" suppressHydrationWarning>{userEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src="" alt={userName} />
                  <AvatarFallback className="rounded-lg" suppressHydrationWarning>
                    {userInitials || ""}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight" suppressHydrationWarning>
                  <span className="truncate font-medium" suppressHydrationWarning>{userName}</span>
                  <span className="truncate text-xs" suppressHydrationWarning>{userEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigateToRoute('configuracion')}>
                <Settings />
                Configuración
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
