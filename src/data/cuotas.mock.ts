import { CuotaCasa } from '@/types/cuotas.types'

export const cuotasData: CuotaCasa[] = [
  {
    id: '1',
    numeroCasa: '15',
    propietario: 'Jose Pérez Hurtado',
    saldoPendiente: 300000,
    cantidadPagosPendientes: 2,
    ultimoPago: '2024-01-15',
    obligaciones: [
      {
        id: '1-1',
        titulo: 'Cuota de Administración - Enero 2024',
        valorTotal: 150000,
        saldoPendiente: 150000,
        abonado: 0,
      },
      {
        id: '1-2',
        titulo: 'Cuota de Administración - Febrero 2024',
        valorTotal: 150000,
        saldoPendiente: 150000,
        abonado: 0,
      },
    ],
  },
  {
    id: '2',
    numeroCasa: '12',
    propietario: 'María García López',
    saldoPendiente: 225000,
    cantidadPagosPendientes: 2,
    ultimoPago: '2024-01-10',
    obligaciones: [
      {
        id: '2-1',
        titulo: 'Cuota de Administración - Febrero 2024',
        valorTotal: 150000,
        saldoPendiente: 150000,
        abonado: 0,
      },
      {
        id: '2-2',
        titulo: 'Multa por mascota sin correa',
        valorTotal: 75000,
        saldoPendiente: 75000,
        abonado: 0,
      },
    ],
  },
  {
    id: '3',
    numeroCasa: '11',
    propietario: 'Carlos Rodríguez Silva',
    saldoPendiente: 0,
    cantidadPagosPendientes: 0,
    ultimoPago: '2024-02-01',
    obligaciones: [
      {
        id: '3-1',
        titulo: 'Cuota de Administración - Marzo 2024',
        valorTotal: 150000,
        saldoPendiente: 0,
        abonado: 150000,
      },
      {
        id: '3-2',
        titulo: 'Multa por estacionamiento indebido',
        valorTotal: 50000,
        saldoPendiente: 0,
        abonado: 50000,
      },
    ],
  },
  {
    id: '4',
    numeroCasa: '10',
    propietario: 'Ana Martínez Ruiz',
    saldoPendiente: 0,
    cantidadPagosPendientes: 0,
    ultimoPago: '2024-02-05',
    obligaciones: [
      {
        id: '4-1',
        titulo: 'Cuota de Administración - Diciembre 2023',
        valorTotal: 150000,
        saldoPendiente: 0,
        abonado: 150000,
      },
      {
        id: '4-2',
        titulo: 'Cuota de Administración - Enero 2024',
        valorTotal: 150000,
        saldoPendiente: 0,
        abonado: 150000,
      },
    ],
  },
  {
    id: '5',
    numeroCasa: '19',
    propietario: 'Pedro López González',
    saldoPendiente: 150000,
    cantidadPagosPendientes: 1,
    ultimoPago: '2024-01-20',
    obligaciones: [
      {
        id: '5-1',
        titulo: 'Cuota de Administración - Febrero 2024',
        valorTotal: 150000,
        saldoPendiente: 150000,
        abonado: 0,
      },
      {
        id: '5-2',
        titulo: 'Multa por daños en área común',
        valorTotal: 100000,
        saldoPendiente: 0,
        abonado: 100000,
      },
    ],
  },
]
