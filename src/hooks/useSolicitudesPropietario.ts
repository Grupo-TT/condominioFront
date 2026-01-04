/**
 * Hook for managing owner's solicitudes (PQRS)
 * Handles state management, API calls, and data adaptation
 */
import { useState, useCallback } from 'react';
import { pqrsService } from '@/services/propietario.solicitudes.service';
import type {
    PqrsItem,
    PqrsCreateUpdateRequest,
    SolicitudAdaptada,
    TipoSolicitudUI,
    EstadoSolicitudUI,
    TrabajadorUI,
    TrabajadorRequest,
    TipoPqrsAPI,
    TrabajadorDetalle,
    PqrsDetalleData,
} from '@/types/propietario.solicitudes.types';

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

/** Map UI tipo to API tipo */
const mapTipoToAPI = (tipo: TipoSolicitudUI): TipoPqrsAPI => {
    const mapping: Record<TipoSolicitudUI, TipoPqrsAPI> = {
        queja: 'QUEJA',
        peticion: 'PETICION',
        sugerencia: 'SUGERENCIA',
        'reparacion-locativa': 'REPARACION_LOCATIVA',
    };
    return mapping[tipo] || 'PETICION';
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

/** Adapt API PQRS item to UI Solicitud format */
const adaptPqrsToUI = (item: PqrsItem): SolicitudAdaptada => ({
    id: String(item.id),
    casaId: String(item.casa.id),
    numeroCasa: String(item.casa.numeroCasa),
    propietario: '', // Not returned by this endpoint
    titulo: item.titulo,
    tipo: mapTipoToUI(item.tipoPqrs),
    fecha: item.createdDate,
    estado: mapEstadoToUI(item.estadoPqrs),
    descripcion: item.descripcion,
    tipoObra: item.tipoObra,
    fechaInicio: item.fechaInicio,
    fechaFinalizacion: item.fechaFinalizacion,
    // Note: trabajadores are not returned in GET response, only in POST/PUT
});

/** Convert UI trabajador to API format */
const mapTrabajadorToAPI = (trabajador: TrabajadorUI): TrabajadorRequest => ({
    nombre: trabajador.nombre,
    identificacion: parseInt(trabajador.documento, 10) || 0,
    arl: trabajador.arl,
});

// =============================================================================
// Hook definition
// =============================================================================

export interface CreateSolicitudData {
    titulo: string;
    descripcion: string;
    tipo: TipoSolicitudUI;
    tipoObra?: string;
    fechaInicio?: string;
    fechaFinalizacion?: string;
    trabajadores?: TrabajadorUI[];
}

export interface UpdateSolicitudData extends CreateSolicitudData {
    id: string;
}

export function useSolicitudesPropietario() {
    const [solicitudes, setSolicitudes] = useState<SolicitudAdaptada[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Operation-specific loading states
    const [creating, setCreating] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [loadingDetalle, setLoadingDetalle] = useState(false);

    /**
     * Fetch all solicitudes for the user's house
     */
    const fetchSolicitudes = useCallback(async (idCasa: number) => {
        try {
            setLoading(true);
            setError(null);

            const response = await pqrsService.getMisPqrs(idCasa);
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
     * Create a new solicitud
     */
    const createSolicitud = useCallback(async (data: CreateSolicitudData) => {
        try {
            setCreating(true);
            setError(null);

            const payload: PqrsCreateUpdateRequest = {
                titulo: data.titulo,
                descripcion: data.descripcion,
                tipoPqrs: mapTipoToAPI(data.tipo),
            };

            // Add reparacion-locativa specific fields
            if (data.tipo === 'reparacion-locativa') {
                if (data.tipoObra) {
                    payload.tipoObra = data.tipoObra;
                }
                if (data.fechaInicio) {
                    payload.fechaInicio = data.fechaInicio;
                }
                if (data.fechaFinalizacion) {
                    payload.fechaFinalizacion = data.fechaFinalizacion;
                }
                if (data.trabajadores && data.trabajadores.length > 0) {
                    payload.trabajadores = data.trabajadores.map(mapTrabajadorToAPI);
                }
            }

            const response = await pqrsService.createPqrs(payload);
            return response;
        } catch (err: unknown) {
            let errorMessage = 'Ocurrió un error creando la solicitud';

            // Try to extract backend error message
            const axiosError = err as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setCreating(false);
        }
    }, []);

    /**
     * Update an existing solicitud
     */
    const updateSolicitud = useCallback(async (data: UpdateSolicitudData) => {
        try {
            setUpdating(true);
            setError(null);

            const id = parseInt(data.id, 10);

            const payload: PqrsCreateUpdateRequest = {
                id,
                titulo: data.titulo,
                descripcion: data.descripcion,
                tipoPqrs: mapTipoToAPI(data.tipo),
            };

            // Add reparacion-locativa specific fields
            if (data.tipo === 'reparacion-locativa') {
                if (data.tipoObra) {
                    payload.tipoObra = data.tipoObra;
                }
                if (data.fechaInicio) {
                    payload.fechaInicio = data.fechaInicio;
                }
                if (data.fechaFinalizacion) {
                    payload.fechaFinalizacion = data.fechaFinalizacion;
                }
                if (data.trabajadores && data.trabajadores.length > 0) {
                    payload.trabajadores = data.trabajadores.map(mapTrabajadorToAPI);
                }
            }

            const response = await pqrsService.updatePqrs(id, payload);
            return response;
        } catch (err: unknown) {
            let errorMessage = 'Ocurrió un error actualizando la solicitud';

            const axiosError = err as { response?: { data?: { message?: string } } };
            if (axiosError?.response?.data?.message) {
                errorMessage = axiosError.response.data.message;
            } else if (err instanceof Error) {
                errorMessage = err.message;
            }

            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setUpdating(false);
        }
    }, []);

    /**
     * Delete a solicitud
     */
    const deleteSolicitud = useCallback(async (id: string) => {
        try {
            setDeleting(true);
            setError(null);

            const numericId = parseInt(id, 10);
            const response = await pqrsService.deletePqrs(numericId);
            return response;
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

    /**
     * Fetch full details of a reparacion-locativa solicitud (includes trabajadores)
     */
    const fetchDetalle = useCallback(async (id: string): Promise<SolicitudAdaptada | null> => {
        try {
            setLoadingDetalle(true);
            setError(null);

            const numericId = parseInt(id, 10);
            const detalle: PqrsDetalleData = await pqrsService.getDetalle(numericId);

            // Adapt to UI format including trabajadores
            const adapted: SolicitudAdaptada = {
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
            };

            return adapted;
        } catch (err: unknown) {
            const message = err instanceof Error
                ? err.message
                : 'Ocurrió un error obteniendo el detalle de la solicitud';
            setError(message);
            console.error('Error fetching detalle:', err);
            return null;
        } finally {
            setLoadingDetalle(false);
        }
    }, []);

    return {
        // Data
        solicitudes,

        // Loading states
        loading,
        creating,
        updating,
        deleting,
        loadingDetalle,

        // Error
        error,

        // Actions
        fetchSolicitudes,
        fetchDetalle,
        createSolicitud,
        updateSolicitud,
        deleteSolicitud,
    };
}
