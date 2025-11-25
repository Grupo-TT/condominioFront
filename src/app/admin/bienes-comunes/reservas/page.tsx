'use client'

import { useState, useMemo, useRef } from 'react'
import { 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  format, 
  isWeekend,
  isSameMonth,
  isSameDay
} from 'date-fns'
import { useReservas } from '@/hooks/useReserva'
import { adaptReservasToCalendar } from '@/lib/adapters/reservas.adapter'
import { useReservasFilters } from '@/hooks/useReservasFilters'
import { useReservasActions, type UseReservasActionsReturn } from '@/hooks/useReservasActions'
import { groupReservasByDay, getDaysWithEvents, countReservasDelMes } from '@/lib/utils/reservas.utils'
import { ReservasLayout } from '@/components/reservas-layout'
import { LoadingState } from '@/components/loading-state'
import { ErrorState } from '@/components/error-state'
import { MonthSelector } from '@/components/month-selector'
import { DayRowCard } from '@/components/day-row-card'
import { MiniCalendar } from '@/components/mini-calendar'
import { ProximasReservas } from '@/components/proximas-reservas'
import { ReservaDetailSheet } from '@/components/reserva-detail-sheet'
import { EditReservaSheet } from '@/components/edit-reserva-sheet'
import { ConfirmDialog } from '@/components/confirm-dialog'

export default function ReservasPage() {
  // ==================== Estados de UI ====================
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date())
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // ==================== Datos de Reservas ====================
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

  // Combinar y adaptar todas las reservas
  const todasLasReservas = useMemo(() => {
    return [...reservasAprobadas, ...reservasRechazadas, ...reservasPendientes]
  }, [reservasAprobadas, reservasRechazadas, reservasPendientes])

  const reservasBase = useMemo(() => {
    return adaptReservasToCalendar(todasLasReservas)
  }, [todasLasReservas])

  // ==================== Filtros ====================
  const {
    tipoRecursoFilter,
    estadoFilter,
    reservasFiltradas,
    activeFiltersCount,
    setTipoRecursoFilter,
    setEstadoFilter,
    clearFilters,
  } = useReservasFilters(reservasBase)

  // ==================== Acciones ====================
  const acciones: UseReservasActionsReturn = useReservasActions({
    aprobarReserva,
    rechazarReserva,
    eliminarReserva,
    recargar,
  })

  const {
    selectedReserva,
    detailSheetOpen,
    setDetailSheetOpen,
    editSheetOpen,
    setEditSheetOpen,
    reservaEditando,
    setReservaEditando,
    confirmDialogOpen,
    setConfirmDialogOpen,
    handleViewDetails,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleAprobar,
    handleRechazar,
    executeConfirmedAction,
    getConfirmDialogContent,
  } = acciones

  // ==================== Cálculos de Fechas ====================
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    return eachDayOfInterval({ start, end })
  }, [selectedMonth])

  const reservasPorDia = useMemo(() => {
    return groupReservasByDay(reservasFiltradas)
  }, [reservasFiltradas])

  const daysWithEvents = useMemo(() => {
    return getDaysWithEvents(reservasPorDia)
  }, [reservasPorDia])

  const reservasDelMes = useMemo(() => {
    return countReservasDelMes(reservasFiltradas, selectedMonth)
  }, [reservasFiltradas, selectedMonth])

  // ==================== Handlers ====================
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

  // ==================== Estados de Carga y Error ====================
  if (loading) {
    return <LoadingState />
  }

  if (error && todasLasReservas.length === 0) {
    return <ErrorState error={error} onRetry={recargar} />
  }

  // ==================== Render ====================
  return (
    <ReservasLayout>
      {/* Layout de dos columnas */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Columna izquierda - Lista de días */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0 border-r border-gray-100">
          {/* Selector de meses con filtros */}
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

          {/* Lista de días con scroll */}
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

        {/* Columna derecha - Sidebar */}
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
              reservas={reservasFiltradas}
              selectedDate={selectedDate}
              onAprobar={handleAprobar}
              onRechazar={handleRechazar}
              onViewDetails={handleViewDetails}
            />
          </div>
        </div>
      </div>

      {/* Sheets y Diálogos */}
      <ReservaDetailSheet
        reserva={selectedReserva}
        open={detailSheetOpen}
        onOpenChange={setDetailSheetOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />

      <EditReservaSheet
        reserva={reservaEditando}
        open={editSheetOpen}
        onOpenChange={(open: boolean) => {
          setEditSheetOpen(open)
          if (!open) {
            setReservaEditando(null)
          }
        }}
        onSave={handleSaveEdit}
        todasLasReservas={reservasFiltradas}
      />

      {getConfirmDialogContent().title && (
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
    </ReservasLayout>
  )
}
