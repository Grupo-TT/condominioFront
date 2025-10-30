import type { TipoRecurso } from '@/data/reservas.mock'
import type { IEvent } from '@/calendar/interfaces'

export type TEventColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'orange' | 'gray'

/**
 * Obtiene el color de una reserva basado en el tipo de recurso
 * Orange/Naranja para Zonas
 * Purple/Morado para Objetos
 */
export function getReservaColor(tipoRecurso?: TipoRecurso): TEventColor {
  if (tipoRecurso === 'Zona') {
    return 'orange' // Tono dorado/naranja para Zonas
  } else if (tipoRecurso === 'Objeto') {
    return 'purple' // Tono morado/púrpura para Objetos
  }
  return 'gray' // Fallback por defecto
}

/**
 * Añade el color a una reserva basado en su tipo de recurso
 */
export function addColorToReserva<T extends IEvent & { tipoRecurso?: TipoRecurso }>(reserva: T): T {
  return {
    ...reserva,
    color: getReservaColor(reserva.tipoRecurso),
  }
}

/**
 * Añade el color a un array de reservas basado en su tipo de recurso
 */
export function addColorToReservas<T extends IEvent & { tipoRecurso?: TipoRecurso }>(reservas: T[]): T[] {
  return reservas.map(addColorToReserva)
}


