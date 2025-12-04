import { useState } from 'react'
import { reservasService } from '@/services/propietario.reservas.service'
import type { ReservaPropietarioItem, ReservaAdaptada, ReservaPropCreateRequest, ReservaPropUpdateRequest } from '@/types/propietario.reservas.types'
import { secondsInDay } from 'date-fns/constants'

export function useReservasPropietario() {
  const [reservas, setReservas] = useState<ReservaAdaptada[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReservasPropietario = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await reservasService.getReservasPropietario()
      const formatTime = (t: any): string => {
        // Caso 1: string "HH:mm:ss"
        if (typeof t === "string") {
          const parts = t.split(":").map(Number);
          const hour = parts[0] ?? 0;
          const minute = parts[1] ?? 0;
          return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        }

        // Caso 2: objeto Hora
        if (t && typeof t === "object") {
          const hour = Number(t.hour ?? 0);
          const minute = Number(t.minute ?? 0);
          return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        }

        return "00:00";
      };

      const parseFecha = (fechaStr: string) => {
        const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
        return new Date(year, month - 1, day);
      };

      const reservasAdaptadas: ReservaAdaptada[] = response.map((r: ReservaPropietarioItem) =>  ({
        id: String(r.id),
        idRecurso: r.recursoComun.id,
        recursoNombre: r.recursoComun.nombre,
        tipoRecurso: r.recursoComun.tipoRecursoComun.toLowerCase() as 'zona' | 'objeto',
        estado: r.estadoSolicitud.toLowerCase() as 'pendiente' | 'aprobada' | 'rechazada',
        fechaInicio: parseFecha(r.fechaSolicitud),
        fechaFin: parseFecha(r.fechaSolicitud),
        horaInicio: formatTime(r.horaInicio),
        horaFin: formatTime(r.horaFin),
        numeroInvitados: r.numeroInvitados,
        idCasa: r.casa.id
      }))

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