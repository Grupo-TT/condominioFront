export interface GetReservasPropResponse {
  message: string;
  data: ReservaPropietarioItem[];
}

// Respuesta del endpoint GET /solicitud-recurso/mis-reservas/{id}
export interface GetMisReservasResponse {
  message: string;
  data: MisReservasItem[];
}

// Item de la respuesta de mis-reservas (estructura plana)
export interface MisReservasItem {
  id: number;
  fechaCreacion: string;
  fechaReserva: string;
  horaInicio: Hora;
  horaFin: Hora;
  numeroInvitados: number;
  estadoSolicitud: "PENDIENTE" | "APROBADA" | "RECHAZADA" | "FINALIZADA";
  idRecurso: number;
  nombre: string;
  descripcion: string;
  tipoRecursoComun: "ZONA" | "OBJETO";
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
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'finalizada'
  fechaInicio: Date
  fechaFin: Date
  fechaCreacion?: Date
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
