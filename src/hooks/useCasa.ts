// src/hooks/useCasa.ts
import { useEffect, useState } from 'react'
import { casaService } from '@/lib/services/casa.service'
import { authService } from '@/lib/services/auth.service'

export interface MiembroUI {
  nombreCompleto: string
  tipoMiembro: string
  numeroDocumento: string
  telefono: string
  email?: string
}

export function useMiembros(idCasa: string | number) {
  const [miembros, setMiembros] = useState<MiembroUI[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await casaService.getMembersByCasa(idCasa)
      setMiembros(
        (data || []).map(m => ({
          nombreCompleto: m.nombreCompleto,
          tipoMiembro: m.tipoMiembro,
          numeroDocumento: String(m.numeroDocumento ?? ''),
          telefono: String(m.telefono ?? ''),
          email: m.email,
        }))
      )
    } catch (e) {
      setError('No se pudieron cargar los miembros')
      setMiembros([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (idCasa) fetchData() }, [idCasa])

  return { miembros, loading, error, refetch: fetchData }
}