'use client'

import { useEffect, useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { monthlyDataByYear, dashboardSummary, housesStatus, houseTypes } from "@/data/dashboard.mock"
import {
  MonthlyFinanceChart,
  MetricsCardsGrid,
  PropertyOverviewCard,
  HousesStatusChart,
  UpcomingAssemblies
} from "@/components/admin-dashboard"
import { useDashboardAdmin } from '@/hooks/useDashboardAdmin'

export default function Page() {
    const { fetchResumenFinancieroAnio, fetchResumenFinancieroMes } = useDashboardAdmin()
  const [selectedYear, setSelectedYear] = useState<number>(2025)
  const monthlyData = monthlyDataByYear[selectedYear]
  const [monthlyData2, setMonthlyData] = useState<any[]>([])
  const [monthSummary, setMonthSummary] = useState<any>({})

  useEffect(() => {
    const load = async () => {
        const yearData = await fetchResumenFinancieroAnio(selectedYear)
        const monthData = await fetchResumenFinancieroMes()

        console.log('Por Año:', yearData)
        console.log('Mes Actual:', monthData)

        setMonthlyData(yearData)
        setMonthSummary(monthData)
        console.log("🚀 ~ load ~ monthData:", monthData)
    }

    load()
}, [selectedYear])
  
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
              <BreadcrumbItem>
                <BreadcrumbPage>Inicio</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-4 p-6">
          {/* Title Section */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {(() => {
                const hour = new Date().getHours()
                if (hour >= 5 && hour < 12) return "Buenos días"
                if (hour >= 12 && hour < 19) return "Buenas tardes"
                return "Buenas noches"
              })()}, Administrador
            </h1>
            <p className="text-base text-gray-500 mt-1">
              Panel de control con métricas financieras, estado de propiedades y resumen de actividades del condominio.
            </p>
          </div>

          {/* Main Content - Chart and Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <MonthlyFinanceChart
              selectedYear={selectedYear}
              onYearChange={setSelectedYear}
              monthlyData={monthlyData2}
            />
            <MetricsCardsGrid summary={monthSummary} />
          </div>

          {/* Houses Status Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-0.5">
            {/* Left side - Properties Info */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Section Header */}
              <div className="pt-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Información General de Propiedades
                </h2>
                <p className="text-sm text-gray-500">
                  Resumen del estado de pagos y distribución de las propiedades del condominio
                </p>
              </div>

              {/* Cards Container */}
              <div className="flex gap-6">
                <PropertyOverviewCard houseTypes={houseTypes} />
                <HousesStatusChart housesStatus={housesStatus} />
              </div>
            </div>

            {/* Right side - Upcoming Assemblies */}
            <UpcomingAssemblies />
          </div>
        </div>
      </div>
    </>
  )
}
