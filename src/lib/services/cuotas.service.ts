import { PagoPayload } from "@/types/cuotas.types";
import apiClient from "../config/axios.config";

export const getEstadoCuenta = async (casaId: number) => {
  const { data } = await apiClient.get(`/casa/${casaId}/estado-cuenta`);
  console.log("Estado de cuenta data:", data);
  return data;
};

export const getEstadosCuenta = async () => {
  try {
    const { data } = await apiClient.get("/casa/por-cobrar");
    console.log("Estados de cuenta:", data);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al obtener estados de cuenta:", error.response?.data || error.message);
    throw error;
  }
};
export const registrarPago = async (payload: PagoPayload) => {
  try {
    const { data } = await apiClient.post("/pago", payload);
    console.log("Pago registrado:", data);
    return data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al registrar el pago:", error.response?.data || error.message);
    throw error;
  }
};