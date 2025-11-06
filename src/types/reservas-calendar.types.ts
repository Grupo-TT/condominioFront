import type { IEvent, IUser } from '@/calendar/interfaces'

export type TipoRecurso = 'ZONA' | 'OBJETO'
export type EstadoReserva = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'

export interface IEventExtended extends IEvent {
  tipoRecurso?: TipoRecurso
  numeroInvitados?: number
  casaNumero?: string
  estado?: EstadoReserva
}

// Re-exportar tipos del calendario para conveniencia
export type { IUser }
