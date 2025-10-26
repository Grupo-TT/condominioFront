import apiClient from "../config/axios.config";

export const getEstadoCuenta = async (casaId: number) => {
  const { data } = await apiClient.get(`/casas/${casaId}/estado-cuenta`);
  console.log("Estado de cuenta data:", data);
  return data;
};


export const registrarPago = async (payload: {
  soporte: string;
  obligacionId?: string;
  monto: number;
}) => {
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