import { useState } from 'react'
import { recursoService } from '@/services/recurso.service'
import { RecursoRequest, RecursoResponse } from '@/types/recursos.types'
import axios from 'axios'

export const useRecurso = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recurso, setRecurso] = useState<RecursoResponse | null>(null)

  const crearRecurso = async (
    data: RecursoRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await recursoService.postRecurso(data)
      setRecurso(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data)
          ? String(err.response.data.message)
          : 'Error al crear el recurso'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const habilitarRecurso = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await recursoService.putRecursoEnable(id)
      setRecurso(response)
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message || 'Error al habilitar el recurso'
        : 'Error al habilitar el recurso'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const deshabilitarRecurso = async (id: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await recursoService.putRecursosDisable(id)
      setRecurso(response)
    } catch (err: unknown) {
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message || 'Error al deshabilitar el recurso'
        : 'Error al deshabilitar el recurso'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { crearRecurso, habilitarRecurso, deshabilitarRecurso, recurso, loading, error }
}
