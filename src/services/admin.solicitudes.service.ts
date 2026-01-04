/**
 * Service for admin's solicitudes (PQRS) API endpoints
 * Provides operations for managing PQRS requests as admin
 */
import apiClient from "@/lib/config/axios.config";
import type {
    PqrsItem,
    PqrsDetalleData,
    PqrsDetalleResponse,
} from "@/types/propietario.solicitudes.types";

// Response types for admin endpoints
interface GetAllPqrsResponse {
    message: string;
    data: PqrsItem[];
}

interface UpdateEstadoResponse {
    message: string;
    data: {
        id: number;
        titulo: string;
        descripcion: string;
        createdDate: string;
        casa: {
            id: number;
            numeroCasa: number;
        };
        tipoPqrs: PqrsItem['tipoPqrs'];
        estadoPqrs: PqrsItem['estadoPqrs'];
        solicitante?: {
            nombreCompleto: string;
            telefono: number;
            correo: string;
        };
    };
}

interface DeletePqrsResponse {
    message: string;
    data: object;
}

export type EstadoPqrs = 'PENDIENTE' | 'REVISADA' | 'APROBADA' | 'RECHAZADA' | 'DESAPROBADA';

export const adminPqrsService = {
    /**
     * Get all PQRS (admin view)
     * GET /pqrs
     */
    async getAllPqrs(): Promise<PqrsItem[]> {
        const response = await apiClient.get<GetAllPqrsResponse>('/pqrs');
        return response.data.data;
    },

    /**
     * Update PQRS status
     * PUT /pqrs/estado/{id}?estado=ESTADO
     */
    async updateEstado(id: number, estado: EstadoPqrs): Promise<UpdateEstadoResponse> {
        const response = await apiClient.put<UpdateEstadoResponse>(
            `/pqrs/estado/${id}?estado=${estado}`
        );
        return response.data;
    },

    /**
     * Get full details of a PQRS (including trabajadores)
     * GET /pqrs/detalle/{id}
     */
    async getDetalle(id: number): Promise<PqrsDetalleData> {
        const response = await apiClient.get<PqrsDetalleResponse>(
            `/pqrs/detalle/${id}`
        );
        return response.data.data;
    },

    /**
     * Delete a PQRS
     * DELETE /pqrs/{id}
     */
    async deletePqrs(id: number): Promise<DeletePqrsResponse> {
        const response = await apiClient.delete<DeletePqrsResponse>(
            `/pqrs/${id}`
        );
        return response.data;
    },
};
