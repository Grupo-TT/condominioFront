// Mock de propietarios para pruebas
export interface PropietarioMock {
  id: string
  nombre: string
  email: string
  numeroCasa: string
  telefono: string
  tipo: 'propietario' | 'arrendatario'
}

export const propietariosMock: PropietarioMock[] = [
  {
    id: '1',
    nombre: 'Carlos Andrés Martínez',
    email: 'carlos.martinez@email.com',
    numeroCasa: '1',
    telefono: '3001234567',
    tipo: 'propietario',
  },
  {
    id: '2',
    nombre: 'María Elena Rodríguez',
    email: 'maria.rodriguez@email.com',
    numeroCasa: '2',
    telefono: '3009876543',
    tipo: 'propietario',
  },
  {
    id: '3',
    nombre: 'Juan Pablo García',
    email: 'juan.garcia@email.com',
    numeroCasa: '3',
    telefono: '3005551234',
    tipo: 'arrendatario',
  },
  {
    id: '4',
    nombre: 'Ana Lucía Fernández',
    email: 'ana.fernandez@email.com',
    numeroCasa: '4',
    telefono: '3007778899',
    tipo: 'propietario',
  },
  {
    id: '5',
    nombre: 'Roberto Carlos López',
    email: 'roberto.lopez@email.com',
    numeroCasa: '5',
    telefono: '3002223344',
    tipo: 'arrendatario',
  },
  {
    id: '6',
    nombre: 'Patricia Morales Díaz',
    email: 'patricia.morales@email.com',
    numeroCasa: '6',
    telefono: '3006667788',
    tipo: 'propietario',
  },
  {
    id: '7',
    nombre: 'Fernando José Ramírez',
    email: 'fernando.ramirez@email.com',
    numeroCasa: '7',
    telefono: '3004445566',
    tipo: 'arrendatario',
  },
  {
    id: '8',
    nombre: 'Claudia Marcela Torres',
    email: 'claudia.torres@email.com',
    numeroCasa: '8',
    telefono: '3008889900',
    tipo: 'propietario',
  },
  {
    id: '9',
    nombre: 'Diego Alejandro Sánchez',
    email: 'diego.sanchez@email.com',
    numeroCasa: '9',
    telefono: '3001112233',
    tipo: 'arrendatario',
  },
  {
    id: '10',
    nombre: 'Laura Valentina Herrera',
    email: 'laura.herrera@email.com',
    numeroCasa: '10',
    telefono: '3003334455',
    tipo: 'propietario',
  },
  {
    id: '11',
    nombre: 'Andrés Felipe Castillo',
    email: 'andres.castillo@email.com',
    numeroCasa: '11',
    telefono: '3005556677',
    tipo: 'arrendatario',
  },
  {
    id: '12',
    nombre: 'Mónica Andrea Vargas',
    email: 'monica.vargas@email.com',
    numeroCasa: '12',
    telefono: '3007778800',
    tipo: 'propietario',
  },
  {
    id: '13',
    nombre: 'Santiago David Mendoza',
    email: 'santiago.mendoza@email.com',
    numeroCasa: '13',
    telefono: '3009990011',
    tipo: 'arrendatario',
  },
  {
    id: '14',
    nombre: 'Valentina Sofía Ruiz',
    email: 'valentina.ruiz@email.com',
    numeroCasa: '14',
    telefono: '3002224466',
    tipo: 'propietario',
  },
  {
    id: '15',
    nombre: 'Sebastián Camilo Ortiz',
    email: 'sebastian.ortiz@email.com',
    numeroCasa: '15',
    telefono: '3004446688',
    tipo: 'arrendatario',
  },
]
