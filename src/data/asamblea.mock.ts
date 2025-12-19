// src/data/asamblea.mock.ts
// NOTA: Este archivo contiene datos mock para desarrollo/testing.
// La API real se usa en producción.

import { Asamblea, Asistente } from '@/types/asamblea.types';

const createMockAsistentes = (
  asambleaId: string,
  fecha: string,
  startIndex: number,
  count = 22,
): Asistente[] => {
  const isPastAssembly = new Date(`${fecha}T23:59:59`) < new Date();
  return Array.from({ length: count }, (_, idx) => {
    const participantNumber = startIndex + idx + 1;
    return {
      id: participantNumber, // number, not string
      nombre: `Participante ${participantNumber}`,
      asistio: isPastAssembly ? idx % 3 !== 0 : false,
    };
  });
};

export const mockAsambleas: Asamblea[] = [
  {
    id: '1',
    titulo: 'Asamblea Ordinaria 2025',
    descripcion: 'Asamblea ordinaria para discutir el presupuesto anual y temas administrativos.',
    fecha: '2025-12-15',
    horaInicio: '19:00',
    lugar: 'Salón Comunitario',
    estado: 'PROGRAMADA',
  },
  {
    id: '2',
    titulo: 'Asamblea Extraordinaria - Mantenimiento',
    descripcion: 'Reunión extraordinaria para aprobar trabajos de mantenimiento en la fachada del edificio.',
    fecha: '2024-11-20',
    horaInicio: '18:30',
    lugar: 'Salón Comunitario',
    estado: 'REALIZADA',
  },
  {
    id: '3',
    titulo: 'Asamblea Ordinaria 2023',
    descripcion: 'Asamblea ordinaria del año 2023 para revisión de cuentas y elecciones.',
    fecha: '2023-12-10',
    horaInicio: '19:00',
    lugar: 'Salón Comunitario',
    estado: 'REALIZADA',
  },
  {
    id: '4',
    titulo: 'Asamblea Extraordinaria - Seguridad',
    descripcion: 'Se discutirán nuevas medidas de seguridad y la instalación de cámaras en las entradas principales.',
    fecha: '2025-02-05',
    horaInicio: '20:00',
    lugar: 'Salón Social Torre 2',
    estado: 'PROGRAMADA',
  },
  {
    id: '5',
    titulo: 'Asamblea de Emergencia - Servicios Públicos',
    descripcion: 'Reunión para tratar el aumento en las tarifas de servicios públicos y su impacto en la administración.',
    fecha: '2024-09-25',
    horaInicio: '17:30',
    lugar: 'Sala de reuniones torre central',
    estado: 'REALIZADA',
  },
  {
    id: '6',
    titulo: 'Asamblea Informativa - Proyecto de piscina',
    descripcion: 'Sesión informativa para presentar el proyecto de la nueva piscina del condominio.',
    fecha: '2025-03-12',
    horaInicio: '19:30',
    lugar: 'Salón de eventos principal',
    estado: 'PROGRAMADA',
  },
  {
    id: '7',
    titulo: 'Asamblea Extraordinaria - Seguridad Perimetral',
    descripcion: 'Presentación del plan de refuerzo de cerramiento, iluminación y rondas de vigilancia.',
    fecha: '2025-05-22',
    horaInicio: '18:45',
    lugar: 'Auditorio Principal',
    estado: 'PROGRAMADA',
  },
  {
    id: '8',
    titulo: 'Asamblea Ordinaria 2026',
    descripcion: 'Revisión del presupuesto anual, actualización de cuotas y calendario de actividades 2026.',
    fecha: '2026-02-10',
    horaInicio: '19:00',
    lugar: 'Salón Social Torre 1',
    estado: 'PROGRAMADA',
  },
  {
    id: '9',
    titulo: 'Asamblea Informativa - Plan de Energía Solar',
    descripcion: 'Informe técnico y financiero sobre la instalación de paneles solares en áreas comunes.',
    fecha: '2025-07-18',
    horaInicio: '18:00',
    lugar: 'Sala de reuniones torre central',
    estado: 'PROGRAMADA',
  },
  {
    id: '10',
    titulo: 'Asamblea Extraordinaria - Actualización Tecnológica',
    descripcion: 'Reunión para aprobar la implementación de nuevos sistemas de control de acceso y domótica.',
    fecha: '2026-09-05',
    horaInicio: '19:15',
    lugar: 'Auditorio Smart Living',
    estado: 'PROGRAMADA',
  },
];

export const mockAsistentes: Asistente[] = [
  ...createMockAsistentes('1', '2025-12-15', 0),
  ...createMockAsistentes('2', '2024-11-20', 22),
  ...createMockAsistentes('3', '2023-12-10', 44),
  ...createMockAsistentes('4', '2025-02-05', 66),
  ...createMockAsistentes('5', '2024-09-25', 88),
  ...createMockAsistentes('6', '2025-03-12', 110),
];
