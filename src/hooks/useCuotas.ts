'use client'

import { useState, useCallback } from 'react'
import { getPorCobrar, registrarPago } from '@/lib/services/cuotas.service'
import { CuotaCasa, PagoPayload } from '@/types/cuotas.types'
import axios from 'axios'

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
    } catch (err) {
      // Si el error es 400 con mensaje de "no hay casas", simplemente establecer casas vacías
      if (axios.isAxiosError(err) && err.response?.status === 400 && 
          (err.response?.data as { message?: string })?.message?.includes('No hay casas')) {
        setCasas([])
        return
      }
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message || 'No se pudieron obtener los estados de cuenta.'
        : 'No se pudieron obtener los estados de cuenta.'
      setError(errorMessage)
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
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message || 'Error al registrar el pago'
        : err instanceof Error
          ? err.message
          : 'Error al registrar el pago'
      setError(errorMessage)
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
