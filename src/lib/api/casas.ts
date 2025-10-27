// src/lib/api/casas.ts

import {apiClient} from '../config/axios.config'
import { Casa } from '@/types/casa.types'

export const casasApi = {
  // Obtener todas las casas
  getAll: async () => {
    const response = await apiClient.get<Casa[]>('/casas')
    return response.data
  },

  // Obtener una casa por ID
  getById: async (id: string) => {
    const response = await apiClient.get<Casa>(`/casas/${id}`)
    return response.data
  },

  // Crear casa
  create: async (data: Partial<Casa>) => {
    const response = await apiClient.post<Casa>('/casas', data)
    return response.data
  },

  // Actualizar casa
  update: async (id: string, data: Partial<Casa>) => {
    const response = await apiClient.put<Casa>(`/casas/${id}`, data)
    return response.data
  },

  // Eliminar casa
  delete: async (id: string) => {
    await apiClient.delete(`/casas/${id}`)
  }
}