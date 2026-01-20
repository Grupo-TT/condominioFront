'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
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
import {
  MonthlyFinanceChart,
  MetricsCardsGrid,
  PropertyOverviewCard,
  HousesStatusChart,
  UpcomingAssemblies
} from "@/components/admin-dashboard"
import { useDashboardAdmin } from '@/hooks/useDashboardAdmin'
import { MonthlyData } from '@/data/dashboard.mock'
import { HousesStatusData, HouseTypesData, DashboardSummary } from '@/types/dashboard.types'

const defaultHousesStatus: HousesStatusData = {
  total: 0,
  alDia: { count: 0, percentage: 0 },
  morosas: { count: 0, percentage: 0 }
}

const defaultHouseTypes: HouseTypesData = {
  total: 0,
  arrendadas: { count: 0, percentage: 0 },
  residenciales: { count: 0, percentage: 0 }
}

const defaultSummary: DashboardSummary = {
  ingresos: 0,
  egresos: 0,
  balance: 0,
  saldoActual: 0
}

export default function Page() {
  useDocumentTitle('Dashboard Admin | Flor Digital');

  const { fetchResumenFinancieroAnio, fetchResumenFinancieroMes, fetchCasas, fetchTypes } = useDashboardAdmin()
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [monthlyData2, setMonthlyData] = useState<MonthlyData[]>([])
  const [monthSummary, setMonthSummary] = useState<DashboardSummary>(defaultSummary)
  const [housesStatus2, setHousesStatus] = useState<HousesStatusData>(defaultHousesStatus)
  const [houseTypes2, setHouseTypes] = useState<HouseTypesData>(defaultHouseTypes)

  const searchParams = useSearchParams()
  const router = useRouter()

  // Detectar si fue redirigido por falta de permisos
  useEffect(() => {
    const accessDenied = searchParams.get('access_denied')
    if (accessDenied === 'owner') {
      toast.warning('Acceso denegado', {
        description: 'Las páginas de propietarios no están disponibles para administradores.',
      })
      // Limpiar el parámetro de la URL sin recargar
      router.replace('/admin/dashboard', { scroll: false })
    }
  }, [searchParams, router])

  useEffect(() => {
    const load = async () => {
      const yearData = await fetchResumenFinancieroAnio(selectedYear)
      const monthData = await fetchResumenFinancieroMes()
      const housesStatus = await fetchCasas()
      const houseTypes = await fetchTypes()

      setMonthlyData(yearData)
      setMonthSummary(monthData)
      setHousesStatus(housesStatus)
      setHouseTypes(houseTypes)
    }

    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <PropertyOverviewCard houseTypes={houseTypes2} />
                <HousesStatusChart housesStatus={housesStatus2} />
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
