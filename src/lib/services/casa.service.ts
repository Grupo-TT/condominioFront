import {
  CreateMiembroHogar,
  MiembroHogar,
  UpdateMiembroHogar,
} from "@/types/casa.types";
import { apiClient } from "../config/axios.config";

interface CasaFromAPI {
  numeroCasa: number;
  propietario: {
    nombreCompleto: string;
    telefono: number;
    correo: string;
  };
  cantidadMiembros: number;
  cantidadMascotas: number;
  mascotas: {
    "TipoMascota.PERRO"?: number;
    "TipoMascota.GATO"?: number;
    "TipoMascota.OTRO"?: number;
  };
  estadoFinancieroCasa: string;
  usoCasa: string;
}

interface CasasApiResponse {
  message: string;
  data: CasaFromAPI[];
}

export function adaptCasaFromAPI(casaApi: CasaFromAPI) {
  // NOTA: El backend envía las mascotas con formato "TipoMascota.PERRO" en lugar de solo "PERRO"
  // Esto es un issue conocido del backend que usa toString() del enum
  const mascotas = {
    perro: casaApi.mascotas?.["TipoMascota.PERRO"] ?? 0,
    gato: casaApi.mascotas?.["TipoMascota.GATO"] ?? 0,
    otro: casaApi.mascotas?.["TipoMascota.OTRO"] ?? 0,
  };

  return {
    numeroCasa: String(casaApi.numeroCasa),
    propietario: casaApi.propietario
      ? {
          nombreCompleto:
            casaApi.propietario.nombreCompleto?.trim() || "Sin nombre",
          telefono: casaApi.propietario.telefono || 0,
          correo: casaApi.propietario.correo?.trim() || "",
        }
      : {
          nombreCompleto: "Sin propietario",
          telefono: 0,
          correo: "",
        },
    cantidadMiembros: casaApi.cantidadMiembros || 0,
    cantidadMascotas: casaApi.cantidadMascotas || 0,
    mascotas,
    // Usar replaceAll para reemplazar TODAS las ocurrencias de guión bajo
    estadoFinancieroCasa: (casaApi.estadoFinancieroCasa ?? "AL_DIA").replaceAll(
      "_",
      " "
    ),
    usoCasa: (casaApi.usoCasa ?? "RESIDENCIAL").replaceAll("_", " "),
  };
}

export const casaService = {
  async getAll() {
    try {
      const response = await apiClient.get<CasasApiResponse>("/casa/all");
      return response.data.data || [];
    } catch (error) {
      console.error("Error al obtener las casas:", error);
      throw error;
    }
  },
  async getMembersByCasa(numeroCasa: number | string) {
    try {
      const res = await apiClient.get<MiembrosApiResponse>(
        `/miembros/view-members/${numeroCasa}`
      );
      return res.data.data || [];
    } catch (error) {
      console.error("Error al obtener los miembros:", error);
      throw error;
    }
  },
};

export const miembrosService = {
  async getMembers() {
    try {
      const res = await apiClient.get<MiembrosApiResponse>(
        `/miembros/all-casa-members`
      );
      return res.data || [];
    } catch (error) {
      console.error("Error al obtener los miembros:", error);
      throw error;
    }
  },

  async createMember(data: CreateMiembroHogar) {
    try {
      const response = await apiClient.post("/miembros/create", data);
      return response.data;
    } catch (error) {
      console.log("No se pudo crear el miembro.", error);
      throw error;
    }
  },

  async updateMember(id: number, data: UpdateMiembroHogar) {
    try {
      const { id, ...updateData } = data;
      const response = await apiClient.put(`/miembros/${id}/edit`, updateData);
      return response.data;
    } catch (error) {
      console.log("No se pudo modificar el miembro.", error);
      throw error;
    }
  },

  async editMemberStastus(id: number) {
    try {
      const response = await apiClient.patch(`/miembros/${id}/edit-estado`);
      return response.data;
    } catch (error) {
      console.log("No se pudo modificar el estado del miembro", error);
      throw error;
    }
  },
};

interface MiembrosApiResponse {
  message: string;
  data: MiembroHogar[];
}
