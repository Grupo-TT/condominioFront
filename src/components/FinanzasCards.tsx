'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import {
  MoneySendSquareIcon,
  MoneyReceiveSquareIcon,
  Calendar02Icon,
  Alert02Icon,
} from '@hugeicons/core-free-icons'

interface FinanzasCardsProps {
  saldoPendiente: number
  obligacionesPendientesCount: number
  fechaUltimoPago: string
  multasPendientesCount: number
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

const formatDate = (dateString: string): string => {
  // Agregar T12:00:00 para evitar desfase de zona horaria
  const date = new Date(`${dateString}T12:00:00`)
  if (isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function FinanzasCards({
  saldoPendiente,
  obligacionesPendientesCount,
  fechaUltimoPago,
  multasPendientesCount,
}: FinanzasCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Saldo pendiente */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={MoneySendSquareIcon} className="w-5 h-5" style={{ color: '#081534' }} />
          <p className="text-sm font-medium text-gray-600">Saldo pendiente</p>
        </div>
        <div className="text-3xl font-bold mb-1 text-rose-600">
          {formatCurrency(saldoPendiente)}
        </div>
        <p className="text-xs text-gray-500">
          Cuotas por pagar
        </p>
      </div>

      {/* Obligaciones pendientes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={MoneyReceiveSquareIcon} className="w-5 h-5" style={{ color: '#081534' }} />
          <p className="text-sm font-medium text-gray-600">Obligaciones pendientes</p>
        </div>
        <div className="text-3xl font-bold mb-1 text-gray-900">
          {obligacionesPendientesCount}
        </div>
        <p className="text-xs text-gray-500">
          Cuotas por pagar
        </p>
      </div>

      {/* Fecha del último pago */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={Calendar02Icon} className="w-5 h-5" style={{ color: '#081534' }} />
          <p className="text-sm font-medium text-gray-600">Último pago</p>
        </div>
        <div className="text-2xl font-bold mb-1 text-gray-900 min-h-[2.5rem] flex items-end">
          {formatDate(fechaUltimoPago)}
        </div>
        <p className="text-xs text-gray-500">
          Fecha del último pago realizado
        </p>
      </div>

      {/* Multas pendientes */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={Alert02Icon} className="w-5 h-5" style={{ color: '#081534' }} />
          <p className="text-sm font-medium text-gray-600">Multas pendientes</p>
        </div>
        <div className="text-3xl font-bold mb-1 text-amber-600">
          {multasPendientesCount}
        </div>
        <p className="text-xs text-gray-500">
          Multas por pagar
        </p>
      </div>
    </div>
  )
}

