import { useState, useEffect } from 'react'
import { casaService } from '@/lib/services/casa.service'
import { authService } from '@/lib/services/auth.service'
import { adaptCasaFromAPI } from '@/lib/services/casa.service'
import { Casa } from '@/types/casa.types'
import axios from 'axios'

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

      const token = authService.getToken()
      console.log('Token actual:', token)

      const casasData = await casaService.getAll()

      setCasas(casasData.map(adaptCasaFromAPI))
      
      console.log('Hook: Casas cargadas exitosamente:', casasData)  

      if ((casasData?.length ?? 0) === 0) console.log('API: 0 casas (lista vacía)')
    } catch (err) {
      console.error('Hook: Error al cargar casas:', err)
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as any)?.message || err.message
        : 'Error al cargar las casas. Intenta de nuevo.'
      setError(msg)
      setCasas([])
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
