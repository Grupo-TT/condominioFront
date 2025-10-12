// // src/lib/api/casas.ts

// import { api } from './client'
// import { Casa } from '@/types/casa.types'

// export const casasApi = {
//   // Obtener todas las casas
//   getAll: async () => {
//     const response = await api.get<Casa[]>('/casas')
//     return response.data
//   },

//   // Obtener una casa por ID
//   getById: async (id: string) => {
//     const response = await api.get<Casa>(`/casas/${id}`)
//     return response.data
//   },

//   // Crear casa
//   create: async (data: Partial<Casa>) => {
//     const response = await api.post<Casa>('/casas', data)
//     return response.data
//   },

//   // Actualizar casa
//   update: async (id: string, data: Partial<Casa>) => {
//     const response = await api.put<Casa>(`/casas/${id}`, data)
//     return response.data
//   },

//   // Eliminar casa
//   delete: async (id: string) => {
//     await api.delete(`/casas/${id}`)
//   }
// }