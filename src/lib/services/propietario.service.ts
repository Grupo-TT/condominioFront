
import { PropietarioFormData } from "@/lib/validations/propietario.validation"
import apiClient from "../config/axios.config"

export const propietarioService = {
  // POST /personas/registrar
  create: async (data: PropietarioFormData) => {
    try {
      const propietario = {
        primerNombre: data.primerNombre.trim(),
        segundoNombre: data.segundoNombre?.trim() ?? "",
        primerApellido: data.primerApellido.trim(),
        segundoApellido: data.segundoApellido?.trim() ?? "",
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: parseInt(data.numeroDocumento, 10),
        telefono: parseInt(data.telefono, 10),
        idCasa: parseInt(data.idCasa, 10),
        rolEnCasa: data.rolEnCasa,
        email: data.email.trim().toLowerCase()
      };
      
      const response = await apiClient.post("/persona/register", propietario);
      return response;
    } catch (error) {
      throw error;
    }
  },
}