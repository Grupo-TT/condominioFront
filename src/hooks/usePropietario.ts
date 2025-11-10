import { useState } from 'react'
import axios from 'axios'
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
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message
        : 'Error al crear el propietario. Intenta de nuevo.'
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
