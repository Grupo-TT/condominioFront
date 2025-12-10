import { propietario } from './casa.types'

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
  fecha?: string;
  interes?: number;
  mora?: number;
}

export interface CuotaCasa {
  numeroCasa: number;
  propietario: propietario | null;
  saldoPendiente: number;
  ultimoPago: string;
  obligacionesPendientes: Obligacion[];
}

export interface PagoPayload {
  soporte: string;
  tipoObligacion: string;
  idObligacion: number;
  montoAPagar: number;
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

export interface Movimiento {
  id: string
  fecha: string
  tipo: 'ENTRADA' | 'SALIDA'
  concepto: string
  descripcion?: string
  monto: number
  categoria?: string
  responsable?: string
}

export interface Metricas {
  ingresos: number;
  egresos: number;
  balance: number;
  saldoActual: number;
};

export interface CreateMovimiento {
  fecha?: string
  tipo: string
  descripcion: string
  monto: number
  categoria: string
  responsable: string
}

export interface UpdateMovimiento extends CreateMovimiento {
  id: number | string
}
