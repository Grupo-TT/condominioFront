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
import { ConfirmDialog } from './components/confirm-dialog'
import { useReservas } from '@/hooks/useReserva'
import { adaptReservasToCalendar } from '@/lib/adapters/reservas.adapter'
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
import { Loader2 } from 'lucide-react'

export type TipoRecursoFilter = 'Zona' | 'Objeto' | 'todos'
export type EstadoFilter = EstadoReserva | 'todos'

export default function NewReservasPage() {
  // Iniciar en el mes actual
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  
  // Referencia al contenedor de scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Estados de filtrado
  const [tipoRecursoFilter, setTipoRecursoFilter] = useState<TipoRecursoFilter>('todos')
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>('todos')

  // Estado para el sheet de detalles
  const [selectedReserva, setSelectedReserva] = useState<IEventExtended | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  // Estados para diálogos de confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'aprobar' | 'rechazar' | 'eliminar'
    reserva: IEventExtended | null
  } | null>(null)

  // Obtener reservas de la API
  const { 
    reservasAprobadas, 
    reservasRechazadas, 
    reservasPendientes, 
    loading, 
    error,
    aprobarReserva,
    rechazarReserva,
    eliminarReserva,
    recargar
  } = useReservas()

  // Combinar todas las reservas
  const todasLasReservas = useMemo(() => {
    return [...reservasAprobadas, ...reservasRechazadas, ...reservasPendientes]
  }, [reservasAprobadas, reservasRechazadas, reservasPendientes])

  // Adaptar reservas al formato del calendario
  const reservasBase = useMemo(() => {
    return adaptReservasToCalendar(todasLasReservas)
  }, [todasLasReservas])

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

  // Funciones de acción - abren diálogos de confirmación
  const handleEdit = (reserva: IEventExtended) => {
    console.log('Editar reserva:', reserva)
    // TODO: Implementar lógica de edición
  }

  const handleDelete = (reserva: IEventExtended) => {
    setConfirmAction({ type: 'eliminar', reserva })
    setConfirmDialogOpen(true)
  }

  const handleAprobar = (reserva: IEventExtended) => {
    setConfirmAction({ type: 'aprobar', reserva })
    setConfirmDialogOpen(true)
  }

  const handleRechazar = (reserva: IEventExtended) => {
    setConfirmAction({ type: 'rechazar', reserva })
    setConfirmDialogOpen(true)
  }

  // Función que ejecuta la acción confirmada
  const executeConfirmedAction = async () => {
    if (!confirmAction || !confirmAction.reserva) return

    try {
      switch (confirmAction.type) {
        case 'aprobar':
          await aprobarReserva(confirmAction.reserva.id)
          break
        case 'rechazar':
          await rechazarReserva(confirmAction.reserva.id)
          break
        case 'eliminar':
          await eliminarReserva(confirmAction.reserva.id)
          break
      }
      recargar()
    } catch (error) {
      console.error(`Error al ${confirmAction.type} reserva:`, error)
    }
  }

  // Obtener texto del diálogo según la acción
  const getConfirmDialogContent = () => {
    if (!confirmAction || !confirmAction.reserva) {
      return { title: '', description: '', confirmText: '', variant: 'default' as const }
    }

    const reserva = confirmAction.reserva
    const nombreRecurso = reserva.title

    switch (confirmAction.type) {
      case 'aprobar':
        return {
          title: '¿Aprobar reserva?',
          description: `¿Estás seguro de que deseas aprobar la reserva de "${nombreRecurso}"?`,
          confirmText: 'Aprobar',
          variant: 'default' as const,
        }
      case 'rechazar':
        return {
          title: '¿Rechazar reserva?',
          description: `¿Estás seguro de que deseas rechazar la reserva de "${nombreRecurso}"? Esta acción no se puede deshacer.`,
          confirmText: 'Rechazar',
          variant: 'destructive' as const,
        }
      case 'eliminar':
        return {
          title: '¿Eliminar reserva?',
          description: `¿Estás seguro de que deseas eliminar la reserva de "${nombreRecurso}"? Esta acción no se puede deshacer.`,
          confirmText: 'Eliminar',
          variant: 'destructive' as const,
        }
    }
  }

  // Mostrar loading
  if (loading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Cargando reservas...</p>
        </div>
      </div>
    )
  }

  // Mostrar error solo si todas las peticiones fallaron
  // Si solo algunas fallaron, mostrar la vista con los datos disponibles
  if (error && todasLasReservas.length === 0) {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 max-w-md px-6">
          <p className="text-sm text-red-500 text-center">Error: {error}</p>
          <button
            onClick={recargar}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
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
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onAprobar={handleAprobar}
                        onRechazar={handleRechazar}
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

      {/* Diálogo de confirmación */}
      {confirmAction && (
        <ConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          title={getConfirmDialogContent().title}
          description={getConfirmDialogContent().description}
          confirmText={getConfirmDialogContent().confirmText}
          variant={getConfirmDialogContent().variant}
          onConfirm={executeConfirmedAction}
        />
      )}
    </div>
  )
}
