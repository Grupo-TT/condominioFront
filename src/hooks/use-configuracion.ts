import { useState, useEffect } from 'react';
import apiClient from "@/lib/config/axios.config";
import { PasswordFormData, PersonalInfoFormData } from '@/types/configuracion.types';

export interface PerfilData {
  primerNombre: string;
  segundoNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  telefono: number | string;
  email: string;
  tipoDocumento: string;
  numeroDocumento: number | string;
}

export const usePerfil = () => {
  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPerfil = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.get('/persona/perfil');
      setPerfil(response.data);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Error al cargar el perfil';
      setError(errorMessage);
      console.error("Error al obtener el perfil:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerfil();
  }, []);

  return { perfil, loading, error, refetch: fetchPerfil };
};

export const updatePersona = async (data: PersonalInfoFormData) => {
  try {
    // Mapear correo a email para el backend y asegurar formato correcto
    const requestData = {
      primerNombre: data.primerNombre.trim(),
      segundoNombre: data.segundoNombre?.trim() || "",
      primerApellido: data.primerApellido.trim(),
      segundoApellido: data.segundoApellido?.trim() || "",
      telefono: typeof data.telefono === 'number' ? data.telefono : Number(data.telefono),
      tipoDocumento: data.tipoDocumento,
      // Asegurar que numeroDocumento sea un número válido
      numeroDocumento: typeof data.numeroDocumento === 'number' 
        ? data.numeroDocumento 
        : Number(String(data.numeroDocumento).replace(/\D/g, '')),
      email: data.correo.trim().toLowerCase(),
    };
    
    console.log("Datos enviados al backend:", requestData);
    
    const response = await apiClient.put("/persona/update", requestData);
    return response.data;
  } catch (error: unknown) {
    console.error("Error al actualizar la información personal:", error);
    
    // Extraer información detallada del error
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { 
        response?: { 
          data?: { 
            message?: string;
            error?: string;
            errors?: unknown;
          };
          status?: number;
        } 
      };
      
      const errorData = axiosError.response?.data;
      const status = axiosError.response?.status;
      
      // Construir mensaje de error más descriptivo
      let errorMessage = "Error al actualizar la información";
      
      if (errorData?.message) {
        errorMessage = errorData.message;
      } else if (errorData?.error) {
        errorMessage = errorData.error;
      } else if (status === 500) {
        errorMessage = "Error interno del servidor. Por favor, intenta nuevamente.";
      } else if (status === 400) {
        errorMessage = "Datos inválidos. Por favor, verifica la información ingresada.";
      } else if (status === 401) {
        errorMessage = "No autorizado. Por favor, inicia sesión nuevamente.";
      }
      
      console.error("Detalles del error:", {
        status,
        data: errorData,
        fullError: error
      });
      
      throw new Error(errorMessage);
    }
    
    throw error;
  }
};

export const updatePassword = async (data: PasswordFormData) => {
  try {
    const response = await apiClient.put("/user/update-password", data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error al actualizar la contraseña:", error);
    if (error && typeof error === 'object' && 'response' in error) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      throw new Error(axiosError.response?.data?.message || "Error al actualizar la contraseña");
    }
    throw error;
  }
};
