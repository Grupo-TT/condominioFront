import { useState } from 'react'
import { recursoService } from '@/services/recurso.service'
import { RecursoRequest, RecursoResponse } from '@/types/recursos.types'

export const usePostRecurso = () => {
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

  return { crearRecurso, recurso, loading, error }
}
