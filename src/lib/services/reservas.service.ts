// 📁 src/lib/services/reservas.service.ts
import apiClient from "../config/axios.config";
import { Reserva } from "@/types/reserva.types";

export const reservasService = {
    async getReservasPendientes(): Promise<Reserva[]> {
        try {
            const response = await apiClient.get("/solicitud-recurso/reservas?estado=PENDIENTE");
            return response.data.data || [];
        } catch (error) {
            console.error("Error al obtener reservas pendientes:", error);
            throw error;
        }
    },

    async getReservasAprobadas(): Promise<Reserva[]> {
        try {
            const response = await apiClient.get("/solicitud-recurso/reservas?estado=APROBADA")
            return response.data.data || [];
        } catch (error) {
            console.error("Error al obtener reservas aprobadas:", error);
            throw error;
        }
    },

    async getReservasRechazadas(): Promise<Reserva[]> {
        try {
            const response = await apiClient.get("/solicitud-recurso/reservas?estado=RECHAZADA");
            return response.data.data || [];
        } catch (error) {
            console.error("Error al obtener reservas rechazadas:", error);
            throw error;
        }
    },

    async getAllReservas(): Promise<Reserva[]> {
        try {
            const response = await apiClient.get("/solicitud-recurso/reservas");
            return response.data || [];
        } catch (error) {
            console.error("Error al obtener todas las reservas:", error);
            throw error;
        }
    },

    async createReserva(data: Partial<Reserva>): Promise<Reserva> {
        try {
            const response = await apiClient.post("/solicitud-recurso/reservas", data);
            return response.data;
        } catch (error) {
            console.error("Error al crear reserva:", error);
            throw error;
        }
    },

    async updateReserva(id: number, data: Partial<Reserva>): Promise<Reserva> {
        try {
            const response = await apiClient.put(`/solicitud-recurso/reservas/${id}`, data);
            return response.data.data;
        } catch (error) {
            console.error("Error al actualizar reserva:", error);
            throw error;
        }
    },

    async deleteReserva(id: number): Promise<void> {
        try {
            await apiClient.delete(`/solicitud-recurso/reservas/${id}`);
        } catch (error) {
            console.error("Error al eliminar reserva:", error);
            throw error;
        }
    }
};
