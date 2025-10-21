import { useState } from 'react'
import { propietarioService } from '@/lib/services/propietario.service'
import { PropietarioFormData } from '@/lib/validations/propietario.validation'

interface UsePropietarioReturn {
  createPropietario: (data: PropietarioFormData) => Promise<void>
  loading: boolean
  error: string | null
  success: boolean
  reset: () => void
}

export const usePropietario = (): UsePropietarioReturn => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const createPropietario = async (data: PropietarioFormData) => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(false)
      
      const response = await propietarioService.create(data)
      console.log("Propietario creado:", response.data)
      setSuccess(true)
    } catch (err) {
      console.error("Error al crear el propietario:", err)
      let errorMessage = "Error al crear el propietario"
      if (err && typeof err === "object") {
        if ('response' in err && typeof err.response === "object" && err.response && 'data' in err.response && typeof err.response.data === "object" && err.response.data && 'message' in err.response.data) {
          errorMessage = (err.response as { data?: { message?: string } }).data?.message || errorMessage
        } else if ('message' in err && typeof err.message === "string") {
          errorMessage = err.message
        }
      }
      setError(errorMessage)
      throw err // Re-lanzar para que el componente pueda manejarlo
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setSuccess(false)
    setLoading(false)
  }

  return {
    createPropietario,
    loading,
    error,
    success,
    reset
  }
}
