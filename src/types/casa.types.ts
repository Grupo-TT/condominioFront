export interface propietario {
  nombreCompleto: string
  telefono: number
  correo: string
}

export interface Mascotas {
  perro: number
  gato: number
  otro: number
}

export interface Casa {
  numeroCasa: string
  propietario: propietario
  cantidadMiembros: number
  cantidadMascotas: number
  mascotas: Mascotas
  estadoFinancieroCasa: 'AL DIA' | 'EN MORA' | string
  usoCasa: 'RESIDENCIAL' | 'ARRENDADA' | string
}

export interface MiembroCasa {
  nombreCompleto: string
  tipoMiembro: string
  numeroDocumento: number
  telefono: number
  email: string
}
