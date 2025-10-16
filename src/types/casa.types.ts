export interface Miembro {
  genero?: 'masculino' | 'femenino'
}

export interface Mascota {
  tipo: 'perro' | 'gato'
}

export interface Casa {
  id: string
  numero: string
  propietario: string
  miembros: Miembro[]
  mascotas: Mascota[]
  estado: 'Al Día' | 'En Mora'
  uso: 'Residencial' | 'Arrendada'
}

