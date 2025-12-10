// Types for Owner Dashboard API Responses

// Response from GET /dashboard-propietario/info
export interface OwnerInfoResponse {
    message: string;
    data: OwnerInfoData;
}

export interface OwnerInfoData {
    numeroCasa: string;
    tipoUso: 'RESIDENCIAL' | 'ARRENDADA';
    cantidadMiembros: number;
    cantidadMascotas: number;
}

// Response from GET /dashboard-propietario/account-status
export interface AccountStatusResponse {
    message: string;
    data: AccountStatusData;
}

export interface AccountStatusData {
    saldoPendiente: number;
    estadoCasa: 'AL_DIA' | 'EN_MORA';
    ultimoPago: UltimoPago | null;
}

export interface UltimoPago {
    fecha: string;
    concepto: string;
    valor: number;
    tipoAbono: 'COMPLETO' | 'ABONO';
}

// Response from GET /dashboard-propietario/solicitudes
export interface OwnerSolicitudesResponse {
    message: string;
    data: OwnerSolicitudItem[];
}

export interface OwnerSolicitudItem {
    id: number;
    titulo: string;
    tipo: 'REPARACION_LOCATIVA' | 'QUEJA' | 'PETICION' | 'SUGERENCIA';
    fecha: string;
    estado: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA' | 'REVISADA';
    descripcion?: string;
}

// Adapted types for UI consumption
export interface OwnerInfoUI {
    numeroCasa: string;
    tipoUso: string;
    cantidadMiembros: number;
    cantidadMascotas: number;
}

export interface AccountStatusUI {
    saldoPendiente: string;
    estadoCasa: 'AL_DIA' | 'EN_MORA';
    ultimoPago: {
        fecha: string;
        concepto: string;
        valor: string;
        tipoAbono: 'COMPLETO' | 'ABONO';
    } | null;
}

export interface SolicitudUI {
    id: string;
    titulo: string;
    tipo: 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia';
    fecha: string;
    estado: 'pendiente' | 'aprobada' | 'rechazada' | 'revisada';
    descripcion?: string;
}
