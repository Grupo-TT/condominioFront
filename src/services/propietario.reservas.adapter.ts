import type { ReservaPropCreateRequest, ReservaPropUpdateRequest } from "@/types/propietario.reservas.types";

export function adaptarReservaCreate(data: {
  idRecurso: number;
  idSolicitante: number;
  fecha: Date;
  horaInicial: string;
  horaFinal: string;
  numeroInvitados: number;
}): ReservaPropCreateRequest {

  const normalizeHora = (h: string) => {
    const [hour, minute] = h.split(":").map(Number);
    return `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}:00`;
  };

  return {
    idRecurso: data.idRecurso,
    idSolicitante: data.idSolicitante,
    fechaSolicitud: data.fecha.toISOString().split("T")[0],
    horaInicio: normalizeHora(data.horaInicial),
    horaFin: normalizeHora(data.horaFinal),
    numeroInvitados: data.numeroInvitados,
  };
}


export function adaptarReservaUpdate(data: {
  idSolicitud: number;
  fechaSolicitud: string;
  horaInicio: string;   // "HH:mm"
  horaFin: string;      // "HH:mm"
  numeroInvitados: number;
}): ReservaPropUpdateRequest {

  const normalizeHora = (h: string) => {
    const [hour, minute] = h.split(":").map(Number)
    return `${String(hour).padStart(2,"0")}:${String(minute).padStart(2,"0")}:00`
  }

  return {
    idSolicitud: data.idSolicitud,
    fechaSolicitud: data.fechaSolicitud,
    horaInicio: normalizeHora(data.horaInicio),
    horaFin: normalizeHora(data.horaFin),
    numeroInvitados: data.numeroInvitados
  }
}

