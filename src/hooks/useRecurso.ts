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

  return { crearRecurso, recurso, loading, error }
}
