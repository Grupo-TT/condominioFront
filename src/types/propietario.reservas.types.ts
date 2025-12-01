export interface GetReservasPropResponse {
  message: string;
  data: ReservaPropietarioItem[];
}

export interface ReservaPropietarioItem {
  id: number;
  idRecurso: number;
  fechaCreacion: string;
  fechaReserva: string;
  horaInicio: Hora;
  horaFin: Hora;
  numeroInvitados: number;
  estadoSolicitud: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "FINALIZADA";
  nombre: string;
  descripcion: string;
  tipoRecursoComun: "ZONA" | "OTRO";
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
  fechaCreacion: Date
}

export type ReservaPropCreateRequest = ReservaBasePayload;

export type ReservaPropSaveData = ReservaBasePayload;

export interface Hora {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}
