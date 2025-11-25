import { useState, useEffect } from 'react';
  import apiClient from "@/lib/config/axios.config";
import { PersonalInfoFormData } from '@/types/configuracion.types';

export const usePerfil = () => {
  const [perfil, setPerfil] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/persona/perfil')
      .then(res => setPerfil(res.data))
      .finally(() => setLoading(false));
  }, []);

  return { perfil, loading };
};

export const updatePersona = async (data: PersonalInfoFormData) => {
  console.log("🚀 ~ updatePersona ~ data:", data)
  try {
    const response = await apiClient.put("/persona/update", data)
    console.log("Información personal actualizada:", response.data)
    return response.data
  } catch (error) {
    console.error("Error al actualizar la información personal:", error)
    throw error
  }
}
