import apiClient from "@/lib/config/axios.config";
import { GetReservasPropResponse, ReservaPropSaveResponse, ReservaPropUpdateRequest, ReservaPropInvitadosRequest, ReservaPropCreateRequest, ReservaPropietarioItem  } from "@/types/propietario.reservas.types";

export const reservasService = {
  async getReservasPropietario(id: number): Promise<ReservaPropietarioItem[]> {
    const response = await apiClient.get<GetReservasPropResponse>(`/solicitud-recurso/mis-reservas/${id}`);
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
  async putInvitadosReservaProp(data: ReservaPropInvitadosRequest): Promise<ReservaPropSaveResponse> {
    const response = await apiClient.put<ReservaPropSaveResponse>(`/solicitud-recurso/invitados`, data);
    return response.data;
  },
}