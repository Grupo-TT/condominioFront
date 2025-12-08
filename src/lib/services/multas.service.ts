import { apiClient } from '../config/axios.config'
import { MultaForm } from '@/types/cuotas.types'


// GET /obligacion/multas
export const getMultas = async () => {
    try {
        const response = await apiClient.get(`/obligacion/multas`)
        return response.data
    } catch (error) {
        throw error
    }
}
// POST /obligacion/multa/create
export const createMulta = async (data: MultaForm) => {
    try {
        const response = await apiClient.post('/obligacion/multa/create', data)
        return response.data
    } catch (error) {
        throw error
    }
}
// PUT /obligacion/multa/edit/${id}
export const updateMulta = async (id: number, data: MultaForm) => {
    try {
        const response = await apiClient.put(`/obligacion/multa/edit/${id}`, data)
        return response.data
    } catch (error) {
        throw error
    }
}
