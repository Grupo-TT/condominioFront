

import apiClient from "../config/axios.config"

export const casaService = {
  // POST /propietarios
  getCasas: () => apiClient.get("/Casas/All"),

}