export interface Reserva {
    id: number;
    recursoComun: RecursoComun;
    fechaSolicitud: string;
    horaInicio: string;
    horaFin: string;
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