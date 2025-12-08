import { CreateMovimiento, PagoPayload } from "@/types/cuotas.types";
import apiClient from "../config/axios.config";
import { isAxiosError } from "axios";

type PazYSalvoResponse = {
  message?: string;
};

export const getPorCobrar = async () => {
  try {
    const { data } = await apiClient.get("/casa/obligaciones-casa");
    return data;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data || error.message
      : error instanceof Error
      ? error.message
      : "Error desconocido";
    console.error("Error al obtener las casas por cobrar:", message);
    throw error;
  }
};
export const registrarPago = async (payload: PagoPayload) => {
  try {
    const { data } = await apiClient.post("/pago", payload);
    return data;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data || error.message
      : error instanceof Error
      ? error.message
      : "Error desconocido";
    console.error("Error al registrar el pago:", message);
    throw error;
  }
};

export const enviarPazYSalvo = async (idCasa: number): Promise<PazYSalvoResponse> => {
  try {
    const { data } = await apiClient.get<PazYSalvoResponse>(
      `/obligacion/paz-y-salvo/${idCasa}`
    );
    return data;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data || error.message
      : error instanceof Error
      ? error.message
      : "Error desconocido";
    console.error("Error al llamar al endpoint paz y salvo:", message);
    throw error;
  }
};

export const getMovimientosMes = async (mes: number, anio: number) => {
  try {
    const { data } = await apiClient.get("/movimientos/por-mes", {
      params: {
        mes,
        año: anio,
      },
    });
    return data;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data || error.message
      : error instanceof Error
      ? error.message
      : "Error desconocido";
    console.error("Error al obtener los movimientos del mes:", message);
    throw error;
  }
};

export const registrarMovimiento = async (payload: CreateMovimiento) => {
  try {
    const { data } = await apiClient.post("/movimientos/crear-movimiento", payload);
    return data;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data || error.message
      : error instanceof Error
      ? error.message
      : "Error desconocido";
    console.error("Error al registrar el movimiento:", message);
    throw error;
  }
};

export const editarMovimiento = async (id: number | string, payload: CreateMovimiento) => {
  try {
    const { data } = await apiClient.put(`/movimientos/edit-movimiento/${id}`, payload);
    return data;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data || error.message
      : error instanceof Error
      ? error.message
      : "Error desconocido";
    console.error("Error al modificar el movimiento:", message);
    throw error;
  }
};

export const eliminarMovimiento = async (id: number | string) => {
  try {
    const { data } = await apiClient.delete(`/movimientos/eliminar-movimiento/${id}`);
    return data;
  } catch (error: unknown) {
    const message = isAxiosError(error)
      ? error.response?.data || error.message
      : error instanceof Error
      ? error.message
      : "Error desconocido";

    console.error("Error al eliminar el movimiento:", message);
    throw error;
  }
};