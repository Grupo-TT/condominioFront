import type { IEventExtended, EstadoReserva } from '@/types/reservas-calendar.types'

// Mocks para la nueva vista de reservas con más variedad y estados

const ESTADOS: EstadoReserva[] = ['aprobada', 'pendiente', 'rechazada']

// Generar reservas para noviembre 2025
export const generateNewReservasMock = (): IEventExtended[] => {
  const reservas: IEventExtended[] = []
  
  // Día 1 - Dos reservas
  reservas.push({
    id: 1,
    startDate: '2025-11-01T09:00:00.000Z',
    endDate: '2025-11-01T11:00:00.000Z',
    title: 'Salón de Eventos',
    color: 'orange',
    description: 'Reunión de copropietarios',
    user: { id: '302', name: 'Juan Pérez', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 25,
    casaNumero: '302',
    estado: 'aprobada',
  })
  
  reservas.push({
    id: 2,
    startDate: '2025-11-01T14:00:00.000Z',
    endDate: '2025-11-01T16:00:00.000Z',
    title: 'Piscina',
    color: 'orange',
    description: 'Fiesta de cumpleaños',
    user: { id: '303', name: 'María García', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 15,
    casaNumero: '303',
    estado: 'aprobada',
  })

  // Día 3 - Tres reservas diferentes
  reservas.push({
    id: 3,
    startDate: '2025-11-03T08:00:00.000Z',
    endDate: '2025-11-03T10:00:00.000Z',
    title: 'Gimnasio',
    color: 'orange',
    description: 'Clase de yoga grupal',
    user: { id: '304', name: 'Carlos López', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 12,
    casaNumero: '304',
    estado: 'aprobada',
  })
  
  reservas.push({
    id: 4,
    startDate: '2025-11-03T09:00:00.000Z',
    endDate: '2025-11-03T12:00:00.000Z',
    title: 'Proyector',
    color: 'purple',
    description: 'Presentación empresarial',
    user: { id: '302', name: 'Juan Pérez', picturePath: null },
    tipoRecurso: 'Objeto',
    numeroInvitados: 1,
    casaNumero: '302',
    estado: 'pendiente',
  })
  
  reservas.push({
    id: 5,
    startDate: '2025-11-03T15:00:00.000Z',
    endDate: '2025-11-03T18:00:00.000Z',
    title: 'Cancha Deportiva',
    color: 'orange',
    description: 'Partido de fútbol',
    user: { id: '305', name: 'Ana Martínez', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 20,
    casaNumero: '305',
    estado: 'aprobada',
  })

  // Día 6 - Una reserva (fin de semana con actividad)
  reservas.push({
    id: 6,
    startDate: '2025-11-06T10:00:00.000Z',
    endDate: '2025-11-06T14:00:00.000Z',
    title: 'BBQ/Parrilla',
    color: 'orange',
    description: 'Asado familiar',
    user: { id: '301', name: 'Roberto Sánchez', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 30,
    casaNumero: '301',
    estado: 'aprobada',
  })

  // Día 8 - Dos reservas
  reservas.push({
    id: 7,
    startDate: '2025-11-08T09:00:00.000Z',
    endDate: '2025-11-08T11:00:00.000Z',
    title: 'Sillas Plegables',
    color: 'purple',
    description: 'Evento en casa',
    user: { id: '306', name: 'Laura Torres', picturePath: null },
    tipoRecurso: 'Objeto',
    numeroInvitados: 1,
    casaNumero: '306',
    estado: 'pendiente',
  })
  
  reservas.push({
    id: 8,
    startDate: '2025-11-08T14:00:00.000Z',
    endDate: '2025-11-08T17:00:00.000Z',
    title: 'Salón de Eventos',
    color: 'orange',
    description: 'Cumpleaños infantil',
    user: { id: '307', name: 'Diego Ramírez', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 40,
    casaNumero: '307',
    estado: 'aprobada',
  })

  // Día 10 - Una reserva rechazada
  reservas.push({
    id: 9,
    startDate: '2025-11-10T11:00:00.000Z',
    endDate: '2025-11-10T13:00:00.000Z',
    title: 'Piscina',
    color: 'orange',
    description: 'Fiesta acuática',
    user: { id: '308', name: 'Patricia Vega', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 50,
    casaNumero: '308',
    estado: 'rechazada',
  })

  // Día 12 - Tres reservas
  reservas.push({
    id: 10,
    startDate: '2025-11-12T08:00:00.000Z',
    endDate: '2025-11-12T10:00:00.000Z',
    title: 'Gimnasio',
    color: 'orange',
    description: 'Entrenamiento personal',
    user: { id: '309', name: 'Fernando Castro', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 5,
    casaNumero: '309',
    estado: 'aprobada',
  })
  
  reservas.push({
    id: 11,
    startDate: '2025-11-12T10:00:00.000Z',
    endDate: '2025-11-12T12:00:00.000Z',
    title: 'Mesas Plegables',
    color: 'purple',
    description: 'Evento social',
    user: { id: '310', name: 'Sofía Mendoza', picturePath: null },
    tipoRecurso: 'Objeto',
    numeroInvitados: 1,
    casaNumero: '310',
    estado: 'aprobada',
  })
  
  reservas.push({
    id: 12,
    startDate: '2025-11-12T16:00:00.000Z',
    endDate: '2025-11-12T19:00:00.000Z',
    title: 'Área de Niños',
    color: 'orange',
    description: 'Fiesta infantil',
    user: { id: '311', name: 'Andrés Molina', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 18,
    casaNumero: '311',
    estado: 'pendiente',
  })

  // Día 15 - Dos reservas
  reservas.push({
    id: 13,
    startDate: '2025-11-15T09:00:00.000Z',
    endDate: '2025-11-15T12:00:00.000Z',
    title: 'Salón de Eventos',
    color: 'orange',
    description: 'Taller de manualidades',
    user: { id: '312', name: 'Claudia Ruiz', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 22,
    casaNumero: '312',
    estado: 'aprobada',
  })
  
  reservas.push({
    id: 14,
    startDate: '2025-11-15T14:00:00.000Z',
    endDate: '2025-11-15T16:00:00.000Z',
    title: 'Proyector',
    color: 'purple',
    description: 'Película comunitaria',
    user: { id: '313', name: 'Ricardo Díaz', picturePath: null },
    tipoRecurso: 'Objeto',
    numeroInvitados: 1,
    casaNumero: '313',
    estado: 'aprobada',
  })

  // Día 18 - Una reserva grande
  reservas.push({
    id: 15,
    startDate: '2025-11-18T10:00:00.000Z',
    endDate: '2025-11-18T22:00:00.000Z',
    title: 'Salón de Eventos',
    color: 'orange',
    description: 'Boda - Evento todo el día',
    user: { id: '314', name: 'Miguel Ángel Torres', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 80,
    casaNumero: '314',
    estado: 'aprobada',
  })

  // Día 20 - Varias reservas
  reservas.push({
    id: 16,
    startDate: '2025-11-20T08:00:00.000Z',
    endDate: '2025-11-20T10:00:00.000Z',
    title: 'Piscina',
    color: 'orange',
    description: 'Clase de natación',
    user: { id: '315', name: 'Valentina Herrera', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 8,
    casaNumero: '315',
    estado: 'aprobada',
  })
  
  reservas.push({
    id: 17,
    startDate: '2025-11-20T11:00:00.000Z',
    endDate: '2025-11-20T13:00:00.000Z',
    title: 'Cancha Deportiva',
    color: 'orange',
    description: 'Partido de tenis',
    user: { id: '316', name: 'Sebastián Mora', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 4,
    casaNumero: '316',
    estado: 'pendiente',
  })

  // Día 22 - Dos reservas
  reservas.push({
    id: 18,
    startDate: '2025-11-22T15:00:00.000Z',
    endDate: '2025-11-22T18:00:00.000Z',
    title: 'BBQ/Parrilla',
    color: 'orange',
    description: 'Reunión de vecinos',
    user: { id: '317', name: 'Camila Espinoza', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 35,
    casaNumero: '317',
    estado: 'aprobada',
  })
  
  reservas.push({
    id: 19,
    startDate: '2025-11-22T09:00:00.000Z',
    endDate: '2025-11-22T11:00:00.000Z',
    title: 'Sala de Juegos',
    color: 'orange',
    description: 'Torneo de ping pong',
    user: { id: '318', name: 'Nicolás Paredes', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 16,
    casaNumero: '318',
    estado: 'aprobada',
  })

  // Día 25 - Una reserva
  reservas.push({
    id: 20,
    startDate: '2025-11-25T14:00:00.000Z',
    endDate: '2025-11-25T17:00:00.000Z',
    title: 'Gimnasio',
    color: 'orange',
    description: 'Clase de aeróbicos',
    user: { id: '319', name: 'Isabella Campos', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 15,
    casaNumero: '319',
    estado: 'aprobada',
  })

  // Día 27 - Reservas futuras
  reservas.push({
    id: 21,
    startDate: '2025-11-27T10:00:00.000Z',
    endDate: '2025-11-27T13:00:00.000Z',
    title: 'Salón de Eventos',
    color: 'orange',
    description: 'Baby shower',
    user: { id: '320', name: 'Daniela Vargas', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 28,
    casaNumero: '320',
    estado: 'pendiente',
  })

  // Día 29 - Última reserva del mes
  reservas.push({
    id: 22,
    startDate: '2025-11-29T16:00:00.000Z',
    endDate: '2025-11-29T20:00:00.000Z',
    title: 'Piscina',
    color: 'orange',
    description: 'Fiesta de fin de mes',
    user: { id: '321', name: 'Mateo Reyes', picturePath: null },
    tipoRecurso: 'Zona',
    numeroInvitados: 45,
    casaNumero: '321',
    estado: 'aprobada',
  })

  return reservas
}

export const NEW_RESERVAS_MOCK = generateNewReservasMock()

