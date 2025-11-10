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

export interface Multa {
  id: string;
  casaId: string;
  casa: string; //numero de la casa
  propietario: string;
  titulo: string;
  motivo: string;
  monto: number;
  fecha: string;
  estadoPago: 'POR_COBRAR' | 'CONDONADO' | 'PENDIENTE';
  tipoPago?: 'DINERO' | 'LABOR_SOCIAL';
}

export interface MultaForm {
  idCasa?: string | undefined;
  monto: number;
  titulo: string;
  motivo: string;
  tipoPago?: string | null;
}