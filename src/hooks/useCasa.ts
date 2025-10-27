// src/hooks/useCasa.ts
import { useEffect, useState, useCallback } from 'react'
import { casaService } from '@/lib/services/casa.service'
import { adaptCasaFromAPI } from '@/lib/services/casa.service'
import { Casa } from '@/types/casa.types'

export interface MiembroCasa {
  nombreCompleto: string
  tipoMiembro: string
  numeroDocumento: string
  telefono: string
  email?: string
}

export function useMiembros(casaNumero: string | number) {
  const [casa, setCasa] = useState<Casa | null>(null)
  const [miembros, setMiembros] = useState<MiembroCasa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!casaNumero) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Hacer ambas llamadas en paralelo para mejor rendimiento
      const [casasData, miembrosData] = await Promise.all([
        casaService.getAll(),
        casaService.getMembersByCasa(Number(casaNumero))
      ])

      // Buscar la casa específica
      const casaEncontrada = casasData.find(
        (c) => String(c.numeroCasa) === String(casaNumero)
      )
      
      if (casaEncontrada) {
        setCasa(adaptCasaFromAPI(casaEncontrada))
      } else {
        setCasa(null)
      }

      // Mapear miembros
      setMiembros(
        (miembrosData || []).map(m => ({
          nombreCompleto: m.nombreCompleto,
          tipoMiembro: m.tipoMiembro,
          numeroDocumento: String(m.numeroDocumento ?? ''),
          telefono: String(m.telefono ?? ''),
          email: m.email,
        }))
      )
    } catch {
      setError('No se pudieron cargar los datos de la casa')
      setMiembros([])
      setCasa(null)
    } finally {
      setLoading(false)
    }
  }, [casaNumero])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { casa, miembros, loading, error, refetch: fetchData }
}