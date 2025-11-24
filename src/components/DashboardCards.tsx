'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import { 
  MoneyReceiveSquareIcon, 
  MoneySendSquareIcon, 
  Alert02Icon,
  UserGroupIcon,
} from '@hugeicons/core-free-icons'

interface DashboardCardsProps {
  saldoPendiente: number
  obligacionesPendientesCount: number
  cantidadMascotas: number
  miembrosActivos: number
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

export function DashboardCards({
  saldoPendiente,
  obligacionesPendientesCount,
  cantidadMascotas,
  miembrosActivos,
}: DashboardCardsProps) {
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

      {/* Mascotas */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={Alert02Icon} className="w-5 h-5" style={{ color: '#081534' }} />
          <p className="text-sm font-medium text-gray-600">Mascotas</p>
        </div>
        <div className="text-3xl font-bold mb-1 text-amber-600">
          {cantidadMascotas}
        </div>
        <p className="text-xs text-gray-500">
          Mascotas registradas
        </p>
      </div>

      {/* Miembros activos del hogar */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
        <div className="flex items-center gap-2 mb-4">
          <HugeiconsIcon icon={UserGroupIcon} className="w-5 h-5" style={{ color: '#081534' }} />
          <p className="text-sm font-medium text-gray-600">Miembros activos del hogar</p>
        </div>
        <div className="text-3xl font-bold mb-1 text-gray-900">
          {miembrosActivos}
        </div>
        <p className="text-xs text-gray-500">
          Miembros registrados
        </p>
      </div>
    </div>
  )
}

