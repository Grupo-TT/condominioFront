
import { useEffect, useState } from "react";
import { Reserva } from "@/types/reserva.types";
import { reservasService } from "@/lib/services/reservas.service";

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

  return {
    reservas,
    reservasAprobadas,
    reservasRechazadas,
    reservasPendientes,
    tab,
    setTab,
    loading,
    error,
    recargar: cargarReservas,
  };
}

export async function aprobarReserva(id: number) {
  await reservasService.approveReserva(id);
}

export async function rechazarReserva(id: number) {
  await reservasService.rejectReserva(id);
}

export async function eliminarReserva(id: number) {
  await reservasService.deleteReserva(id);
}
