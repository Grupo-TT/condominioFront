// src/hooks/useCasa.ts
import { useEffect, useState } from 'react'
import { casaService } from '@/lib/services/casa.service'
import { authService } from '@/lib/services/auth.service'

export interface MiembroCasa {
  nombreCompleto: string
  tipoMiembro: string
  numeroDocumento: string
  telefono: string
  email?: string
}

export function useMiembros(casaNumero: string | number) {
  const [casa, setCasa] = useState<any>(null);
  const [miembros, setMiembros] = useState<MiembroCasa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const casas = await casaService.getAll()
      const casaEncontrada = casas.find(
        (c: any) => String(c.numeroCasa) === String(casaNumero)
      )
      setCasa(casaEncontrada || null)

      if (casaNumero) {
        const data = await casaService.getMembersByCasa(Number(casaNumero))
        setMiembros(
          (data || []).map(m => ({
            nombreCompleto: m.nombreCompleto,
            tipoMiembro: m.tipoMiembro,
            numeroDocumento: String(m.numeroDocumento ?? ''),
            telefono: String(m.telefono ?? ''),
            email: m.email,
          }))
        )
      }
    } catch (e) {
      setError('No se pudieron cargar los miembros')
      setMiembros([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (casaNumero) fetchData() }, [casaNumero])

  return { casa, miembros, loading, error, refetch: fetchData }
}