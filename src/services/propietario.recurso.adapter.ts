import type { RecursoPropietarioResponse, DisponibilidadRecurso } from '@/types/recursos.types'

export type RecursoUI = Omit<RecursoPropietarioResponse, 'id' | 'tipoRecursoComun' | 'disponibilidadRecurso'> & {
  id: string
  tipo: 'zona' | 'objeto'
  estado: 'Disponible' | 'En Mantenimiento' | 'No disponible'
  habilitado: boolean
  tipoRecursoComun: RecursoPropietarioResponse['tipoRecursoComun']
  disponibilidadRecurso: DisponibilidadRecurso
}

const ESTADOS_MAP: Record<DisponibilidadRecurso, RecursoUI['estado']> = {
  DISPONIBLE: 'Disponible',
  EN_MANTENIMIENTO: 'En Mantenimiento',
  NO_DISPONIBLE: 'No disponible'
}

export function mapResponseToUI(resp: RecursoPropietarioResponse): RecursoUI {
  const disponibilidad = resp.disponibilidadRecurso;

  return {
    id: String(resp.id ?? Date.now()),
    nombre: resp.nombre,
    descripcion: resp.descripcion,

    tipo: resp.tipoRecursoComun === 'ZONA' ? 'zona' : 'objeto',
    tipoRecursoComun: resp.tipoRecursoComun,

    disponibilidadRecurso: disponibilidad,

    estado: ESTADOS_MAP[disponibilidad],

    habilitado: disponibilidad === 'DISPONIBLE'
  };
}
