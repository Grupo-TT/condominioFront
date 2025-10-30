import type { IEvent, IUser } from "@/calendar/interfaces";

// Solo usamos 2 colores: orange (dorado) para Zonas y purple (morado) para Objetos

export type TipoRecurso = 'Zona' | 'Objeto';
export type EstadoReserva = 'pendiente' | 'aprobada' | 'rechazada';

export interface IEventExtended extends IEvent {
  tipoRecurso?: TipoRecurso;
  numeroInvitados?: number;
  casaNumero?: string;
  estado?: EstadoReserva;
}

// Usuarios mock basados en propietarios del condominio
export const PROPIETARIOS_MOCK: IUser[] = [
  {
    id: "propietario-1",
    name: "Jose Pérez Hurtado",
    picturePath: null,
  },
  {
    id: "propietario-2", 
    name: "María González López",
    picturePath: null,
  },
  {
    id: "propietario-3",
    name: "Carlos Rodríguez Silva",
    picturePath: null,
  },
  {
    id: "propietario-4",
    name: "Ana Martínez Ruiz",
    picturePath: null,
  },
  {
    id: "propietario-5",
    name: "Luis Fernández Vega",
    picturePath: null,
  },
  {
    id: "propietario-6",
    name: "Carmen Díaz Morales",
    picturePath: null,
  },
];

// Espacios comunes disponibles para reserva
const ESPACIOS_COMUNES: Array<{nombre: string; tipo: TipoRecurso}> = [
  { nombre: "Salón de Eventos", tipo: "Zona" },
  { nombre: "Piscina", tipo: "Zona" },
  { nombre: "Gimnasio", tipo: "Zona" },
  { nombre: "Cancha Deportiva", tipo: "Zona" },
  { nombre: "BBQ/Parrilla", tipo: "Zona" },
  { nombre: "Sala de Juegos", tipo: "Zona" },
  { nombre: "Área de Niños", tipo: "Zona" },
  { nombre: "Sillas Plegables", tipo: "Objeto" },
  { nombre: "Mesas Plegables", tipo: "Objeto" },
  { nombre: "Proyector", tipo: "Objeto" },
];

// Datos de casas por propietario
const CASAS_MAP: Record<string, string> = {
  'Jose Pérez Hurtado': '12A',
  'María González López': '12A',
  'Carlos Rodríguez Silva': '8B',
  'Ana Martínez Ruiz': '5C',
  'Luis Fernández Vega': '15D',
  'Carmen Díaz Morales': '3A',
};

