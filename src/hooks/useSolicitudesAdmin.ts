/**
 * Hook for managing admin's solicitudes (PQRS)
 * Handles state management, API calls, and data adaptation
 */
import { useState, useCallback } from 'react';
import { adminPqrsService, EstadoPqrs } from '@/services/admin.solicitudes.service';
import type {
    PqrsItem,
    PqrsDetalleData,
    TrabajadorDetalle,
} from '@/types/propietario.solicitudes.types';

// =============================================================================
// Types
// =============================================================================

/** Solicitud type for UI (matching existing Solicitud interface) */
export type TipoSolicitudUI = 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia';
export type EstadoSolicitudUI = 'pendiente' | 'aprobada' | 'revisada' | 'desaprobada';

export interface TrabajadorUI {
    nombre: string;
    documento: string;
    arl: string;
}

export interface SolicitudAdmin {
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

// =============================================================================
// Mapping utilities
// =============================================================================

/** Map API tipo to UI tipo */
const mapTipoToUI = (tipoPqrs: PqrsItem['tipoPqrs']): TipoSolicitudUI => {
    const mapping: Record<PqrsItem['tipoPqrs'], TipoSolicitudUI> = {
        QUEJA: 'queja',
        PETICION: 'peticion',
        SUGERENCIA: 'sugerencia',
        REPARACION_LOCATIVA: 'reparacion-locativa',
    };
    return mapping[tipoPqrs] || 'peticion';
};

/** Map API estado to UI estado */
const mapEstadoToUI = (estadoPqrs: PqrsItem['estadoPqrs']): EstadoSolicitudUI => {
    const mapping: Record<PqrsItem['estadoPqrs'], EstadoSolicitudUI> = {
        PENDIENTE: 'pendiente',
        APROBADA: 'aprobada',
        RECHAZADA: 'desaprobada',
        REVISADA: 'revisada',
        DESAPROBADA: 'desaprobada',
    };
    return mapping[estadoPqrs] || 'pendiente';
};

/** Map UI estado to API estado */
const mapEstadoToAPI = (estado: EstadoSolicitudUI): EstadoPqrs => {
    const mapping: Record<EstadoSolicitudUI, EstadoPqrs> = {
        pendiente: 'PENDIENTE',
        aprobada: 'APROBADA',

        revisada: 'REVISADA',
        desaprobada: 'DESAPROBADA',
    };
    return mapping[estado];
};

/** Adapt API PQRS item to UI Solicitud format */
const adaptPqrsToUI = (item: PqrsItem): SolicitudAdmin => ({
    id: String(item.id),
    casaId: String(item.casa.id),
    numeroCasa: String(item.casa.numeroCasa),
    propietario: '', // Will be populated from detalle if needed
    titulo: item.titulo,
    tipo: mapTipoToUI(item.tipoPqrs),
    fecha: item.createdDate,
    estado: mapEstadoToUI(item.estadoPqrs),
    descripcion: item.descripcion,
    tipoObra: item.tipoObra,
    fechaInicio: item.fechaInicio,
    fechaFinalizacion: item.fechaFinalizacion,
});

/** Adapt API detalle to UI format including trabajadores */
const adaptDetalleToUI = (detalle: PqrsDetalleData): SolicitudAdmin => ({
    id: String(detalle.id),
    casaId: String(detalle.casa.id),
    numeroCasa: String(detalle.casa.numeroCasa),
    propietario: detalle.solicitante?.nombreCompleto || '',
    titulo: detalle.titulo,
    tipo: mapTipoToUI(detalle.tipoPqrs),
    fecha: detalle.createdDate,
    estado: mapEstadoToUI(detalle.estadoPqrs),
    descripcion: detalle.descripcion,
    tipoObra: detalle.tipoObra,
    fechaInicio: detalle.fechaInicio,
    fechaFinalizacion: detalle.fechaFinalizacion,
    trabajadores: detalle.trabajadores?.map((t: TrabajadorDetalle) => ({
        nombre: t.nombre,
        documento: String(t.identificacion),
        arl: t.arl,
    })),
});

// =============================================================================
// Hook definition
// =============================================================================

export function useSolicitudesAdmin() {
    const [solicitudes, setSolicitudes] = useState<SolicitudAdmin[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Operation-specific loading states
    const [loadingDetalle, setLoadingDetalle] = useState(false);
    const [updatingEstado, setUpdatingEstado] = useState(false);
    const [deleting, setDeleting] = useState(false);

    /**
     * Fetch all solicitudes
     */
    const fetchSolicitudes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await adminPqrsService.getAllPqrs();
            const lista = Array.isArray(response) ? response : [];

            // Sort by date descending (most recent first)
            const sorted = [...lista].sort((a, b) =>
                new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
            );

            const adaptadas = sorted.map(adaptPqrsToUI);
            setSolicitudes(adaptadas);
        } catch (err: unknown) {
            const message = err instanceof Error
                ? err.message
                : 'Ocurrió un error obteniendo las solicitudes';
            setError(message);
            console.error('Error fetching solicitudes:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Fetch full details of a solicitud (includes trabajadores for reparacion-locativa)
     */
    const fetchDetalle = useCallback(async (id: string): Promise<SolicitudAdmin | null> => {
        try {
            setLoadingDetalle(true);
            setError(null);

            const numericId = parseInt(id, 10);
            const detalle = await adminPqrsService.getDetalle(numericId);

            return adaptDetalleToUI(detalle);
        } catch (err: unknown) {
            const message = err instanceof Error
                ? err.message
                : 'Ocurrió un error obteniendo el detalle';
            setError(message);
            console.error('Error fetching detalle:', err);
            return null;
        } finally {
            setLoadingDetalle(false);
        }
    }, []);

    /**
     * Update solicitud status
     */
    const cambiarEstado = useCallback(async (id: string, nuevoEstado: EstadoSolicitudUI) => {
        try {
            setUpdatingEstado(true);
            setError(null);

            const numericId = parseInt(id, 10);
            const estadoAPI = mapEstadoToAPI(nuevoEstado);

            await adminPqrsService.updateEstado(numericId, estadoAPI);

            // Update local state
            setSolicitudes(prev => prev.map(s =>
                s.id === id ? { ...s, estado: nuevoEstado } : s
            ));

            return true;
        } catch (err: unknown) {
            let errorMessage = 'Ocurrió un error actualizando el estado';

            const axiosError = err as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setUpdatingEstado(false);
        }
    }, []);

    /**
     * Delete a solicitud
     */
    const eliminarSolicitud = useCallback(async (id: string) => {
        try {
            setDeleting(true);
            setError(null);

            const numericId = parseInt(id, 10);
            await adminPqrsService.deletePqrs(numericId);

            // Remove from local state
            setSolicitudes(prev => prev.filter(s => s.id !== id));

            return true;
        } catch (err: unknown) {
            let errorMessage = 'Ocurrió un error eliminando la solicitud';

            const axiosError = err as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setDeleting(false);
        }
    }, []);

    return {
        // Data
        solicitudes,

        // Loading states
        loading,
        loadingDetalle,
        updatingEstado,
        deleting,

        // Error
        error,

        // Actions
        fetchSolicitudes,
        fetchDetalle,
        cambiarEstado,
        eliminarSolicitud,
    };
}
