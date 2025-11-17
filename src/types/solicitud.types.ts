export interface Trabajador {
  nombre: string
  documento: string
  arl: string
}

export interface Solicitud {
  id: string
  casaId: string
  numeroCasa: string
  propietario: string
  titulo: string
  tipo: 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia'
  fecha: string
  estado: 'pendiente' | 'aprobada' | 'rechazada' | 'revisada'
  descripcion?: string
  // Campos específicos para reparaciones locativas
  tipoObra?: 'Hidráulica' | 'Eléctrica' | 'Obra blanca' | 'Obra gris' | 'Otra'
  fechaInicio?: string
  fechaFinalizacion?: string
  trabajadores?: Trabajador[]
}

