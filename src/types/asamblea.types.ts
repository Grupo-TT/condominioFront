// src/types/asamblea.types.ts

export interface Asamblea {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string; // ISO date string
  hora: string; // HH:MM format
  lugar: string;
  estado: 'programada' | 'en_curso' | 'finalizada' | 'cancelada';
}

export interface Asistente {
  id: string;
  asambleaId: string;
  usuarioId: string;
  nombre: string;
  casaId: string;
  asistio: boolean;
  createdAt: string;
}

export interface CreateAsambleaData {
  titulo: string;
  descripcion: string;
  fecha: string;
  hora: string;
  lugar: string;
}

export interface UpdateAsambleaData extends Partial<CreateAsambleaData> {
  estado?: Asamblea['estado'];
}
