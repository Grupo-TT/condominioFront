// src/data/asamblea.mock.ts

import { Asamblea, Asistente } from '@/types/asamblea.types';

const isFutureDate = (date: string) => new Date(`${date}T23:59:59`) >= new Date();

const createAsamblea = (asamblea: Omit<Asamblea, 'estado'>): Asamblea => ({
  ...asamblea,
  estado: isFutureDate(asamblea.fecha) ? 'programada' : 'finalizada',
});

const createMockAsistentes = (
  asambleaId: string,
  fecha: string,
  startIndex: number,
  count = 22,
): Asistente[] => {
  const isPastAssembly = !isFutureDate(fecha);
  return Array.from({ length: count }, (_, idx) => {
    const participantNumber = startIndex + idx + 1;
    return {
      id: `${asambleaId}-${participantNumber}`,
      asambleaId,
      usuarioId: `user${participantNumber}`,
      nombre: `Participante ${participantNumber}`,
      casaId: `casa${((participantNumber - 1) % count) + 1}`,
      asistio: isPastAssembly ? idx % 3 !== 0 : false,
      createdAt: `${fecha}T09:00:00Z`,
    };
  });
};

export const mockAsambleas: Asamblea[] = [
  createAsamblea({
    id: '1',
    titulo: 'Asamblea Ordinaria 2025',
    descripcion: 'Asamblea ordinaria para discutir el presupuesto anual y temas administrativos.',
    fecha: '2025-12-15',
    hora: '19:00',
    lugar: 'Salón Comunitario',
  }),
  createAsamblea({
    id: '2',
    titulo: 'Asamblea Extraordinaria - Mantenimiento',
    descripcion: 'Reunión extraordinaria para aprobar trabajos de mantenimiento en la fachada del edificio.',
    fecha: '2024-11-20',
    hora: '18:30',
    lugar: 'Salón Comunitario',
  }),
  createAsamblea({
    id: '3',
    titulo: 'Asamblea Ordinaria 2023',
    descripcion: 'Asamblea ordinaria del año 2023 para revisión de cuentas y elecciones.',
    fecha: '2023-12-10',
    hora: '19:00',
    lugar: 'Salón Comunitario',
  }),
  createAsamblea({
    id: '4',
    titulo: 'Asamblea Extraordinaria - Seguridad',
    descripcion: 'Se discutirán nuevas medidas de seguridad y la instalación de cámaras en las entradas principales.Se discutirán nuevas medidas de seguridad y la instalación de cámaras en las entradas principales.Se discutirán nuevas medidas de seguridad y la instalación de cámaras en las entradas principales.',
    fecha: '2025-02-05',
    hora: '20:00',
    lugar: 'Salón Social Torre 2',
  }),
  createAsamblea({
    id: '5',
    titulo: 'Asamblea de Emergencia - Servicios Públicos',
    descripcion: 'Reunión para tratar el aumento en las tarifas de servicios públicos y su impacto en la administración.',
    fecha: '2024-09-25',
    hora: '17:30',
    lugar: 'Sala de reuniones torre central',
  }),
  createAsamblea({
    id: '6',
    titulo: 'Asamblea Informativa - Proyecto de piscina',
    descripcion: 'Sesión informativa para presentar el proyecto de la nueva piscina del condominio.',
    fecha: '2025-03-12',
    hora: '19:30',
    lugar: 'Salón de eventos principal',
  }),
];

export const mockAsistentes: Asistente[] = [
  ...createMockAsistentes('1', '2025-12-15', 0),
  ...createMockAsistentes('2', '2024-11-20', 22),
  ...createMockAsistentes('3', '2023-12-10', 44),
  ...createMockAsistentes('4', '2025-02-05', 66),
  ...createMockAsistentes('5', '2024-09-25', 88),
  ...createMockAsistentes('6', '2025-03-12', 110),
];
