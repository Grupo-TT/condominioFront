import type { RecursoPropietarioResponse, DisponibilidadRecurso } from '@/types/recursos.types'

export type RecursoUI = Omit<RecursoPropietarioResponse, 'id'> & {
  id: string
  tipo: 'zona' | 'objeto'
  estado: string
  habilitado: boolean
}

export function mapResponseToUI(resp: RecursoPropietarioResponse): RecursoUI {
  const tipo = resp.tipoRecursoComun === 'ZONA' ? 'zona' : 'objeto';

  const disponibilidadNormalizada =
    resp.disponibilidadRecurso === 'NO_DISPONIBLE'
      ? 'EN_MANTENIMIENTO'
      : resp.disponibilidadRecurso;

  const getEstado = (disponibilidad: DisponibilidadRecurso) => {
    switch (disponibilidad) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'EN_MANTENIMIENTO':
        return 'En Mantenimiento';
      default:
        return 'No disponible';
    }
  };

  return {
    id: resp.id?.toString() ?? String(Date.now()),
    nombre: resp.nombre,
    descripcion: resp.descripcion,
    tipo,
    tipoRecursoComun: resp.tipoRecursoComun,

    disponibilidadRecurso: disponibilidadNormalizada as DisponibilidadRecurso,

    estado: getEstado(disponibilidadNormalizada as DisponibilidadRecurso),

    habilitado: disponibilidadNormalizada === 'DISPONIBLE'
  };
}
