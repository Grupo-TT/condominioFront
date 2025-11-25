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
    const errors: string[] = [];

    try {
      // Cargar cada tipo de reserva de forma independiente
      // Si una falla, las otras pueden continuar
      const [aprobadasResult, rechazadasResult, pendientesResult] = await Promise.allSettled([
        reservasService.getReservasAprobadas(),
        reservasService.getReservasRechazadas(),
        reservasService.getReservasPendientes()
      ]);

      // Procesar resultados aprobadas
      if (aprobadasResult.status === 'fulfilled') {
        setReservasAprobadas(aprobadasResult.value);
      } else {
        console.error("Error al obtener reservas aprobadas:", aprobadasResult.reason);
        const errorMsg = (aprobadasResult.reason as any)?.response?.data?.message || "Error al obtener reservas aprobadas";
        errors.push(errorMsg);
        setReservasAprobadas([]);
      }

      // Procesar resultados rechazadas
      if (rechazadasResult.status === 'fulfilled') {
        setReservasRechazadas(rechazadasResult.value);
      } else {
        console.error("Error al obtener reservas rechazadas:", rechazadasResult.reason);
        const errorMsg = (rechazadasResult.reason as any)?.response?.data?.message || "Error al obtener reservas rechazadas";
        errors.push(errorMsg);
        setReservasRechazadas([]);
      }

      // Procesar resultados pendientes
      if (pendientesResult.status === 'fulfilled') {
        setReservasPendientes(pendientesResult.value);
      } else {
        console.error("Error al obtener reservas pendientes:", pendientesResult.reason);
        const errorMsg = (pendientesResult.reason as any)?.response?.data?.message || "Error al obtener reservas pendientes";
        errors.push(errorMsg);
        setReservasPendientes([]);
      }

      // Si todas las peticiones fallaron, establecer un error general
      if (errors.length === 3) {
        setError("No se pudieron cargar las reservas. Por favor, intente nuevamente.");
      } else if (errors.length > 0) {
        // Si solo algunas fallaron, no establecer error pero loguear
        // Esto permite que la aplicación funcione con los datos disponibles
        console.warn("Algunas reservas no se pudieron cargar debido a datos inconsistentes:", errors);
        // No establecer error para que la UI pueda mostrar las reservas que sí se cargaron
      }
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
      await cargarReservas();
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
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al rechazar la reserva";
      setError(errorMessage);
      console.error("Error al rechazar:", err);
    }
  };
  const eliminarReserva = async (id: number) => {
    try {
      await reservasService.deleteReserva(id);
      await cargarReservas();
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al eliminar la reserva";
      setError(errorMessage);
      console.error("Error al eliminar:", err);
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

    await reservasService.updateReserva(id, payload);
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || "Error al editar la reserva";
    console.error("Error al editar:", err);
    throw new Error(errorMessage);
  }
}
