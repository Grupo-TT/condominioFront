export type TipoRecursoComun = 'ZONA' | 'OBJETO'
export type DisponibilidadRecurso = 'DISPONIBLE' | 'NO_DISPONIBLE'

export interface RecursoRequest {
  nombre: string
  descripcion: string
  tipoRecursoComun: 'ZONA' | 'OBJETO'
  disponibilidadRecurso: 'DISPONIBLE' | 'NO_DISPONIBLE'
}

export interface RecursoResponse extends RecursoRequest {
  id?: number
} 

