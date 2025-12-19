import { Asamblea, Asistente, CreateAsambleaData, Propietario, UpdateAsambleaData } from "@/types/asamblea.types";
import { apiClient } from "../config/axios.config";

interface AsambleaApiResponse {
    message: string;
    data: Asamblea[];
}

export const AsambleaService = {
    async getAll() {
        try {
            const response = await apiClient.get<AsambleaApiResponse>("/asamblea");
            return response.data.data || [];
        } catch (error) {
            console.error("Error al obtener el historial de asambleas:", error);
            throw error;
        }
    },
    async createAsamblea(data: CreateAsambleaData) {
        try {
            const response = await apiClient.post("/asamblea/crear", data);
            return response.data;
        } catch (error) {
            console.error("No se pudo crear la asamblea.", error);
            throw error;
        }
    },
    async updateAsamblea(id: number, data: UpdateAsambleaData) {
        try {
            const response = await apiClient.put(`/asamblea/edit/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("No se pudo modificar la asamblea.", error);
            throw error;
        }
    },
    async deleteAsamblea(id: number) {
        try {
            const response = await apiClient.delete(`/asamblea/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error("No se pudo eliminar la asamblea.", error);
            throw error;
        }
    },
    async getAsistentes(id: string): Promise<Asistente[]> {
        try {
            const response = await apiClient.get(`/asamblea/${id}`);
            const propietarios = response.data.data?.propietarios || [];

            if (!Array.isArray(propietarios) || propietarios.length === 0) {
                console.warn(`No se encontraron propietarios para la asamblea ${id}`);
                return [];
            }

            return propietarios.map((p: Propietario) => ({
                id: p.numeroCasa,
                nombre: p.nombrePropietario,
                asistio: p.asistio ?? false
            }));
        } catch (error) {
            console.error("No se pudo obtener la asistencia.", error);
            throw error;
        }
    },
    async markAsistencia(idAsamblea: number, numeroCasa: number, asistio: boolean): Promise<void> {
        try {
            const data = { numeroCasa, estado: asistio };
            await apiClient.post(`/asistencia/registrar/${idAsamblea}`, data);
        } catch (error) {
            console.error('No se pudo actualizar la asistencia.', error);
            throw error;
        }
    },
    async cambiarEstado(id: number, estado: string): Promise<void> {
        try {
            await apiClient.put(`/asamblea/cambiar-estado/${id}?estado=${estado}`);
        } catch (error) {
            console.error('No se pudo cambiar el estado de la asamblea.', error);
            throw error;
        }
    }
}