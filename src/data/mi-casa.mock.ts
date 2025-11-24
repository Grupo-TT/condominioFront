// Datos mock para la vista Mi Casa
export const saldoPendiente = 450000
export const obligacionesPendientesCount = 8
export const cantidadMascotas = 3
export const miembrosActivos = 4

// Datos mock para finanzas
export const fechaUltimoPago = '2025-01-15' // Fecha del último pago realizado

// Mock datos para mascotas
export interface Mascotas {
  perro: number
  gato: number
  otro: number
}

export const mascotasMock: Mascotas = {
  perro: 2,
  gato: 1,
  otro: 0
}

// Mock datos para obligaciones pendientes
export interface ObligacionPendiente {
  id: string
  titulo: string
  valorTotal: number
  saldoPendiente: number
  abonado: number
  estado: 'Pendiente' | 'Parcial' | 'Pagada'
  año: number
}

export const obligacionesPendientesMock: ObligacionPendiente[] = [
  {
    id: '1',
    titulo: 'Cuota de Administración - Enero 2025',
    valorTotal: 150000,
    saldoPendiente: 150000,
    abonado: 0,
    estado: 'Pagada',
    año: 2025
  },
  {
    id: '2',
    titulo: 'Cuota de Administración - Febrero 2025',
    valorTotal: 150000,
    saldoPendiente: 150000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '3',
    titulo: 'Cuota de Administración - Marzo 2025',
    valorTotal: 150000,
    saldoPendiente: 75000,
    abonado: 75000,
    estado: 'Parcial',
    año: 2025
  },
  {
    id: '4',
    titulo: 'Multa por mascota sin correa',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '6',
    titulo: 'Multa por mascota sin correa',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '7',
    titulo: 'Multa por mascota sin correa',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '8',
    titulo: 'Multa por mascota sin correa',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '9',
    titulo: 'Multa por mascota sin correa',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '10',
    titulo: 'Multa por mascota sin correa',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '11',
    titulo: 'Multa por perro sin bozal',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '12',
    titulo: 'Multa por perro sin bozal',
    valorTotal: 50000,
    saldoPendiente: 50000,
    abonado: 0,
    estado: 'Pendiente',
    año: 2025
  },
  {
    id: '5',
    titulo: 'Cuota de Administración - Diciembre 2024',
    valorTotal: 150000,
    saldoPendiente: 0,
    abonado: 150000,
    estado: 'Pagada',
    año: 2024
  },
]

// Mock datos para miembros del hogar
export interface MiembroHogar {
  id: string
  nombre: string
  parentesco: string
  telefono?: string
  correo: string
  tipoDocumento: string
  documento: string
  estado: 'Activo' | 'Inactivo'
}

export const miembrosHogarMock: MiembroHogar[] = [
  {
    id: '2',
    nombre: 'María González',
    parentesco: 'ESPOSA',
    telefono: '3009876543',
    correo: 'maria.gonzalez@example.com',
    tipoDocumento: 'CC',
    documento: '0987654321',
    estado: 'Inactivo'
  },
  {
    id: '3',
    nombre: 'Carlos Pérez',
    parentesco: 'HIJO',
    telefono: '3005551234',
    correo: 'carlos.perez@example.com',
    tipoDocumento: 'TI',
    documento: '1122334455',
    estado: 'Activo'
  },
  {
    id: '4',
    nombre: 'Ana Pérez',
    parentesco: 'HIJA',
    correo: 'ana.perez@example.com',
    tipoDocumento: 'TI',
    documento: '5566778899',
    estado: 'Activo'
  },
]

// Mock datos para multas
export interface MultaPropietario {
  id: string
  titulo: string
  motivo: string
  monto: number
  fecha: string
  estadoPago: 'POR_COBRAR' | 'CONDONADO' | 'PENDIENTE'
  tipoPago?: 'DINERO' | 'LABOR_SOCIAL'
  año: number
}

export const multasPropietarioMock: MultaPropietario[] = [
  {
    id: '1',
    titulo: 'Multa por mascota sin correa',
    motivo: 'Se observó mascota sin correa en áreas comunes',
    monto: 50000,
    fecha: '2025-01-15',
    estadoPago: 'PENDIENTE',
    tipoPago: 'DINERO',
    año: 2025
  },
  {
    id: '2',
    titulo: 'Multa por ruido excesivo',
    motivo: 'Ruido excesivo después de las 10 PM',
    monto: 75000,
    fecha: '2025-01-20',
    estadoPago: 'PENDIENTE',
    tipoPago: 'DINERO',
    año: 2025
  },
  {
    id: '3',
    titulo: 'Multa por mal estacionamiento',
    motivo: 'Vehículo estacionado en área no permitida',
    monto: 100000,
    fecha: '2024-12-10',
    estadoPago: 'CONDONADO',
    tipoPago: 'DINERO',
    año: 2024
  },
  {
    id: '4',
    titulo: 'Multa por basura fuera de horario',
    motivo: 'Basura depositada fuera del horario establecido',
    monto: 30000,
    fecha: '2024-11-25',
    estadoPago: 'POR_COBRAR',
    tipoPago: 'LABOR_SOCIAL',
    año: 2024
  },
]

// Calcular cantidad de multas pendientes
export const multasPendientesCount = multasPropietarioMock.filter(m => m.estadoPago === 'PENDIENTE').length

