import { useState } from 'react'
import { reservasService } from '@/services/propietario.reservas.service'
import type { ReservaPropietarioItem, ReservaAdaptada, ReservaPropCreateRequest, ReservaPropUpdateRequest } from '@/types/propietario.reservas.types'
import { secondsInDay } from 'date-fns/constants'

export function useReservasPropietario() {
  const [reservas, setReservas] = useState<ReservaAdaptada[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReservasPropietario = async (userId: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.getReservasPropietario(userId)
      console.debug('[useReservasPropietario] raw response', response)
      const formatTime = (t: any) => {
        if (typeof t === "string") {
          const [hour, minute] = t.split(":").map(Number);
          return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        }

        if (t && typeof t === "object") {
          const hour = Number(t.hour ?? 0);
          const minute = Number(t.minute ?? 0);
          return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        }

        // Fallback
        return "00:00";
      };

      const reservasAdaptadas: ReservaAdaptada[] = response.map((r: ReservaPropietarioItem) =>  ({
        id: String(r.id),
        idRecurso: r.idRecurso,
        recursoNombre: r.nombre,
        tipoRecurso: r.tipoRecursoComun.toLowerCase() as 'zona' | 'objeto',
        estado: r.estadoSolicitud.toLowerCase() as 'pendiente' | 'aprobada' | 'rechazada',
        fechaInicio: new Date(r.fechaReserva),
        fechaFin: new Date(r.fechaReserva),
        horaInicio: formatTime(r.horaInicio),
        horaFin: formatTime(r.horaFin),
        numeroInvitados: r.numeroInvitados,
        fechaCreacion: new Date(r.fechaCreacion)
      }))

      reservasAdaptadas.forEach((ra, idx) => {
        console.debug(`[useReservasPropietario] mapped reserva[${idx}] id=${ra.id} horaInicio=${ra.horaInicio} horaFin=${ra.horaFin}`)
      })

      setReservas(reservasAdaptadas)
    } catch (err) {
      setError('Ocurrió un error obteniendo las reservas')
    } finally {
      setLoading(false)
    }
  }

  const eliminarReserva = async (id: number) => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.deleteReserva(id)


      return response
    } catch (error: any) {

      const errorMessage = error?.message || error?.response?.data?.message ||"Ocurrió un error eliminando la reserva"

      setError(errorMessage)
      throw new Error(errorMessage)

    } finally {
      setLoading(false)
    }
  }

  const normalizeHora = (h: string) => {
    const [hour, minute] = h.split(':').map(Number)
    return { hour, minute, second: 0, nano: 0 }
  }

  const postReservasPropietario = async(payload: ReservaPropCreateRequest) => {

    return await reservasService.postReserva(payload)
  }


  const updateReserva = async (data: ReservaPropUpdateRequest) => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.putReservaPropietario(data)
      return response

    } catch (err: any) {
      const errorMessage = err?.message || err?.response?.data?.message || 'Ocurrió un error actualizando la reserva'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return {
    reservas,
    loading,
    error,
    fetchReservasPropietario,
    eliminarReserva,
    postReservasPropietario,
    updateReserva
  }
}