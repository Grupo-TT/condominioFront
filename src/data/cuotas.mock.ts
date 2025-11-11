import { CuotaCasa } from '@/types/cuotas.types'
import { propietario } from '@/types/casa.types'

export const cuotasData: CuotaCasa[] = [
  {
    numeroCasa: 15,
    propietario: {
      nombreCompleto: 'Jose Pérez Hurtado',
      telefono: 3001234567,
      correo: 'jose.perez@example.com'
    } as propietario,
    saldoPendiente: 300000,
    ultimoPago: '2024-01-15',
    obligacionesPendientes: [
      {
        id: 1,
        motivo: 'Cuota de Administración - Enero 2024',
        valorTotal: 150000,
        valorPendiente: 150000,
        montoPagado: 0,
        titulo: 'Cuota de Administración - Enero 2024',
      },
      {
        id: 2,
        motivo: 'Cuota de Administración - Febrero 2024',
        valorTotal: 150000,
        valorPendiente: 150000,
        montoPagado: 0,
        titulo: 'Cuota de Administración - Febrero 2024',
      },
    ],
  },
  {
    numeroCasa: 12,
    propietario: {
      nombreCompleto: 'María García López',
      telefono: 3001234568,
      correo: 'maria.garcia@example.com'
    } as propietario,
    saldoPendiente: 225000,
    ultimoPago: '2024-01-10',
    obligacionesPendientes: [
      {
        id: 3,
        motivo: 'Cuota de Administración - Febrero 2024',
        valorTotal: 150000,
        valorPendiente: 150000,
        montoPagado: 0,
        titulo: 'Cuota de Administración - Febrero 2024',
      },
      {
        id: 4,
        motivo: 'Multa por mascota sin correa',
        valorTotal: 75000,
        valorPendiente: 75000,
        montoPagado: 0,
        titulo: 'Multa por mascota sin correa',
      },
    ],
  },
  {
    numeroCasa: 11,
    propietario: {
      nombreCompleto: 'Carlos Rodríguez Silva',
      telefono: 3001234569,
      correo: 'carlos.rodriguez@example.com'
    } as propietario,
    saldoPendiente: 0,
    ultimoPago: '2024-02-01',
    obligacionesPendientes: [],
  },
  {
    numeroCasa: 10,
    propietario: {
      nombreCompleto: 'Ana Martínez Ruiz',
      telefono: 3001234570,
      correo: 'ana.martinez@example.com'
    } as propietario,
    saldoPendiente: 0,
    ultimoPago: '2024-02-05',
    obligacionesPendientes: [],
  },
  {
    numeroCasa: 19,
    propietario: {
      nombreCompleto: 'Pedro López González',
      telefono: 3001234571,
      correo: 'pedro.lopez@example.com'
    } as propietario,
    saldoPendiente: 150000,
    ultimoPago: '2024-01-20',
    obligacionesPendientes: [
      {
        id: 5,
        motivo: 'Cuota de Administración - Febrero 2024',
        valorTotal: 150000,
        valorPendiente: 150000,
        montoPagado: 0,
        titulo: 'Cuota de Administración - Febrero 2024',
      },
    ],
  },
]
