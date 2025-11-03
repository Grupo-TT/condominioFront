import { get } from 'http';
import { apiClient } from '../lib/config/axios.config'
import { RecursoRequest, RecursoResponse } from '../types/recursos.types';

export const recursoService = {
    async postRecurso(data: RecursoRequest): Promise<RecursoResponse> {
        const response = await apiClient.post('/recurso/create', data);
        // Normalizar si el backend devuelve { message, data: { ... } }
        const body = response.data
        if (body && typeof body === 'object' && 'data' in body) return body.data as RecursoResponse
        return body as RecursoResponse
    },
    async putRecurso(id: number, data: RecursoRequest): Promise<RecursoResponse> {
        const response = await apiClient.put(`/recurso/edit/${id}`, data);
        const body = response.data
        if (body && typeof body === 'object' && 'data' in body) return body.data as RecursoResponse
        return body as RecursoResponse
    },
    async getRecurso(): Promise<RecursoResponse[]> {
        const response = await apiClient.get(`/recurso/all`);
        const body = response.data
        if (Array.isArray(body)) return body as RecursoResponse[]
        if (body && typeof body === 'object' && Array.isArray((body as any).data)) return (body as any).data as RecursoResponse[]
        return []
    }
}