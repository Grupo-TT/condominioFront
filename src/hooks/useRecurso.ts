import { useState } from 'react'
import { recursoService } from '@/services/recurso.service'
import { RecursoRequest, RecursoResponse } from '@/types/recursos.types'

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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data)
          ? String(err.response.data.message)
          : 'Error al editar el recurso'
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
      onSuccess?.()
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
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
      onSuccess?.()
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Error al deshabilitar el recurso'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const cambiarEstadoMantenimiento = async (id: number, data: RecursoRequest) => {
    try {
      setLoading(true)
      setError(null)
      const response = await recursoService.putRecurso(id, data)
      setRecurso(response)
      onSuccess?.()
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data
        ? String(err.response.data.message)
        : 'Error al cambiar estado del recurso'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return { crearRecurso, editarRecurso, habilitarRecurso, deshabilitarRecurso, cambiarEstadoMantenimiento, recurso, loading, error }
}
