import { useState, useEffect } from 'react';
  import apiClient from "@/lib/config/axios.config";
import { PasswordFormData, PersonalInfoFormData } from '@/types/configuracion.types';

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
  try {
    const response = await apiClient.put("/persona/update", data)
    return response.data
  } catch (error) {
    console.error("Error al actualizar la información personal:", error)
    throw error
  }
}

export const updatePassword = async (data: PasswordFormData) => {
  try {
    const response = await apiClient.put("/user/update-password", data)
    return response.data
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error)
    throw error
  }
}
