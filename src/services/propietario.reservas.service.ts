import apiClient from "@/lib/config/axios.config";
import { GetReservasPropResponse, ReservaPropSaveResponse, ReservaPropUpdateRequest, ReservaPropCreateRequest, ReservaPropietarioItem  } from "@/types/propietario.reservas.types";

export const reservasService = {
  async getReservasPropietario(): Promise<ReservaPropietarioItem[]> {
    const response = await apiClient.get<GetReservasPropResponse>(`/solicitud-recurso/all`);
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