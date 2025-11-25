import { useState, useEffect } from 'react'
import { casaService } from '@/lib/services/casa.service'
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

      const casasData = await casaService.getAll()

      setCasas(casasData.map(adaptCasaFromAPI))
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message
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
