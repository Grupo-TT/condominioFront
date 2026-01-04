/**
 * Types for the owner's solicitudes (PQRS) API integration
 * Based on the API endpoints:
 * - GET /pqrs/mi-pqrs/{idCasa}
 * - POST /pqrs
 * - PUT /pqrs/mi-pqrs/{id}
 * - DELETE /pqrs/mi-pqrs/{id}
 */

// =============================================================================
// API Response Types
// =============================================================================

/** PQRS type as returned by the API */
export type TipoPqrsAPI = 'QUEJA' | 'PETICION' | 'SUGERENCIA' | 'REPARACION_LOCATIVA';

/** PQRS status as returned by the API */
export type EstadoPqrsAPI = 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'REVISADA' | 'DESAPROBADA';

/** Casa info in PQRS response */
export interface PqrsCasa {
  id: number;
  numeroCasa: number;
}

/** Single PQRS item from GET /pqrs/mi-pqrs/{idCasa} */
export interface PqrsItem {
  id: number;
  titulo: string;
  descripcion: string;
  tipoPqrs: TipoPqrsAPI;
  createdDate: string; // ISO date string "2026-01-04"
  casa: PqrsCasa;
  estadoPqrs: EstadoPqrsAPI;
  fechaInicio?: string;
  fechaFinalizacion?: string;
  tipoObra?: string;
}

/** Response wrapper for GET /pqrs/mi-pqrs/{idCasa} */
export interface GetMisPqrsResponse {
  message: string;
  data: PqrsItem[];
}

// =============================================================================
// API Request Types
// =============================================================================

/** Worker info for POST/PUT requests */
export interface TrabajadorRequest {
  nombre: string;
  identificacion: number;
  arl: string;
}

/** Request body for POST /pqrs and PUT /pqrs/mi-pqrs/{id} */
export interface PqrsCreateUpdateRequest {
  id?: number; // Optional for create, required for update
  titulo: string;
  descripcion: string;
  tipoPqrs: TipoPqrsAPI;
  tipoObra?: string;
  fechaInicio?: string; // ISO date string
  fechaFinalizacion?: string; // ISO date string
  trabajadores?: TrabajadorRequest[];
}

/** Response wrapper for POST /pqrs */
export interface PqrsCreateResponse {
  message: string;
  data: {
    id: number;
    titulo: string;
    descripcion: string;
    tipoPqrs: TipoPqrsAPI;
    tipoObra?: string;
    fechaInicio?: string;
    fechaFinalizacion?: string;
    trabajadores?: TrabajadorRequest[];
  };
}

/** Response wrapper for DELETE /pqrs/mi-pqrs/{id} */
export interface PqrsDeleteResponse {
  message: string;
  data: {
    id: number;
    titulo: string;
    descripcion: string;
    createdDate: string;
    casa: PqrsCasa;
    tipoPqrs: TipoPqrsAPI;
    estadoPqrs: EstadoPqrsAPI;
    solicitante?: {
      nombreCompleto: string;
      telefono: number;
      correo: string;
    };
  };
}

/** Response wrapper for PUT /pqrs/mi-pqrs/{id} */
export interface PqrsUpdateResponse {
  message: string;
  data: {
    id: number;
    titulo: string;
    descripcion: string;
    tipoPqrs: TipoPqrsAPI;
    tipoObra?: string;
    fechaInicio?: string;
    fechaFinalizacion?: string;
    trabajadores?: TrabajadorRequest[];
  };
}

// =============================================================================
// Detail Endpoint Types (GET /pqrs/detalle/{id})
// =============================================================================

/** Solicitante info from detail endpoint */
export interface PqrsSolicitante {
  nombreCompleto: string;
  telefono: number;
  correo: string;
}

/** Trabajador info from detail endpoint (includes id, omits pqrsEntity) */
export interface TrabajadorDetalle {
  id: number;
  nombre: string;
  identificacion: number;
  arl: string;
}

/** Detail data from GET /pqrs/detalle/{id} */
export interface PqrsDetalleData {
  id: number;
  titulo: string;
  descripcion: string;
  createdDate: string;
  casa: PqrsCasa;
  tipoPqrs: TipoPqrsAPI;
  estadoPqrs: EstadoPqrsAPI;
  solicitante?: PqrsSolicitante;
  tipoObra?: string;
  fechaInicio?: string;
  fechaFinalizacion?: string;
  trabajadores?: TrabajadorDetalle[];
}

/** Response wrapper for GET /pqrs/detalle/{id} */
export interface PqrsDetalleResponse {
  message: string;
  data: PqrsDetalleData;
}

// =============================================================================
// UI Adapted Types
// =============================================================================

/** UI type mapping for solicitud tipo (matches existing Solicitud interface) */
export type TipoSolicitudUI = 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia';

/** UI type mapping for solicitud estado */
export type EstadoSolicitudUI = 'pendiente' | 'aprobada' | 'revisada' | 'desaprobada';

/** Worker info adapted for UI (matches existing Trabajador interface) */
export interface TrabajadorUI {
  nombre: string;
  documento: string; // UI uses string, API uses number
  arl: string;
}

/** 
 * Adapted solicitud for UI consumption
 * This matches the existing Solicitud interface in solicitud.types.ts
 */
export interface SolicitudAdaptada {
  id: string;
  casaId: string;
  numeroCasa: string;
  propietario: string;
  titulo: string;
  tipo: TipoSolicitudUI;
  fecha: string;
  estado: EstadoSolicitudUI;
  descripcion?: string;
  tipoObra?: string;
  fechaInicio?: string;
  fechaFinalizacion?: string;
  trabajadores?: TrabajadorUI[];
}
