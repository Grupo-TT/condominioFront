// Tipo para el propietario
export interface propietario {
  nombreCompleto: string;
  telefono: number;
  correo: string;
}

// Tipos para mascotas (objeto con contadores)
export interface Mascotas {
  perro: number;
  gato: number;
  otro: number;
}

// Tipo principal de Casa
export interface Casa {
  numeroCasa: string;
  propietario: propietario;
  cantidadMiembros: number;
  cantidadMascotas: number;
  mascotas: Mascotas;
  estadoFinancieroCasa: "AL DIA" | "EN MORA" | string;
  usoCasa: "RESIDENCIAL" | "ARRENDADA" | string;
}

// Tipo para miembros de una casa
export interface MiembroCasa {
  nombreCompleto: string;
  tipoMiembro: string;
  numeroDocumento: string;
  telefono: string;
  email?: string;
}

export interface MiembroHogar {
  idCasa: string;
  nombre: string;
  numeroDocumento: string;
  telefono?: string;
  tipoDocumento: string;
  parentesco: string;
  id: string;
  estado: boolean | string;
}

export interface CreateMiembroHogar {
  idCasa: number | string;
  nombre: string;
  numeroDocumento: number;
  telefono?: number;
  tipoDocumento: string;
  parentesco: string;
}

export interface UpdateMiembroHogar extends CreateMiembroHogar {
  id: number;
}
