import { Asamblea, Asistente, CreateAsambleaData, UpdateAsambleaData } from "@/types/asamblea.types";
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
            const propietarios = response.data.data.propietarios; // extraemos el array
            return propietarios.map((p: any) => ({
                id: String(p.numeroCasa),      // asigna un id único si quieres
                nombre: p.nombrePropietario,  // o como lo tengas en Asistente
                asistio: false
            }));
        } catch (error) {
            console.error("No se pudo obtener la asistencia.", error);
            throw error;
        }
    }
}