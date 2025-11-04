import { useState } from 'react'
import { recursoService } from '@/services/recurso.service'
import { mapResponseToUI, RecursoUI } from '@/services/recurso.adapter'
import { RecursoRequest, RecursoResponse } from '@/types/recursos.types'

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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el recurso')
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al habilitar el recurso')
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
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al deshabilitar el recurso')
    } finally {
      setLoading(false)
    }
  }

  return { crearRecurso, habilitarRecurso, deshabilitarRecurso, recurso, loading, error }
}
