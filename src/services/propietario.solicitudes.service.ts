/**
 * Service for owner's solicitudes (PQRS) API endpoints
 * Provides CRUD operations for PQRS requests
 */
import apiClient from "@/lib/config/axios.config";
import type {
    GetMisPqrsResponse,
    PqrsItem,
    PqrsCreateUpdateRequest,
    PqrsCreateResponse,
    PqrsUpdateResponse,
    PqrsDeleteResponse,
    PqrsDetalleResponse,
    PqrsDetalleData,
} from "@/types/propietario.solicitudes.types";

export const pqrsService = {
    /**
     * Get all PQRS for the current user's house
     * GET /pqrs/mi-pqrs/{idCasa}
     */
    async getMisPqrs(idCasa: number): Promise<PqrsItem[]> {
        const response = await apiClient.get<GetMisPqrsResponse>(
            `/pqrs/mi-pqrs/${idCasa}`
        );
        return response.data.data;
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
     * Create a new PQRS request
     * POST /pqrs
     */
    async createPqrs(data: PqrsCreateUpdateRequest): Promise<PqrsCreateResponse> {
        const response = await apiClient.post<PqrsCreateResponse>(`/pqrs`, data);
        return response.data;
    },

    /**
     * Update an existing PQRS request
     * PUT /pqrs/mi-pqrs/{id}
     */
    async updatePqrs(
        id: number,
        data: PqrsCreateUpdateRequest
    ): Promise<PqrsUpdateResponse> {
        const response = await apiClient.put<PqrsUpdateResponse>(
            `/pqrs/mi-pqrs/${id}`,
            data
        );
        return response.data;
    },

    /**
     * Delete a PQRS request
     * DELETE /pqrs/mi-pqrs/{id}
     */
    async deletePqrs(id: number): Promise<PqrsDeleteResponse> {
        const response = await apiClient.delete<PqrsDeleteResponse>(
            `/pqrs/mi-pqrs/${id}`
        );
        return response.data;
    },
};
