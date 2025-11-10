'use client'

import { useState, useCallback } from 'react'
import { getPorCobrar, registrarPago } from '@/lib/services/cuotas.service'
import { CuotaCasa, PagoPayload } from '@/types/cuotas.types'

export const useCuotas = () => {
  const [loading, setLoading] = useState(true) // Iniciar en true para mostrar skeleton al cargar
  const [error, setError] = useState<string | null>(null)
  const [casas, setCasas] = useState<CuotaCasa[]>([]);


  const fetchCasas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getPorCobrar()
      setCasas(response?.data || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Si el error es 400 con mensaje de "no hay casas", simplemente establecer casas vacías
      if (err.response?.status === 400 && err.response?.data?.message?.includes('No hay casas')) {
        setCasas([])
        return
      }
      console.error('Error al obtener estados de cuenta:', err)
      setError('No se pudieron obtener los estados de cuenta.')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Registrar pago
   */
  const handleRegistrarPago = useCallback(async (payload: PagoPayload) => {
    setLoading(true)
    setError(null)
    try {
      const data = await registrarPago(payload)
      // Actualizar la lista de casas después de registrar el pago
      await fetchCasas()
      return data
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al registrar pago:', err)
        const responseErr = (err as { response?: { data?: { message?: string } } })
        setError(responseErr.response?.data?.message || 'Error al registrar el pago')
      } else {
        console.error('Error al registrar pago:', err)
        setError('Error al registrar el pago')
      }
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchCasas])

  return {
    casas,
    loading, 
    error,
    fetchCasas,
    handleRegistrarPago 
  }
}
