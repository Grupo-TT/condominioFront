import { format, isSameMonth } from 'date-fns'
import type { IEventExtended } from '@/types/reservas-calendar.types'

/**
 * Agrupa las reservas por día
 */
export function groupReservasByDay(reservas: IEventExtended[]): Record<string, IEventExtended[]> {
  const grouped: Record<string, IEventExtended[]> = {}
  
  reservas.forEach((reserva) => {
    const dateKey = format(new Date(reserva.startDate), 'yyyy-MM-dd')
    if (!grouped[dateKey]) {
      grouped[dateKey] = []
    }
    grouped[dateKey].push(reserva)
  })
  
  return grouped
}

/**
 * Obtiene los días que tienen eventos (keys del objeto agrupado)
 */
export function getDaysWithEvents(reservasPorDia: Record<string, IEventExtended[]>): string[] {
  return Object.keys(reservasPorDia)
}

/**
 * Cuenta las reservas del mes seleccionado
 */
export function countReservasDelMes(
  reservas: IEventExtended[],
  selectedMonth: Date
): number {
  return reservas.filter(r => 
    isSameMonth(new Date(r.startDate), selectedMonth)
  ).length
}

