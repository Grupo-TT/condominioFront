// Tipos para miembros de una casa
export interface Miembro {
  genero: 'masculino' | 'femenino'
}

// Tipos para mascotas
export interface Mascota {
  tipo: 'perro' | 'gato'
}

// Tipo principal de Casa
export interface Casa {
  id: string
  numero: string
  propietario: string
  miembros: Miembro[]
  mascotas: Mascota[]
  estado: 'Al Día' | 'En Mora'
  uso: 'Residencial' | 'Arrendada'
}

