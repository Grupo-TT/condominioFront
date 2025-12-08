import { useState } from 'react'
import { recursoService } from '@/services/recurso.service'
import { RecursoRequest, RecursoResponse, DisponibilidadRecurso } from '@/types/recursos.types'

export const useRecurso = (onSuccess?: () => void) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recurso, setRecurso] = useState<RecursoResponse | null>(null)

  const crearRecurso = async (data: RecursoRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await recursoService.postRecurso(data)
      setRecurso(response)
      onSuccess?.()
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

  const editarRecurso = async (id: number, data: RecursoRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await recursoService.putRecurso(id, data)
      setRecurso(response)
      onSuccess?.()
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data)
          ? String(err.response.data.message)
          : 'Error al editar el recurso'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const cambiarDisponibilidad = async (
    id: number,
    disponibilidad: DisponibilidadRecurso
  ) => {
    try {
      setLoading(true)
      setError(null)
      const response = await recursoService.changeAvailability(id, disponibilidad)
      setRecurso(response)
      return response
    } catch (err: unknown) {
      const errorMessage =
        err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
          ? String(err.response.data.message)
          : 'Error al actualizar la disponibilidad del recurso'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { crearRecurso, editarRecurso, cambiarDisponibilidad, recurso, loading, error }
}
