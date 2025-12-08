// src/types/asamblea.types.ts

export interface Asamblea {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date string
  horaInicio: string; // HH:MM format
  lugar: string;
  estado: 'PROGRAMADA' | 'EN_CURSO' | 'REALIZADA' | 'CANCELADA';
}

export interface Asistente {
  nombre: string;
  id: number;
  asistio?: boolean;
}

export interface Propietario {
  nombrePropietario: string;
  numeroCasa: number;
  asistio?: boolean;
}

export interface CreateAsambleaData {
  titulo: string;
  descripcion: string;
  fecha: string;
  horaInicio: string;
  lugar: string;
  estado?: Asamblea['estado'];
}

export interface UpdateAsambleaData extends Partial<CreateAsambleaData> {
  id?: number;
  estado?: Asamblea['estado'];
}
