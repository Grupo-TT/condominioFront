
import { PropietarioFormData } from "@/lib/validations/propietario.validation"
import apiClient from "../config/axios.config"

export const propietarioService = {
  // POST /personas/registrar
  create: async (data: PropietarioFormData) => {
    try {
      const response = await apiClient.post("/persona/register", data);
      return response;
    } catch (error) {
      console.error("Error en propietarioService.create:", error);
      throw error;
    }
  },
}