export interface Obligacion {
  id: string;
  titulo: string;
  valorTotal: number;
  saldoPendiente: number;
  abonado: number;
}

export interface CuotaCasa {
  id: string;
  numeroCasa: string;
  propietario: string;
  saldoPendiente: number;
  cantidadPagosPendientes: number;
  ultimoPago: string;
  obligaciones: Obligacion[];
}

export interface Multa {
  id: string;
  casaId: string;
  numeroCasa: string;
  propietario: string;
  motivo: string;
  monto: number;
  fecha: string;
  estadoPago: 'POR_COBRAR' | 'pagada' | 'cancelada';
  observaciones?: string;
  tipoPago?: 'efectivo' | 'labor-social';
}

export interface MultaForm {
  idCasa: string | undefined;
  monto: number;
  titulo: string;
  motivo: string;
  // tipoPago: string | null;
}