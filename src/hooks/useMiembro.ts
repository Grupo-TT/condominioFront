// src/hooks/useCasa.ts
import { useEffect, useState, useCallback } from 'react'
import { miembrosService } from '@/lib/services/casa.service'
import { MiembroHogar } from '@/types/casa.types'

export function useMiembros(casaNumero: string | number) {
  const [miembros, setMiembros] = useState<MiembroHogar[]>([])
  const [loading, setLoading] = useState(!miembros)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    if (!casaNumero) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

        const miembrosData = await miembrosService.getMembers()        
        setMiembros(
          (miembrosData || []).map((m:MiembroHogar) => ({
            nombre: m.nombre,
            tipoDocumento: m.tipoDocumento,
            numeroDocumento: String(m.numeroDocumento ?? ''),
            telefono: String(m.telefono ?? ''),
            parentesco: String(m.parentesco ?? ''),
            estado: m.estado ? "Activo" : "Inactivo",
            id: String(m.id ?? ''),
            idCasa: String(m.idCasa ?? ''),
          }))
        )

        // Mapear miembros
        setMiembros(
          (miembrosData || []).map((m:MiembroHogar) => ({
            nombre: m.nombre,
            tipoDocumento: m.tipoDocumento,
            numeroDocumento: String(m.numeroDocumento ?? ''),
            telefono: String(m.telefono ?? ''),
            parentesco: String(m.parentesco ?? ''),
            estado: m.estado ? "Activo" : "Inactivo",
            id: String(m.id ?? ''),
            idCasa: String(m.idCasa ?? ''),
          }))
        )
    } catch {
      setError('No se pudieron cargar los datos de la casa')
      setMiembros([])
    } finally {
      setLoading(false)
    }
  }, [casaNumero])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { miembros, loading, error, refetch: fetchData }
}
