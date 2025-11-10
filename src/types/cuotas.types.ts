export interface Obligacion {
  id: number;
  motivo: string;
  valorTotal: number;
  valorPendiente: number;
  montoPagado: number;
  // Campos opcionales que pueden venir de la API
  propietario?: string;
  estado?: string;
  titulo?: string;
  casa?: number;
  monto?: number;
  tipoObligacion?: string;
  estadoPago?: string;
}

export interface CuotaCasa {
  numeroCasa: number;
  propietario: Propietario | null;
  saldoPendiente: number;
  ultimoPago: string;
  obligacionesPendientes: Obligacion[];
}

export interface Propietario {
  nombreCompleto: string;
  telefono: number;
  correo: string;
}

export interface PagoPayload {
  soporte: string;
  idObligacion: number;
  montoAPagar: number;
}