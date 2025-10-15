

import { api } from "./client";

// Tipo de datos de una casa
import { Casa } from "@/types/casa.types";

export const casasApi = {
  async obtenerTodas(): Promise<Casa[]> {
    const response = await api.get("/Casa/All");
    return response.data;
  },

  async obtenerPorId(id: string): Promise<Casa> {
    const response = await api.get(`/Casas/${id}`);
    return response.data;
  },

  async crearCasa(data: Partial<Casa>) {
    const response = await api.post("/Casas", data);
    return response.data;
  },

  async eliminarCasa(id: string) {
    await api.delete(`/Casas/${id}`);
  },
};
