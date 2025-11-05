export interface Obligacion {
  id: string;
  motivo: string;
  valorTotal: number;
  valorPendiente: number;
  abonado: number;
}

export interface CuotaCasa {
  id: string;
  numeroCasa: number;
  propietario: Propietario;
  saldoPendiente: number;
  cantidadPagosPendientes: number;
  ultimoPago: string;
  obligacionesPendientes: Obligacion[];
}

export interface Propietario {
  id: string;
  nombreCompleto: string;
  telefono: string;
  correo: string;
}

export interface PagoPayload {
  soporte: string;
  idObligacion: number;
  montoAPagar: number;
}