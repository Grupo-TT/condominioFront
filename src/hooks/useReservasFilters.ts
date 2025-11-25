import { useState, useMemo } from 'react'
import type { EstadoReserva, IEventExtended } from '@/types/reservas-calendar.types'

export type TipoRecursoFilter = 'Zona' | 'Objeto' | 'todos'
export type EstadoFilter = EstadoReserva | 'todos'

export function useReservasFilters(reservas: IEventExtended[]) {
  const [tipoRecursoFilter, setTipoRecursoFilter] = useState<TipoRecursoFilter>('todos')
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>('todos')

  // Aplicar filtros
  const reservasFiltradas = useMemo(() => {
    return reservas.filter(reserva => {
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
  }, [reservas, tipoRecursoFilter, estadoFilter])

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

  return {
    tipoRecursoFilter,
    estadoFilter,
    reservasFiltradas,
    activeFiltersCount,
    setTipoRecursoFilter,
    setEstadoFilter,
    clearFilters,
  }
}

