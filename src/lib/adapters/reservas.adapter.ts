import { Reserva } from "@/types/reserva.types";
import type { IEventExtended, IUser } from "@/types/reservas-calendar.types";

// Función para convertir datos de la API al formato del calendario
export function adaptReservasToCalendar(reservas: Reserva[]): IEventExtended[] {
  return reservas.map((reserva) => {
    // Normalizar formato de hora (asegurar que tenga formato HH:mm o HH:mm:ss)
    const normalizeTime = (time: string): string => {
      if (!time) return '00:00';
      // Si ya tiene formato HH:mm o HH:mm:ss, usarlo directamente
      if (time.match(/^\d{2}:\d{2}(:\d{2})?$/)) {
        return time.length === 5 ? `${time}:00` : time; // Agregar segundos si faltan
      }
      return time;
    };

    // Crear fecha de inicio combinando fecha y hora
    const horaInicioNormalizada = normalizeTime(reserva.horaInicio);
    const horaFinNormalizada = normalizeTime(reserva.horaFin);
    
    const startDate = new Date(`${reserva.fechaSolicitud}T${horaInicioNormalizada}`);
    const endDate = new Date(`${reserva.fechaSolicitud}T${horaFinNormalizada}`);
    
    // Validar que las fechas sean válidas
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      console.error('Fecha inválida en reserva:', reserva.id, {
        fechaSolicitud: reserva.fechaSolicitud,
        horaInicio: reserva.horaInicio,
        horaFin: reserva.horaFin
      });
      // Usar fecha actual como fallback
      const fallbackDate = new Date();
      return {
        id: reserva.id,
        startDate: fallbackDate.toISOString(),
        endDate: fallbackDate.toISOString(),
        title: reserva.recursoComun.nombre.toString(),
        color: 'gray',
        description: `Reserva de ${reserva.recursoComun.nombre} por ${reserva.solicitante.nombreCompleto}`,
        user: {
          id: reserva.casa.numeroCasa.toString(),
          name: reserva.solicitante.nombreCompleto,
          picturePath: null,
        },
        recursoComun: reserva.recursoComun,
        tipoRecurso: 'Objeto',
        numeroInvitados: reserva.numeroInvitados ?? 0,
        casaNumero: reserva.casa.numeroCasa.toString(),
        estado: reserva.estadoSolicitud.toLowerCase() as 'pendiente' | 'aprobada' | 'rechazada',
      };
    }

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
      recursoComun: reserva.recursoComun,
      tipoRecurso,
      numeroInvitados: reserva.numeroInvitados ?? 0,
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
