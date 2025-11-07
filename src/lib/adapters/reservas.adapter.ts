import { Reserva } from "@/types/reserva.types";
import type { IEventExtended, IUser } from "@/types/reservas-calendar.types";

// Función para convertir datos de la API al formato del calendario
export function adaptReservasToCalendar(reservas: Reserva[]): IEventExtended[] {
  return reservas.map((reserva) => {

    // Crear fecha de inicio combinando fecha y hora
    const startDate = new Date(`${reserva.fechaSolicitud}T${reserva.horaInicio}`);
    const endDate = new Date(`${reserva.fechaSolicitud}T${reserva.horaFin}`);

    // Determinar el color basado en el tipo de recurso
    const isZona = reserva.recursoComun.nombre.toLowerCase().includes('salón') ||
      reserva.recursoComun.nombre.toLowerCase().includes('piscina') ||
      reserva.recursoComun.nombre.toLowerCase().includes('gimnasio') ||
      reserva.recursoComun.nombre.toLowerCase().includes('cancha') ||
      reserva.recursoComun.nombre.toLowerCase().includes('bbq') ||
      reserva.recursoComun.nombre.toLowerCase().includes('sala') ||
      reserva.recursoComun.nombre.toLowerCase().includes('área');

    const tipoRecurso: 'Zona' | 'Objeto' = isZona ? 'Zona' : 'Objeto';
    const color: 'orange' | 'purple' = isZona ? 'orange' : 'purple';

    // Crear usuario basado en el solicitante
    const user: IUser = {
      id: reserva.casa.numeroCasa.toString(),
      name: reserva.solicitante.nombreCompleto,
      picturePath: null,
    };

    return {
      id: reserva.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      title: reserva.recursoComun.nombre.toString(),
      color,
      description: `Reserva de ${reserva.recursoComun.nombre} por ${reserva.solicitante.nombreCompleto}`,
      user,
      tipoRecurso,
      numeroInvitados: 0, // No disponible en la API actual
      casaNumero: reserva.casa.numeroCasa.toString(),
      estado: reserva.estadoSolicitud.toLowerCase() as 'pendiente' | 'aprobada' | 'rechazada',
    };
  });
}

// Función para obtener usuarios únicos de las reservas
export function extractUsersFromReservas(reservas: Reserva[]): IUser[] {
  const userMap = new Map<string, IUser>();

  reservas.forEach((reserva) => {
    const userId = reserva.casa.numeroCasa;
    if (!userMap.has(userId.toString())) {
      userMap.set(userId.toString(), {
        id: userId.toString(),
        name: reserva.solicitante.nombreCompleto,
        picturePath: null,
      });
    }
  });

  return Array.from(userMap.values());
}

// Función para aplicar colores a las reservas (mantener compatibilidad)
export function addColorToReservas(reservas: IEventExtended[]): IEventExtended[] {
  return reservas.map((reserva) => ({
    ...reserva,
    color: reserva.tipoRecurso === 'Zona' ? 'orange' : 'purple',
  }));
}
