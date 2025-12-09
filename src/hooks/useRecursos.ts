import { useState, useEffect } from 'react'
import { recursoService } from '@/services/recurso.service'
import { mapResponseToUI, RecursoUI } from '@/services/admin.recurso.adapter'

export const useRecursos = () => {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [recursos, setRecursos] = useState<RecursoUI[]>([])

    const fetchRecursos = async () => {
        setLoading(true)
        setError(null)

        try {
            const list = await recursoService.getRecurso()
            const adaptados = list.map(mapResponseToUI)
            setRecursos(adaptados)
        } catch {
            setError('Error cargando recursos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchRecursos()
    }, [])

    return { recursos, loading, error, refetch: fetchRecursos }
}