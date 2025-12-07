'use client'

import { useState } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, RadialBarChart, RadialBar, PolarRadiusAxis, Label } from "recharts"
import { monthlyDataByYear, dashboardSummary, housesStatus, houseTypes } from "@/data/dashboard.mock"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HugeiconsIcon } from '@hugeicons/react'
import {
  MoneyReceiveSquareIcon,
  MoneySendSquareIcon,
  WalletIcon,
  MoneyBag02Icon,
  Calendar03Icon,
  Book02Icon,
} from '@hugeicons/core-free-icons'

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const chartConfig = {
  entradas: {
    label: "Entradas",
    color: "#e8e1e1ff",
  },
  salidas: {
    label: "Salidas",
    color: "#1f2937",
  },
}

export default function Page() {
  const [selectedYear, setSelectedYear] = useState<number>(2024)
  const monthlyData = monthlyDataByYear[selectedYear]

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
            {/* Chart Section - Takes 2 columns on large screens */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 pt-5 pb-4 px-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Entradas y Salidas Mensuales
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Resumen financiero del año
                  </p>
                </div>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
                  <SelectTrigger className="relative w-32 pl-9">
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                      <HugeiconsIcon icon={Calendar03Icon} className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2025">2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="bg-[#F6F6F6] rounded-xl p-4">
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                  <BarChart data={monthlyData} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#d1d5db" />
                    <XAxis
                      dataKey="mes"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickMargin={6}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      tickMargin={10}
                      tickFormatter={(value) => {
                        if (value >= 1000000) {
                          return `${(value / 1000000).toFixed(0)}M`
                        }
                        return value.toString()
                      }}
                    />
                    <ChartTooltip
                      content={<ChartTooltipContent />}
                      cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                    />
                    <Bar
                      dataKey="entradas"
                      fill="var(--color-entradas)"
                      radius={8}
                      maxBarSize={50}
                    />
                    <Bar
                      dataKey="salidas"
                      fill="var(--color-salidas)"
                      radius={8}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            </div>

            {/* Summary Cards Section - Takes 1 column on large screens */}
            <div className="flex flex-col gap-3">
              {/* Section Header */}
              <div className="pt-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Métricas del Mes Actual
                </h2>
                <p className="text-sm text-gray-500">
                  Resumen financiero del periodo en curso
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                {/* Entradas Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-gray-600">Entradas</p>
                    <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                      <HugeiconsIcon icon={MoneyReceiveSquareIcon} className="w-6 h-6" style={{ color: '#10b981' }} />
                    </div>
                  </div>
                  <div className="text-[26px] font-semibold text-gray-900 mb-2">
                    {formatCurrency(dashboardSummary.entradas)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Total de ingresos del mes
                  </p>
                </div>

                {/* Salidas Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-gray-600">Salidas</p>
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <HugeiconsIcon icon={MoneySendSquareIcon} className="w-6 h-6" style={{ color: '#ef4444' }} />
                    </div>
                  </div>
                  <div className="text-[26px] font-semibold text-gray-900 mb-2">
                    {formatCurrency(dashboardSummary.salidas)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Total de gastos del mes
                  </p>
                </div>

                {/* Balance Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-gray-600">Balance</p>
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <HugeiconsIcon icon={MoneyBag02Icon} className="w-6 h-6" style={{ color: '#081534' }} />
                    </div>
                  </div>
                  <div className={`text-[26px] font-semibold mb-2 ${dashboardSummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(dashboardSummary.balance)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Diferencia entre ingresos y gastos
                  </p>
                </div>

                {/* Saldo Actual Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-base text-gray-600">Saldo Actual</p>
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                      <HugeiconsIcon icon={WalletIcon} className="w-6 h-6" style={{ color: '#081534' }} />
                    </div>
                  </div>
                  <div className="text-[26px] font-semibold text-gray-900 mb-2">
                    {formatCurrency(dashboardSummary.saldoActual)}
                  </div>
                  <p className="text-xs text-gray-500">
                    Disponible en cuenta
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Houses Status Section - Same 3-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* Left side - Takes 2 columns with header */}
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
                {/* House Types Card */}
                <div className="bg-white rounded-xl border border-gray-200 p-5 flex-1">
                  <div className="grid grid-cols-[auto_1fr] gap-12">
                    <div className="flex flex-col justify-center gap-2">
                      <span className="text-lg font-semibold">Distribución</span>
                      <span className="text-6xl font-medium">{houseTypes.total}</span>
                      <span className="text-sm text-gray-500">Total de propiedades<br />en el condominio</span>
                    </div>
                    <div className="flex flex-col justify-center gap-3 pt-2">
                      <span className="text-xl font-semibold">Distribución de propiedades</span>
                      <span className="text-base text-gray-500">
                        Información detallada sobre la distribución de propiedades según su tipo de uso: arrendadas a terceros o residenciales ocupadas por propietarios.
                      </span>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <span className="text-base text-gray-600">Arrendadas</span>
                          <span className="text-2xl font-bold">{houseTypes.arrendadas.count}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-base text-gray-600">Residenciales</span>
                          <span className="text-2xl font-bold">{houseTypes.residenciales.count}</span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: 24 }, (_, index) => {
                          const filledBars = Math.round((houseTypes.arrendadas.percentage * 24) / 100)
                          return (
                            <div
                              key={index}
                              className={`h-7 flex-1 rounded-full ${index < filledBars ? 'bg-gray-800' : 'bg-gray-200'}`}
                            />
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status Card with Radial Chart */}
                <div className="bg-white rounded-xl border border-gray-200 p-4 min-w-[280px] overflow-hidden">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                      <HugeiconsIcon icon={MoneyReceiveSquareIcon} className="w-5 h-5 text-gray-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900">Estado de Casas</h2>
                  </div>
                  <div className="bg-[#F6F6F6] rounded-xl px-2 pb-4 overflow-hidden">
                    <ChartContainer
                      config={{
                        alDia: {
                          label: "Al Día",
                          color: "#d1d5db",
                        },
                        morosas: {
                          label: "Morosas",
                          color: "#374151",
                        },
                      }}
                      className="mx-auto w-full max-w-[320px] h-[165px] -mt-8"
                    >
                      <RadialBarChart
                        data={[{ alDia: housesStatus.alDia.count, morosas: housesStatus.morosas.count }]}
                        endAngle={180}
                        innerRadius={90}
                        outerRadius={150}
                        cy="95%"
                      >
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                          <Label
                            content={({ viewBox }) => {
                              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                return (
                                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) - 16}
                                      className="fill-foreground text-2xl font-bold"
                                    >
                                      {Math.round((housesStatus.morosas.count / (housesStatus.alDia.count + housesStatus.morosas.count)) * 100)}%
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 4}
                                      className="fill-muted-foreground text-sm"
                                    >
                                      Morosas
                                    </tspan>
                                  </text>
                                )
                              }
                            }}
                          />
                        </PolarRadiusAxis>
                        <RadialBar
                          dataKey="alDia"
                          stackId="a"
                          cornerRadius={10}
                          fill="var(--color-alDia)"
                          className="stroke-[#F6F6F6] stroke-[3px]"
                        />
                        <RadialBar
                          dataKey="morosas"
                          fill="var(--color-morosas)"
                          stackId="a"
                          cornerRadius={10}
                          className="stroke-[#F6F6F6] stroke-[3px]"
                        />
                      </RadialBarChart>
                    </ChartContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-300"></div>
                      <span className="text-xs text-gray-600">Al Día ({housesStatus.alDia.count})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                      <span className="text-xs text-gray-600">Morosas ({housesStatus.morosas.count})</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Upcoming Assemblies */}
            <div className="flex flex-col gap-4 max-h-[340px]">
              <h2 className="text-lg font-semibold text-gray-900">Próximas Asambleas</h2>
              <ScrollArea viewportClassName="max-h-[280px]">
                <div className="flex flex-col gap-3 pr-2">
                  {/* Asamblea 1 - Sage Green */}
                  <div className="bg-[#A4C8AE] rounded-2xl p-4 hover:bg-[#94b89e] transition-colors cursor-pointer flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                        <HugeiconsIcon icon={Book02Icon} className="w-5 h-5 text-[#5a7a56]" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 truncate">Asamblea General Ordinaria</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/70 rounded-lg px-3 py-2">
                      <span>15 Dic</span>
                      <span className="text-gray-400">|</span>
                      <span>6:00 PM</span>
                      <span className="text-gray-400">|</span>
                      <span className="truncate">Salón Comunal</span>
                    </div>
                  </div>

                  {/* Asamblea 2 - Cream/Beige */}
                  <div className="bg-[#e8ddc5] rounded-2xl p-4 hover:bg-[#ddd0b5] transition-colors cursor-pointer flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                        <HugeiconsIcon icon={Book02Icon} className="w-5 h-5 text-[#9a8a6a]" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 truncate">Reunión de Comité</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/70 rounded-lg px-3 py-2">
                      <span>22 Dic</span>
                      <span className="text-gray-400">|</span>
                      <span>4:00 PM</span>
                      <span className="text-gray-400">|</span>
                      <span className="truncate">Sala de Juntas</span>
                    </div>
                  </div>

                  {/* Asamblea 3 - Lavender */}
                  <div className="bg-[#c5c8e0] rounded-2xl p-4 hover:bg-[#b5b8d0] transition-colors cursor-pointer flex-shrink-0">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                        <HugeiconsIcon icon={Book02Icon} className="w-5 h-5 text-[#6a6d8a]" />
                      </div>
                      <h3 className="text-base font-semibold text-gray-900 truncate">Asamblea Extraordinaria</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/70 rounded-lg px-3 py-2">
                      <span>10 Ene</span>
                      <span className="text-gray-400">|</span>
                      <span>7:00 PM</span>
                      <span className="text-gray-400">|</span>
                      <span className="truncate">Salón Comunal</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
