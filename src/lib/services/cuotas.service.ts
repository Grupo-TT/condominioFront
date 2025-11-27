import { PagoPayload } from "@/types/cuotas.types";
import apiClient from "../config/axios.config";

export const getPorCobrar = async () => {
  try {
    const { data } = await apiClient.get("/casa/obligaciones-casa");
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener las casas por cobrar:", error.response?.data || error.message);
    throw error;
  }
};
export const registrarPago = async (payload: PagoPayload) => {
  try {
    const { data } = await apiClient.post("/pago", payload);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al registrar el pago:", error.response?.data || error.message);
    throw error;
  }
};

export const enviarPazYSalvo = async (idCasa: number) => {
  try {
    await apiClient.get(`/obligacion/paz-y-salvo/${idCasa}`);
    return true;
  } catch (error: any) {
    console.error("Error al llamar al endpoint paz y salvo:", error.response?.data || error.message);
    throw error;
  }
};