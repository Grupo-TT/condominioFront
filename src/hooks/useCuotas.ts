'use client'

import { useState, useCallback } from 'react'
import { getEstadoCuenta, getEstadosCuenta, registrarPago } from '@/lib/services/cuotas.service'
import { CuotaCasa } from '@/types/cuotas.types'

interface PagoPayload {
  soporte: string
  obligacionId?: string
  monto: number
}

export const useCuotas = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [estadoCuenta, setEstadoCuenta] = useState<CuotaCasa | null>(null)
  const [casas, setCasas] = useState<CuotaCasa[]>([]);


  const fetchCasas = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getEstadosCuenta()
      console.log('✅ Estados de cuenta cargados:', response)
      setCasas(response?.data || [])
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error al obtener estados de cuenta:', err)
      setError('No se pudieron obtener los estados de cuenta.')
    } finally {
      setLoading(false)
    }
  }, [])
  /**
   * Obtener estado de cuenta por casa
   */
  const fetchEstadoCuenta = useCallback(async (casaId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await getEstadoCuenta(casaId)
      console.log('Estado de cuenta obtenido:', response)
      setEstadoCuenta(response?.data || response)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(' Error al obtener estado de cuenta:', err)
      setError('No se pudo obtener el estado de cuenta, por favor intenta nuevamente.')
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
      console.log('Pago registrado correctamente:', data)

      // Refetch del estado de cuenta si existe
      if (estadoCuenta) {
        await fetchEstadoCuenta(Number(estadoCuenta.numeroCasa))
      }

      return data
    } catch (err) {
      if (err instanceof Error) {
        console.error('Error al registrar pago:', err)
        // Try to extract a message from a possible "response" property, otherwise fallback to generic message
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
  }, [estadoCuenta, fetchEstadoCuenta])

  return {
    casas,
    loading, 
    error,
    fetchCasas,
    estadoCuenta, 
    fetchEstadoCuenta,
    handleRegistrarPago 
  }
}
