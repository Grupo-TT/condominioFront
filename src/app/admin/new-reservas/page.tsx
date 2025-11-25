'use client'

import { useState, useMemo, useRef } from 'react'
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
import { MonthSelector } from './components/month-selector'
import { DayRowCard } from './components/day-row-card'
import { MiniCalendar } from './components/mini-calendar'
import { ProximasReservas } from './components/proximas-reservas'
import { ReservaDetailSheet } from './components/reserva-detail-sheet'
import { NEW_RESERVAS_MOCK } from '@/data/new-reservas.mock'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isWeekend,
  isSameMonth,
  isSameDay
} from 'date-fns'
import type { EstadoReserva, IEventExtended } from '@/types/reservas-calendar.types'

export type TipoRecursoFilter = 'Zona' | 'Objeto' | 'todos'
export type EstadoFilter = EstadoReserva | 'todos'

export default function NewReservasPage() {
  // Iniciar en noviembre 2025 para que coincida con los mocks
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2025, 10, 1))
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date(2025, 10, 1))
  
  // Referencia al contenedor de scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Estados de filtrado
  const [tipoRecursoFilter, setTipoRecursoFilter] = useState<TipoRecursoFilter>('todos')
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>('todos')

  // Estado para el sheet de detalles
  const [selectedReserva, setSelectedReserva] = useState<IEventExtended | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // Usar datos mock directamente
  const reservasBase = NEW_RESERVAS_MOCK

  // Aplicar filtros
  const reservasAdaptadas = useMemo(() => {
    return reservasBase.filter(reserva => {
      // Filtrar por tipo de recurso
      if (tipoRecursoFilter !== 'todos' && reserva.tipoRecurso !== tipoRecursoFilter) {
        return false
      }
      // Filtrar por estado
      if (estadoFilter !== 'todos' && reserva.estado !== estadoFilter) {
        return false
      }
      return true
    })
  }, [reservasBase, tipoRecursoFilter, estadoFilter])

  // Contar filtros activos
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (tipoRecursoFilter !== 'todos') count++
    if (estadoFilter !== 'todos') count++
    return count
  }, [tipoRecursoFilter, estadoFilter])

  // Limpiar todos los filtros
  const clearFilters = () => {
    setTipoRecursoFilter('todos')
    setEstadoFilter('todos')
  }

  // Obtener días del mes seleccionado
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    return eachDayOfInterval({ start, end })
  }, [selectedMonth])

  // Agrupar reservas por día
  const reservasPorDia = useMemo(() => {
    const grouped: Record<string, typeof reservasAdaptadas> = {}
    reservasAdaptadas.forEach((reserva) => {
      const dateKey = format(new Date(reserva.startDate), 'yyyy-MM-dd')
      if (!grouped[dateKey]) {
        grouped[dateKey] = []
      }
      grouped[dateKey].push(reserva)
    })
    return grouped
  }, [reservasAdaptadas])

  // Días con eventos para el mini calendario - usando las keys directamente
  const daysWithEvents = useMemo(() => {
    return Object.keys(reservasPorDia)
  }, [reservasPorDia])

  // Contar reservas del mes
  const reservasDelMes = useMemo(() => {
    return reservasAdaptadas.filter(r => 
      isSameMonth(new Date(r.startDate), selectedMonth)
    ).length
  }, [reservasAdaptadas, selectedMonth])

  // Función para seleccionar un día y hacer scroll
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    
    // Si el día no está en el mes actual, cambiar el mes
    if (!isSameMonth(date, selectedMonth)) {
      setSelectedMonth(date)
    }
    
    // Hacer scroll al día seleccionado
    const dateKey = format(date, 'yyyy-MM-dd')
    setTimeout(() => {
      const element = document.getElementById(`day-${dateKey}`)
      if (element && scrollContainerRef.current) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 100)
  }

  // Función para ver detalles de una reserva
  const handleViewDetails = (reserva: IEventExtended) => {
    setSelectedReserva(reserva)
    setDetailSheetOpen(true)
  }

  // Funciones de acción (placeholders)
  const handleEdit = (reserva: IEventExtended) => {
    console.log('Editar reserva:', reserva)
    // Aquí iría la lógica para editar
  }

  const handleDelete = (reserva: IEventExtended) => {
    console.log('Eliminar reserva:', reserva)
    // Aquí iría la lógica para eliminar
  }

  const handleAprobar = (reserva: IEventExtended) => {
    console.log('Aprobar reserva:', reserva)
    // Aquí iría la lógica para aprobar
  }

  const handleRechazar = (reserva: IEventExtended) => {
    console.log('Rechazar reserva:', reserva)
    // Aquí iría la lógica para rechazar
  }

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

        {/* Layout de dos columnas */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Columna izquierda */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0 border-r border-gray-100">
            {/* Selector de meses con botón de filtro dropdown */}
            <div className="shrink-0">
              <MonthSelector 
                selectedMonth={selectedMonth} 
                onMonthChange={setSelectedMonth}
                tipoRecursoFilter={tipoRecursoFilter}
                estadoFilter={estadoFilter}
                onTipoRecursoChange={setTipoRecursoFilter}
                onEstadoChange={setEstadoFilter}
                activeFiltersCount={activeFiltersCount}
                onClearFilters={clearFilters}
                reservasCount={reservasDelMes}
              />
            </div>

            {/* Lista de días - ÚNICO ELEMENTO CON SCROLL */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 min-h-0 overflow-y-auto px-4 py-4"
            >
              <div className="space-y-2">
                {daysInMonth.map((day, index) => {
                  const dateKey = format(day, 'yyyy-MM-dd')
                  const dayReservas = reservasPorDia[dateKey] || []
                  const isWeekendDay = isWeekend(day)
                  const isSelected = isSameDay(day, selectedDate)

                  return (
                    <div key={dateKey} id={`day-${dateKey}`}>
                      <DayRowCard
                        day={day}
                        dayNumber={index + 1}
                        reservas={dayReservas}
                        isWeekend={isWeekendDay}
                        isSelected={isSelected}
                        onClick={() => handleDateSelect(day)}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Columna derecha */}
          <div className="w-full lg:w-[380px] shrink-0 bg-white flex flex-col min-h-0">
            {/* Mini Calendario */}
            <div className="shrink-0">
              <MiniCalendar
                selectedDate={selectedDate}
                selectedMonth={selectedMonth}
                onDateSelect={handleDateSelect}
                onMonthChange={setSelectedMonth}
                daysWithEvents={daysWithEvents}
                reservasCount={reservasDelMes}
              />
            </div>

            {/* Próximas reservas */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <ProximasReservas 
                reservas={reservasAdaptadas}
                selectedDate={selectedDate}
                onAprobar={handleAprobar}
                onRechazar={handleRechazar}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sheet de detalles de reserva */}
      <ReservaDetailSheet
        reserva={selectedReserva}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />
    </div>
  )
}
