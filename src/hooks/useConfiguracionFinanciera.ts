import { useState } from 'react'
import { valoresConstantesService } from '@/services/configuracionFinanciera.service'
import { ActualizarResponse, VisualizarResponse } from '@/types/configuracionFinanciera.types'
import { setConfig } from 'next/config'

export const useValoresConstantes = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tasa, setTasa] = useState<ActualizarResponse | null>(null)
  const [pagoAdicional, setPagoAdicional] = useState<ActualizarResponse | null>(null)
  const [cargoAdministrativo, setCargoAdministrativo] = useState<ActualizarResponse | null>(null)
  const [configuraciones, setConfiguraciones] = useState<VisualizarResponse['data']['configuraciones']>([])

  const actualizarTasaInteres = async (nuevoValor: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await valoresConstantesService.putTasaInteres(nuevoValor)
      setTasa(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Error al obtener la tasa de interés'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const actualizarPagoAdicional = async (nuevoValor: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await valoresConstantesService.putPagoAdicional(nuevoValor)
      setPagoAdicional(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Error al obtener el pago adicional'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const actualizarCargoAdministrativo = async (nuevoValor: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await valoresConstantesService.putCargoAdministrativo(nuevoValor)
      setCargoAdministrativo(response)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Error al obtener el cargo administrativo'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const obtenerConfiguraciones = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await valoresConstantesService.getConfiguraciones();
      setConfiguraciones(response.data.configuraciones);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al obtener las configuraciones');
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, actualizarTasaInteres, actualizarPagoAdicional, actualizarCargoAdministrativo, obtenerConfiguraciones, configuraciones, setConfiguraciones, cargoAdministrativo }
}
