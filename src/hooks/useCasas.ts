import { useState, useEffect } from 'react'
import { casaService } from '@/lib/services/casa.service'
import { Casa } from '@/types/casa.types'

interface UseCasasReturn {
  casas: Casa[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useCasas(): UseCasasReturn {
  const [casas, setCasas] = useState<Casa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCasas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Hook: Iniciando carga de casas...')
      const casasData = await casaService.getAll()
      
      console.log('Hook: Casas cargadas exitosamente:', casasData)
      setCasas(casasData)
    } catch (err) {
      console.error('Hook: Error al cargar casas:', err)
      setError('Error al cargar las casas. Intenta de nuevo.')
      setCasas([]) // Limpiar datos en caso de error
    } finally {
      setLoading(false)
    }
  }

  const refetch = () => {
    fetchCasas()
  }

  useEffect(() => {
    fetchCasas()
  }, [])

  return {
    casas,
    loading,
    error,
    refetch
  }
}
