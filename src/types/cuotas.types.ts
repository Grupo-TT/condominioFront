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
