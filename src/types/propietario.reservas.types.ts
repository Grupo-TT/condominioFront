export interface GetReservasPropResponse {
  message: string;
  data: ReservaPropietarioItem[];
}

export interface ReservaPropietarioItem {
  id: number;
  fechaSolicitud: string;
  horaInicio: Hora;
  horaFin: Hora;
  numeroInvitados: number;
  estadoSolicitud: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "FINALIZADA";
  casa: Casa;
  solicitante: Solicitante;
  recursoComun: RecursoComun;
}

export interface Casa {
  id: number; 
  numeroCasa: number;
}

export interface Solicitante {
  nombreCompleto: string;
  telefono: number;
  correo: string;
}

export interface RecursoComun {
  id: number;
  nombre: string;
  descripcion: string;
  disponibilidadRecurso: "DISPONIBLE" | "EN_MANTENIMIENTO" | "NO_DISPONIBLE";
  tipoRecursoComun: "ZONA" | "OBJETO";
}

export interface ReservaPropUpdateRequest {
  idSolicitud: number;
  fechaSolicitud: string;
  horaInicio: string;
  horaFin: string;
  numeroInvitados: number;
}

export interface ReservaPropInvitadosRequest {
  idSolicitud: number;
  numeroInvitados: number;
}

export interface ReservaPropSaveResponse {
  message: string;
  data: ReservaPropSaveData;
}

export interface ReservaBasePayload {
  idRecurso: number;
  idSolicitante: number;
  fechaSolicitud: string;
  horaInicio: string;
  horaFin: string;
  numeroInvitados: number;
}

export interface ReservaAdaptada {
  id: string
  idRecurso: number
  recursoNombre: string
  tipoRecurso: 'zona' | 'objeto'
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  fechaInicio: Date
  fechaFin: Date
  horaInicio: string
  horaFin: string
  numeroInvitados: number
  idCasa?: number
}

export type ReservaPropCreateRequest = ReservaBasePayload;

export type ReservaPropSaveData = ReservaBasePayload;

export interface Hora {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}
