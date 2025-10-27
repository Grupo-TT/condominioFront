export interface Reserva {
    id: number;
    recurso: string;
    fecha: string;
    horaInicio: string;
    horaFin: string;
    estado: "APROBADA" | "RECHAZADA" | "PENDIENTE";
    solicitante: {
      numeroCasa: number;
      nombre: string;
    };
  }