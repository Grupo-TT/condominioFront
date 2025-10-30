import { useState, useEffect } from 'react'
import type { IEventExtended } from '@/data/reservas.mock'
import { transformReservasFromAPI, type ReservaAPIResponse } from '@/services/reservas-adapter'
import { addColorToReservas } from '@/utils/reservas-utils'

interface UseReservasResult {
  reservas: IEventExtended[]
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook para obtener las reservas desde la API
 */
export function useReservas(): UseReservasResult {
  const [reservas, setReservas] = useState<IEventExtended[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchReservas = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/reservas') // Ajusta la URL según tu backend
      
      if (!response.ok) {
        throw new Error(`Error al cargar reservas: ${response.statusText}`)
      }

      const data: ReservaAPIResponse = await response.json()

      // 1. Transformar estructura de la API al formato de la app
      const reservasTransformadas = transformReservasFromAPI(data)

      // 2. Asignar colores automáticamente según el tipoRecurso
      const reservasConColor = addColorToReservas(reservasTransformadas)

      setReservas(reservasConColor)
    } catch (err) {
      console.error('Error al cargar reservas:', err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservas()
  }, [])

  return {
    reservas,
    loading,
    error,
    refetch: fetchReservas,
  }
}

