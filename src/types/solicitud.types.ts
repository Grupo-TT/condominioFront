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
  estado: 'pendiente' | 'aprobada' | 'revisada' | 'desaprobada'
  descripcion?: string
  // Campos específicos para reparaciones locativas
  tipoObra?: 'Eléctrica' | 'Hidráulica' | 'Alturas (superior a 1.50m)' | 'Obra blanca' | 'Obra gris' | 'Otra' | string
  fechaInicio?: string
  fechaFinalizacion?: string
  trabajadores?: Trabajador[]
}

