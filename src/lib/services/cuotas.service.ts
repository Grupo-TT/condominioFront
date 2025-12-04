import { PagoPayload } from "@/types/cuotas.types";
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