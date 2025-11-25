export interface Reserva {
    id: number;
    recursoComun: RecursoComun;
    fechaSolicitud: string;
    horaInicio: string;
    horaFin: string;
    numeroInvitados?: number;
    solicitante: {
      nombreCompleto: string;
    }
    estadoSolicitud: "APROBADA" | "RECHAZADA" | "PENDIENTE";
    casa: {
      id: number;
      numeroCasa: number;
    };
  }

export interface RecursoComun {
  nombre : string;
  descripcion: string;
  tipoRecursoComun : 'ZONA' | 'OBJETO';
}