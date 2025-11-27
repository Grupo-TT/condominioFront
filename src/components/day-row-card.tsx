'use client'

import { cn } from '@/lib/utils'
import { IEventExtended } from '@/types/reservas-calendar.types'
import { ReservaCard } from './reserva-card'

interface DayRowCardProps {
  day: Date
  dayNumber: number
  reservas: IEventExtended[]
  isSelected?: boolean
  onClick?: () => void
  onViewDetails?: (reserva: IEventExtended) => void
  onEdit?: (reserva: IEventExtended) => void
  onDelete?: (reserva: IEventExtended) => void
  onAprobar?: (reserva: IEventExtended) => void
  onRechazar?: (reserva: IEventExtended) => void
}

export function DayRowCard({ 
  dayNumber, 
  reservas, 
  isSelected = false,
  onClick,
  onViewDetails,
  onEdit,
  onDelete,
  onAprobar,
  onRechazar
}: DayRowCardProps) {
  const hasReservas = reservas.length > 0

  // Si no hay reservas, mostrar versión compacta
  if (!hasReservas) {
    return (
      <div 
        className={cn(
          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-pointer",
          "bg-gray-50/50 hover:bg-gray-100/50",
          isSelected && "ring-2 ring-gray-300"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3 min-w-[80px]">
          <span className="text-lg font-semibold text-gray-300 w-6 text-right">
            {dayNumber}
          </span>
          <span className="text-sm text-gray-400 capitalize">
            Sin reservas
          </span>
        </div>
      </div>
    )
  }

  // Si no hay reservas
  if (!hasReservas) {
    return (
      <div 
        className={cn(
          "flex items-center gap-4 px-4 py-4 rounded-xl transition-all cursor-pointer",
          "hover:bg-gray-50",
          isSelected && "ring-2 ring-gray-300 bg-gray-50"
        )}
        onClick={onClick}
      >
        <div className="flex items-center gap-3 min-w-[80px]">
          <span className="text-lg font-semibold text-gray-300 w-6 text-right">
            {dayNumber}
          </span>
          <span className="text-sm text-gray-400">
            Sin reservas
          </span>
        </div>
      </div>
    )
  }

  // Con reservas - mostrar tarjetas
  return (
    <div 
      className={cn(
        "flex gap-4 p-4 rounded-2xl transition-all cursor-pointer min-h-[120px]",
        "hover:bg-gray-50/80",
        isSelected && "ring-2 ring-gray-300 bg-gray-50/80"
      )}
      onClick={onClick}
    >
      {/* Número del día */}
      <div className="flex flex-col items-center min-w-[32px] pt-1">
        <span className="text-xl font-bold text-gray-800">
          {dayNumber}
        </span>
      </div>

      {/* Flex de tarjetas de reserva - ajustado para tarjetas más pequeñas */}
      <div className="flex-1 flex flex-wrap gap-3">
        {reservas.map((reserva) => (
          <ReservaCard 
            key={reserva.id} 
            reserva={reserva}
            onViewDetails={onViewDetails}
            onEdit={onEdit}
            onDelete={onDelete}
            onAprobar={onAprobar}
            onRechazar={onRechazar}
          />
        ))}
      </div>
    </div>
  )
}