// Generar reservas mock con datos determinísticos para evitar errores de hidratación
const generateReservasMock = (): IEventExtended[] => {
  const reservas: IEventExtended[] = [];
  let currentId = 1;

  // Fecha base fija para evitar diferencias entre servidor y cliente
  // Octubre 2025 - fecha fija para que servidor y cliente coincidan
  const baseDate = new Date('2025-10-22T00:00:00.000Z');
  
  // Datos predefinidos para evitar aleatoriedad
  // Comenzando desde el día 23 de octubre (día después de la fecha base)
  const reservasData = [
    { propietarioIndex: 0, espacioIndex: 0, dayOffset: 1, hour: 9, minute: 0, duration: 2 },    // 23 oct - Zona (NARANJA)
    { propietarioIndex: 1, espacioIndex: 7, dayOffset: 2, hour: 14, minute: 30, duration: 3 },  // 24 oct - Objeto (MORADO)
    { propietarioIndex: 2, espacioIndex: 1, dayOffset: 3, hour: 10, minute: 0, duration: 1 },   // 25 oct - Zona (NARANJA)
    { propietarioIndex: 3, espacioIndex: 8, dayOffset: 4, hour: 16, minute: 0, duration: 2 },   // 26 oct - Objeto (MORADO)
    { propietarioIndex: 4, espacioIndex: 2, dayOffset: 5, hour: 11, minute: 15, duration: 4 },  // 27 oct - Zona (NARANJA)
    { propietarioIndex: 5, espacioIndex: 9, dayOffset: 6, hour: 8, minute: 0, duration: 2 },    // 28 oct - Objeto (MORADO)
    { propietarioIndex: 0, espacioIndex: 3, dayOffset: 7, hour: 15, minute: 30, duration: 1 },  // 29 oct - Zona (NARANJA)
    { propietarioIndex: 1, espacioIndex: 7, dayOffset: 8, hour: 12, minute: 0, duration: 3 },   // 30 oct - Objeto (MORADO)
    { propietarioIndex: 2, espacioIndex: 4, dayOffset: 9, hour: 17, minute: 0, duration: 2 },   // 31 oct - Zona (NARANJA)
    { propietarioIndex: 3, espacioIndex: 8, dayOffset: 10, hour: 13, minute: 45, duration: 1 }, // 1 nov - Objeto (MORADO)
    { propietarioIndex: 4, espacioIndex: 0, dayOffset: 11, hour: 9, minute: 30, duration: 2 },  // 2 nov - Zona (NARANJA)
    { propietarioIndex: 5, espacioIndex: 9, dayOffset: 12, hour: 18, minute: 0, duration: 3 },  // 3 nov - Objeto (MORADO)
    { propietarioIndex: 0, espacioIndex: 1, dayOffset: 13, hour: 10, minute: 15, duration: 1 }, // 4 nov - Zona (NARANJA)
    { propietarioIndex: 1, espacioIndex: 7, dayOffset: 14, hour: 14, minute: 0, duration: 4 },  // 5 nov - Objeto (MORADO)
    { propietarioIndex: 2, espacioIndex: 2, dayOffset: 15, hour: 16, minute: 30, duration: 2 }, // 6 nov - Zona (NARANJA)
    { propietarioIndex: 3, espacioIndex: 8, dayOffset: 16, hour: 11, minute: 0, duration: 1 },  // 7 nov - Objeto (MORADO)
    { propietarioIndex: 4, espacioIndex: 3, dayOffset: 17, hour: 19, minute: 0, duration: 3 },  // 8 nov - Zona (NARANJA)
    { propietarioIndex: 5, espacioIndex: 9, dayOffset: 18, hour: 8, minute: 30, duration: 2 },  // 9 nov - Objeto (MORADO)
    { propietarioIndex: 0, espacioIndex: 4, dayOffset: 19, hour: 15, minute: 0, duration: 1 },  // 10 nov - Zona (NARANJA)
    { propietarioIndex: 1, espacioIndex: 7, dayOffset: 20, hour: 12, minute: 45, duration: 4 }, // 11 nov - Objeto (MORADO)
    { propietarioIndex: 2, espacioIndex: 5, dayOffset: 21, hour: 17, minute: 30, duration: 2 }, // 12 nov - Zona (NARANJA)
    { propietarioIndex: 3, espacioIndex: 8, dayOffset: 22, hour: 13, minute: 0, duration: 1 },  // 13 nov - Objeto (MORADO)
    { propietarioIndex: 4, espacioIndex: 6, dayOffset: 23, hour: 9, minute: 45, duration: 3 },  // 14 nov - Zona (NARANJA)
    { propietarioIndex: 5, espacioIndex: 9, dayOffset: 24, hour: 18, minute: 15, duration: 2 }, // 15 nov - Objeto (MORADO)
    { propietarioIndex: 0, espacioIndex: 0, dayOffset: 25, hour: 10, minute: 0, duration: 1 },  // 16 nov - Zona (NARANJA)
  ];

  // Descripción basada en el espacio
  const descripciones: Record<string, string> = {
    "Salón de Eventos": "Reserva del salón para evento familiar. Capacidad para 50 personas.",
    "Piscina": "Reserva de piscina para uso familiar. Incluye acceso a vestuarios.",
    "Gimnasio": "Reserva de gimnasio para entrenamiento personal.",
    "Cancha Deportiva": "Reserva de cancha para partido de fútbol/tenis.",
    "BBQ/Parrilla": "Reserva de área de BBQ para asado familiar.",
    "Sala de Juegos": "Reserva de sala de juegos para entretenimiento.",
    "Área de Niños": "Reserva de área de juegos infantiles.",
    "Sillas Plegables": "Reserva de 20 sillas plegables para evento.",
    "Mesas Plegables": "Reserva de 10 mesas plegables para evento.",
    "Proyector": "Reserva de proyector y pantalla para presentación.",
  };

  reservasData.forEach(({ propietarioIndex, espacioIndex, dayOffset, hour, minute, duration }) => {
    const propietario = PROPIETARIOS_MOCK[propietarioIndex];
    const espacio = ESPACIOS_COMUNES[espacioIndex];

    // Fecha determinística
    const startDate = new Date(baseDate);
    startDate.setDate(baseDate.getDate() + dayOffset);
    startDate.setHours(hour, minute, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + duration, startDate.getMinutes(), 0, 0);

    // Evitar que se extienda más allá de las 10 PM
    if (endDate.getHours() > 22) {
      endDate.setHours(22, 0, 0, 0);
    }

    reservas.push({
      id: currentId++,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      title: `Reserva - ${espacio.nombre}`,
      color: 'gray', // El color se asignará dinámicamente según el tipoRecurso
      description: descripciones[espacio.nombre] || "Reserva de espacio común.",
      user: propietario,
      tipoRecurso: espacio.tipo,
      numeroInvitados: ((currentId * 7) % 10) + 1,
      casaNumero: CASAS_MAP[propietario.name] || 'N/A',
    });
  });

  return reservas;
};

export const RESERVAS_MOCK: IEventExtended[] = generateReservasMock();
