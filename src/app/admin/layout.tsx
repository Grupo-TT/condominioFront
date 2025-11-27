// src/app/admin/layout.tsx
'use client';

import { AdminSidebar } from "@/components/admin-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { CasaProvider } from "@/contexts/CasaContext"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CasaProvider>
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset className="overflow-hidden">
          {children}
        </SidebarInset>
      </SidebarProvider>
    </CasaProvider>
  )
}
