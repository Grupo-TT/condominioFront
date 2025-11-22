import { useEffect, useState } from "react";
import { Reserva } from "@/types/reserva.types";
import { reservasService } from "@/lib/services/reservas.service";
import { TReservaEditFormData } from "@/calendar/schemas";

export function useReservas() {
  const [reservasAprobadas, setReservasAprobadas] = useState<Reserva[]>([]);
  const [reservasRechazadas, setReservasRechazadas] = useState<Reserva[]>([]);
  const [reservasPendientes, setReservasPendientes] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"APROBADA" | "RECHAZADA" | "PENDIENTE">("APROBADA");

  const cargarReservas = async () => {
    setLoading(true);
    setError(null);
    try {

      const aprobadas = await reservasService.getReservasAprobadas()
      const rechazadas = await reservasService.getReservasRechazadas()
      const pendientes = await reservasService.getReservasPendientes()

      console.log(aprobadas)

      setReservasAprobadas(aprobadas);
      setReservasRechazadas(rechazadas);
      setReservasPendientes(pendientes);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const errorMessage = (err as any)?.response?.data?.message || (err as Error)?.message || "Error al cargar las reservas";
      setError(errorMessage);
      console.error("No se pudo cargar el cronograma de reservas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarReservas();
  }, []);

  const reservas = tab === "APROBADA" ? reservasAprobadas :
    tab === "RECHAZADA" ? reservasRechazadas :
      reservasPendientes;

  const aprobarReserva = async (id: number) => {
    try {
      await reservasService.approveReserva(id);
      // recargar después de aprobar
      await cargarReservas();
      window.location.reload()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al aprobar la reserva";
      setError(errorMessage);
      console.error("Error al aprobar:", err);
    }
  };
  const rechazarReserva = async (id: number) => {
    try {
      await reservasService.rejectReserva(id);
      await cargarReservas();
      window.location.reload()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al rechazar la reserva"; setError(errorMessage);
      console.error("Error al rechazar:", err);
    }
  };
  const eliminarReserva = async (id: number) => {
    try {
      await reservasService.deleteReserva(id);
      console.log()
      await cargarReservas();
      window.location.reload()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al rechazar la reserva";
      setError(errorMessage); console.error("Error al rechazar:", err);
    }
  };
  return {
    reservas,
    reservasAprobadas,
    reservasRechazadas,
    reservasPendientes,

    aprobarReserva,
    rechazarReserva,
    eliminarReserva,
    tab,
    setTab,
    loading,
    error,
    recargar: cargarReservas,
  };
}

function toLocalTimeString(timeObj: { hour: number; minute: number }) {
  return `${String(timeObj.hour).padStart(2, "0")}:${String(timeObj.minute).padStart(2, "0")}`;
}

export async function editarReserva(id: number, data: TReservaEditFormData): Promise<void> {
  try {
    const payload = {
      idSolicitud: id,
      fechaSolicitud: data.fechaSolicitud instanceof Date
        ? data.fechaSolicitud.toISOString().split("T")[0]
        : String(data.fechaSolicitud).split("T")[0],
      horaInicio: toLocalTimeString(data.horaInicio),
      horaFin: toLocalTimeString(data.horaFin),
      numeroInvitados: data.numeroInvitados ?? 0,
    };
    console.log("service",payload)

    await reservasService.updateReserva(id, payload);
    //recargar pagina
    window.location.reload()
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || "Error al editar la reserva";
    console.error("Error al editar:", err);
    throw new Error(errorMessage);
  }
}
