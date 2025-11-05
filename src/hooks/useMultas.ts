import { useEffect, useState, useCallback } from 'react'
import { Multa } from '@/types/cuotas.types'
import { MultaForm } from '@/types/cuotas.types' // donde tengas tu interface
import { getMultas, createMulta, updateMulta } from '@/lib/services/multas.service'

interface UseMultasReturn {
  multasData: Multa[]
  loading: boolean
  error: string | null
  refreshMultas: () => Promise<void>
  nuevaMulta: (multa: MultaForm) => Promise<void>
  modificarMulta: (id: number, multa: MultaForm) => Promise<void>
}

export function useMultas(): UseMultasReturn {
  const [multasData, setMultasData] = useState<Multa[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // --- Obtener multas del backend ---
  const fetchMultas = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getMultas()

      setMultasData(response.data)
    } catch (err: any) {
      console.error('Error cargando multas:', err)
      setError('No se pudieron cargar las multas.')
    } finally {
      setLoading(false)
    }
  },[])

  useEffect(() => {
    fetchMultas()
  }, [fetchMultas])

  // --- Crear nueva multa ---
  const nuevaMulta = useCallback(
    async (multa: MultaForm) => {
      try {
        await createMulta(multa)
        await fetchMultas()
      } catch (err: any) {
        console.error('Error creando multa:', err)
        throw new Error('No se pudo registrar la multa, intenta nuevamente.')
      }
    },
    [fetchMultas]
  )

  // --- Actualizar multa existente ---
  const modificarMulta = useCallback(
    async (id: number, multa: MultaForm) => {
      try {
        const response = await updateMulta(id, multa)

        await fetchMultas()
      } catch (err: any) {
        console.error('Error actualizando multa:', err)
        throw new Error('No se pudo actualizar la multa, intenta nuevamente.')
      }
    },
    [fetchMultas]
  )

  return {
    multasData,
    loading,
    error,
    refreshMultas: fetchMultas,
    nuevaMulta,
    modificarMulta,
  }
}
