import type { IEventExtended, TipoRecurso } from '@/data/reservas.mock'
import type { IUser } from '@/calendar/interfaces'

/**
 * Estructura de respuesta de la API
 */
export interface ReservaAPIResponse {
  message: string
  data: ReservaFromAPI[]
}

export interface ReservaFromAPI {
  id: number
  fechaSolicitud: string // "2025-10-23"
  horaInicio: {
    hour: number
    minute: number
    second: number
    nano: number
  }
  horaFin: {
    hour: number
    minute: number
    second: number
    nano: number
  }
  numeroInvitados: number
  estadoSolicitud: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA'
  casa: {
    id: number
    numeroCasa: number
  }
  solicitante: {
    nombreCompleto: string
    telefono: number
    correo: string
  }
  recursoComun: {
    id: number
    nombre: string
    descripcion: string
    estadoRecurso: boolean
    tipoRecursoComun: {
      id: number
      nombre: string // "Zona" o "Objeto"
      descripcion: string
    }
  }
}

/**
 * Convierte el estado de la API al formato de la app
 */
function mapEstadoSolicitud(estado: string): 'pendiente' | 'aprobada' | 'rechazada' {
  switch (estado.toUpperCase()) {
    case 'PENDIENTE':
      return 'pendiente'
    case 'APROBADA':
    case 'APROBADO':
      return 'aprobada'
    case 'RECHAZADA':
    case 'RECHAZADO':
      return 'rechazada'
    default:
      return 'pendiente'
  }
}

/**
 * Determina si el tipo de recurso es Zona u Objeto
 */
function mapTipoRecurso(nombreTipo: string): TipoRecurso {
  const tipo = nombreTipo.toLowerCase()
  if (tipo.includes('zona') || tipo.includes('espacio') || tipo.includes('área')) {
    return 'Zona'
  }
  return 'Objeto'
}

/**
 * Combina fecha y hora para crear un ISO string
 */
function crearFechaISO(
  fecha: string, 
  hora: { hour: number; minute: number; second: number; nano: number }
): string {
  // fecha viene como "2025-10-23"
  const [year, month, day] = fecha.split('-').map(Number)
  const date = new Date(year, month - 1, day, hora.hour, hora.minute, hora.second)
  return date.toISOString()
}

/**
 * Convierte un solicitante de la API a un usuario de la app
 */
function mapSolicitanteToUser(
  solicitante: ReservaFromAPI['solicitante'],
  casa: ReservaFromAPI['casa']
): IUser {
  return {
    id: `user-${casa.id}`, // Usamos el ID de la casa como identificador único
    name: solicitante.nombreCompleto,
    email: solicitante.correo,
    picturePath: null, // La API no proporciona foto, podría agregarse después
  }
}

/**
 * Transforma una reserva de la API al formato de la aplicación
 */
export function transformReservaFromAPI(reservaAPI: ReservaFromAPI): IEventExtended {
  const startDate = crearFechaISO(reservaAPI.fechaSolicitud, reservaAPI.horaInicio)
  const endDate = crearFechaISO(reservaAPI.fechaSolicitud, reservaAPI.horaFin)
  const tipoRecurso = mapTipoRecurso(reservaAPI.recursoComun.tipoRecursoComun.nombre)
  
  return {
    id: reservaAPI.id,
    startDate,
    endDate,
    title: `Reserva - ${reservaAPI.recursoComun.nombre}`,
    color: 'gray', // Se asignará después con addColorToReservas()
    description: reservaAPI.recursoComun.descripcion,
    user: mapSolicitanteToUser(reservaAPI.solicitante, reservaAPI.casa),
    tipoRecurso,
    numeroInvitados: reservaAPI.numeroInvitados,
    casaNumero: reservaAPI.casa.numeroCasa.toString(),
    estado: mapEstadoSolicitud(reservaAPI.estadoSolicitud),
  }
}

/**
 * Transforma un array de reservas de la API al formato de la aplicación
 */
export function transformReservasFromAPI(response: ReservaAPIResponse): IEventExtended[] {
  return response.data.map(transformReservaFromAPI)
}

