export interface Configuracion {
  tipo: string;
  valor: number;
}

export interface DataConfiguracion {
  configuraciones: Configuracion[];
}

export interface VisualizarResponse {
  message: string;
  data: DataConfiguracion;
}

export interface DataActualizarResponse {
  valorActual: number;
  nuevoValor: number;
  correoActualizador: string;
  nombreActualizador: string;
  id: number;
}

export interface ActualizarResponse {
  message: string;
  data: DataActualizarResponse;
}
