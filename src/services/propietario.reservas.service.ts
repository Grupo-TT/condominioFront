import apiClient from "@/lib/config/axios.config";
import { GetReservasPropResponse, GetMisReservasResponse, MisReservasItem, ReservaPropietarioItem, ReservaPropSaveResponse, ReservaPropUpdateRequest, ReservaPropCreateRequest } from "@/types/propietario.reservas.types";

export const reservasService = {
  // Para disponibilidad - obtiene TODAS las reservas
  async getReservasPropietario(): Promise<ReservaPropietarioItem[]> {
    const response = await apiClient.get<GetReservasPropResponse>(`/solicitud-recurso/all`);
    return response.data.data;
  },
  // Para "Mis Reservas" - solo las del usuario (por casa)
  async getMisReservas(idCasa: number): Promise<MisReservasItem[]> {
    const response = await apiClient.get<GetMisReservasResponse>(`/solicitud-recurso/mis-reservas/${idCasa}`);
    return response.data.data;
  },
  async deleteReserva(id: number): Promise<{ message: string }> {
    const response = await apiClient.delete<{ message: string }>(`/solicitud-recurso/mis-reservas/delete/${id}`);
    return response.data;
  },
  async postReserva(data: ReservaPropCreateRequest): Promise<ReservaPropSaveResponse> {
    const response = await apiClient.post<ReservaPropSaveResponse>(`/solicitud-recurso/crear`, data);
    return response.data;
  },
  async putReservaPropietario(data: ReservaPropUpdateRequest): Promise<ReservaPropSaveResponse> {
    const response = await apiClient.put<ReservaPropSaveResponse>(`/solicitud-recurso/mis-reservas/update`, data);
    return response.data;
  },
}