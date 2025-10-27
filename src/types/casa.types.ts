// Tipo para el propietario
export interface propietario {
  nombreCompleto: string
  telefono: number
  correo: string
}

// Tipos para mascotas (objeto con contadores)
export interface Mascotas {
  perro: number
  gato: number
  otro: number
}

// Tipo principal de Casa
export interface Casa {
  numeroCasa: string
  propietario: propietario
  cantidadMiembros: number
  cantidadMascotas: number
  mascotas: Mascotas
  estadoFinancieroCasa: 'AL DIA' | 'EN MORA' | string
  usoCasa: 'RESIDENCIAL' | 'ARRENDADA' | string
}

// Tipo para miembros de una casa
export interface MiembroCasa {
  nombreCompleto: string
  tipoMiembro: string
  numeroDocumento: number
  telefono: number
  email: string
}

