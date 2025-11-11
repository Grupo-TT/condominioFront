// src/services/recurso.adapter.ts (ejemplo)
import type { RecursoRequest, RecursoResponse, DisponibilidadRecurso } from '@/types/recursos.types'

// Tipo usado por la UI: forma adaptada de la respuesta de la API
export type RecursoUI = Omit<RecursoResponse, 'id'> & {
  id: string
  tipo: 'zona' | 'objeto'
  estado: string
  habilitado: boolean
}

export function mapFormToRequest(form: { nombre: string; descripcion: string; tipo: 'zona'|'objeto' | '' }, disponibilidad?: DisponibilidadRecurso) : RecursoRequest {
  return {
    nombre: form.nombre,
    descripcion: form.descripcion,
    tipoRecursoComun: form.tipo === 'zona' ? 'ZONA' : 'OBJETO',
    disponibilidadRecurso: disponibilidad || 'DISPONIBLE'
  }
}

export function mapResponseToUI(resp: RecursoResponse): RecursoUI {
  const tipo = resp.tipoRecursoComun === 'ZONA' ? 'zona' : 'objeto'
  const getEstado = (disponibilidad: DisponibilidadRecurso) => {
    switch (disponibilidad) {
      case 'DISPONIBLE':
        return 'Disponible'
      case 'EN_MANTENIMIENTO':
        return 'En Mantenimiento'
      default:
        return 'No disponible'
    }
  }
  return {
    id: resp.id != null ? resp.id.toString() : String(Date.now()),
    nombre: resp.nombre,
    descripcion: resp.descripcion,
    tipo: tipo as 'zona' | 'objeto',
    tipoRecursoComun: resp.tipoRecursoComun,
    disponibilidadRecurso: resp.disponibilidadRecurso,
    estado: getEstado(resp.disponibilidadRecurso),
    habilitado: resp.disponibilidadRecurso === 'DISPONIBLE'
  }
}