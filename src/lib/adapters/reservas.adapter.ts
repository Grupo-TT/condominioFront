import { Reserva } from "@/types/reserva.types";
import type { IEventExtended, IUser } from "@/types/reservas-calendar.types";

// Función para convertir datos de la API al formato del calendario
export function adaptReservasToCalendar(reservas: Reserva[]): IEventExtended[] {
  return reservas.map((reserva) => {
    // Crear fecha de inicio combinando fecha y hora
    const startDate = new Date(`${reserva.fecha}T${reserva.horaInicio}`);
    const endDate = new Date(`${reserva.fecha}T${reserva.horaFin}`);

    // Determinar el color basado en el tipo de recurso
    const isZona = reserva.recurso.toLowerCase().includes('salón') || 
                   reserva.recurso.toLowerCase().includes('piscina') ||
                   reserva.recurso.toLowerCase().includes('gimnasio') ||
                   reserva.recurso.toLowerCase().includes('cancha') ||
                   reserva.recurso.toLowerCase().includes('bbq') ||
                   reserva.recurso.toLowerCase().includes('sala') ||
                   reserva.recurso.toLowerCase().includes('área');

    const tipoRecurso: 'Zona' | 'Objeto' = isZona ? 'Zona' : 'Objeto';
    const color: 'orange' | 'purple' = isZona ? 'orange' : 'purple';

    // Crear usuario basado en el solicitante
    const user: IUser = {
      id: `propietario-${reserva.solicitante.numeroCasa}`,
      name: reserva.solicitante.nombre,
      picturePath: null,
    };

    return {
      id: reserva.id,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      title: `Reserva - ${reserva.recurso}`,
      color,
      description: `Reserva de ${reserva.recurso} por ${reserva.solicitante.nombre}`,
      user,
      tipoRecurso,
      numeroInvitados: 0, // No disponible en la API actual
      casaNumero: reserva.solicitante.numeroCasa.toString(),
      estado: reserva.estado.toLowerCase() as 'pendiente' | 'aprobada' | 'rechazada',
    };
  });
}

// Función para obtener usuarios únicos de las reservas
export function extractUsersFromReservas(reservas: Reserva[]): IUser[] {
  const userMap = new Map<string, IUser>();
  
  reservas.forEach((reserva) => {
    const userId = `propietario-${reserva.solicitante.numeroCasa}`;
    if (!userMap.has(userId)) {
      userMap.set(userId, {
        id: userId,
        name: reserva.solicitante.nombre,
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
