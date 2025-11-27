import type { IEvent, IUser } from '@/types/calendar.types'

export type TipoRecurso = 'Zona' | 'Objeto'
export type EstadoReserva = 'pendiente' | 'aprobada' | 'rechazada'

export interface IEventExtended extends IEvent {
  tipoRecurso?: TipoRecurso
  numeroInvitados?: number
  casaNumero?: string
  estado?: EstadoReserva
}

// Re-exportar tipos del calendario para conveniencia
export type { IUser }
