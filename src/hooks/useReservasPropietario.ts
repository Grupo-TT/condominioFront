import { useState, useCallback } from 'react'
import { reservasService } from '@/services/propietario.reservas.service'
import type { ReservaPropietarioItem, MisReservasItem, ReservaAdaptada, ReservaPropCreateRequest, ReservaPropUpdateRequest } from '@/types/propietario.reservas.types'
import { formatTime, parseFecha } from '@/utils/hora-utils'

export function useReservasPropietario() {
  // Estado para disponibilidad (todas las reservas)
  const [reservas, setReservas] = useState<ReservaAdaptada[]>([])
  // Estado para "Mis Reservas" (solo las del usuario)
  const [misReservas, setMisReservas] = useState<ReservaAdaptada[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMisReservas, setLoadingMisReservas] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Obtener TODAS las reservas (para disponibilidad)
  const fetchReservasPropietario = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.getReservasPropietario()

      const lista = Array.isArray(response) ? response : []

      const reservasAdaptadas: ReservaAdaptada[] = lista.map((r: ReservaPropietarioItem) => ({
        id: String(r.id),
        idRecurso: r.recursoComun.id,
        recursoNombre: r.recursoComun.nombre,
        tipoRecurso: r.recursoComun.tipoRecursoComun.toLowerCase() as 'zona' | 'objeto',
        estado: r.estadoSolicitud.toLowerCase() as 'pendiente' | 'aprobada' | 'rechazada' | 'finalizada',
        fechaInicio: parseFecha(r.fechaSolicitud),
        fechaFin: parseFecha(r.fechaSolicitud),
        horaInicio: formatTime(r.horaInicio),
        horaFin: formatTime(r.horaFin),
        numeroInvitados: r.numeroInvitados,
        idCasa: r.casa.id
      }))

      setReservas(reservasAdaptadas)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error obteniendo las reservas'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Obtener solo MIS reservas (para la pestaña "Mis Reservas")
  const fetchMisReservas = useCallback(async (idCasa: number) => {
    try {
      setLoadingMisReservas(true)
      setError(null)

      const response = await reservasService.getMisReservas(idCasa)

      const lista = Array.isArray(response) ? response : []

      // El endpoint mis-reservas tiene estructura plana
      const reservasAdaptadas: ReservaAdaptada[] = lista.map((r: MisReservasItem) => ({
        id: String(r.id),
        idRecurso: r.idRecurso,
        recursoNombre: r.nombre,
        tipoRecurso: r.tipoRecursoComun.toLowerCase() as 'zona' | 'objeto',
        estado: r.estadoSolicitud.toLowerCase() as 'pendiente' | 'aprobada' | 'rechazada' | 'finalizada',
        fechaInicio: parseFecha(r.fechaReserva),
        fechaFin: parseFecha(r.fechaReserva),
        fechaCreacion: parseFecha(r.fechaCreacion),
        horaInicio: formatTime(r.horaInicio),
        horaFin: formatTime(r.horaFin),
        numeroInvitados: r.numeroInvitados,
      }))

      setMisReservas(reservasAdaptadas)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ocurrió un error obteniendo mis reservas'
      setError(message)
    } finally {
      setLoadingMisReservas(false)
    }
  }, [])

  const eliminarReserva = useCallback(async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.deleteReserva(id)
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Ocurrió un error eliminando la reserva'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const postReservasPropietario = useCallback(async (payload: ReservaPropCreateRequest) => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.postReserva(payload)
      return response
    } catch (err: unknown) {
      let errorMessage = 'Ocurrió un error creando la reserva';

      const axiosError = err as { response?: { data?: { message?: string } } };

      if (axiosError?.response?.data?.message) {
        errorMessage = axiosError.response.data.message;
      }

      if (axiosError && typeof (axiosError as any).message === 'string') {
        if ((axiosError as any).message.includes('Request failed with status')) {
          (axiosError as any).message = errorMessage;
        }
      }

      setError(errorMessage);

      // Volvemos a lanzar el error ya limpio
      throw new Error(errorMessage);
    } finally {
      setLoading(false)
    }
  }, [])

  const updateReserva = useCallback(async (data: ReservaPropUpdateRequest) => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.putReservaPropietario(data)
      return response
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'Ocurrió un error actualizando la reserva'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    reservas,
    misReservas,
    loading,
    loadingMisReservas,
    error,
    fetchReservasPropietario,
    fetchMisReservas,
    eliminarReserva,
    postReservasPropietario,
    updateReserva
  }
}
