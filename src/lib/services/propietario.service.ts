
import { PropietarioFormData } from "@/lib/validations/propietario.validation"
import apiClient from "../config/axios.config"

export const propietarioService = {
  // POST /personas/registrar
  create: async (data: PropietarioFormData) => {
    try {
      const propietario = {
        primerNombre: data.primerNombre.trim().toLowerCase(),
        segundoNombre: data.segundoNombre?.trim().toLowerCase() ?? "",
        primerApellido: data.primerApellido.trim().toLowerCase(),
        segundoApellido: data.segundoApellido?.trim().toLowerCase() ?? "",
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        correoElectronico: data.email.trim().toLowerCase,
        telefono: data.telefono,
        rolEnCasa: data.rolEnCasa,
        idCasa: data.idCasa
      };
      
      const response = await apiClient.post("/persona/register", propietario);
      return response;
    } catch (error) {
      // console.error("Error en propietarioService.create:", error);
      throw error;
    }
  },
}