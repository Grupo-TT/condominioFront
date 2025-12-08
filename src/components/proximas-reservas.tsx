'use client'

import { MoreHorizontal, Check, X, MapPin, Package, Users, ArrowRight } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home07Icon, FullScreenIcon } from '@hugeicons/core-free-icons'
import { cn } from '@/lib/utils'
import { format, differenceInDays, startOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { IEventExtended } from '@/types/reservas-calendar.types'
import { useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface ProximasReservasProps {
  reservas: IEventExtended[]
  onAprobar?: (reserva: IEventExtended) => void
  onRechazar?: (reserva: IEventExtended) => void
  onViewDetails?: (reserva: IEventExtended) => void
}

// Esquemas de color por tipo de recurso
const colorSchemes = {
  zona: {
    card: 'bg-amber-50/50',
    footer: 'bg-[#efe1c7]',
    iconBox: 'bg-[#feeecd]',
  },
  objeto: {
    card: 'bg-violet-50/50',
    footer: 'bg-violet-200/80',
    iconBox: 'bg-violet-100',
  },
}

export function ProximasReservas({ reservas, onAprobar, onRechazar, onViewDetails }: ProximasReservasProps) {
  // Filtrar solo reservas pendientes y ordenar por fecha
  const reservasPendientes = useMemo(() => {
    return reservas
      .filter(r => r.estado === 'pendiente')
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }, [reservas])

  return (
    <div className="flex flex-col p-5 pt-2">

      {/* Lista de reservas */}
      <div className="space-y-3">
        {reservasPendientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-gray-400">
            <Check className="h-10 w-10 mb-2 opacity-50" />
            <p className="text-sm">No hay reservas pendientes</p>
          </div>
        ) : (
          reservasPendientes.map((reserva) => {
            const reservaDate = new Date(reserva.startDate)
            const baseDate = startOfDay(new Date(2025, 10, 25)) // Fecha base para calcular días
            const daysLeft = differenceInDays(startOfDay(reservaDate), baseDate)
            const horaInicio = format(reservaDate, 'h:mm a', { locale: es })
            const horaFin = format(new Date(reserva.endDate), 'h:mm a', { locale: es })
            const fechaFormateada = format(reservaDate, "d MMM", { locale: es })
            
            // Determinar tipo de recurso y colores
            const tipoRecurso = reserva.tipoRecurso?.toLowerCase() === 'zona' ? 'zona' : 'objeto'
            const colors = colorSchemes[tipoRecurso]
            const RecursoIcon = tipoRecurso === 'zona' ? MapPin : Package

            return (
              <div 
                key={reserva.id}
                className={cn(
                  "rounded-2xl transition-all hover:shadow-md cursor-pointer overflow-hidden border",
                  colors.card,
                  tipoRecurso === 'zona' ? 'border-amber-200' : 'border-violet-200'
                )}
              >
                {/* Header con recurso e info */}
                <div className="px-4 py-3.5 flex items-center gap-3">
                  {/* Icono del recurso */}
                  <div className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-xl",
                    colors.iconBox
                  )}>
                    <RecursoIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Nombre del recurso */}
                    <p className="font-bold text-gray-900 text-base truncate">
                      {reserva.title}
                    </p>
                    {/* Fecha y hora */}
                    <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-0.5">
                      {fechaFormateada} · {horaInicio}
                      <ArrowRight className="h-3 w-3" />
                      {horaFin}
                    </p>
                  </div>
                </div>

                {/* Footer con casa e invitados - estilo badge */}
                <div className={cn(
                  "px-4 py-2.5 flex items-center gap-2",
                  colors.footer
                )}>
                  {/* Badge Casa */}
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white text-xs font-medium shrink-0">
                    <HugeiconsIcon icon={Home07Icon} size={14} className="text-gray-500" />
                    <span className="text-gray-700">Casa No.{reserva.casaNumero}</span>
                  </div>

                  {/* Badge Invitados */}
                  {reserva.numeroInvitados !== undefined && reserva.numeroInvitados > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white text-xs font-medium shrink-0">
                      <Users className="h-3.5 w-3.5 text-gray-500" />
                      <span className="text-gray-700">{reserva.numeroInvitados}</span>
                    </div>
                  )}

                  {/* Badge de días */}
                  <span className="px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 bg-white text-gray-700 ml-auto">
                    {daysLeft === 0 
                      ? "Hoy" 
                      : daysLeft < 0
                        ? `Hace ${Math.abs(daysLeft)}d`
                        : daysLeft === 1 
                          ? "Mañana" 
                          : `${daysLeft}d`
                    }
                  </span>

                  {/* Botón de acciones */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="flex items-center justify-center h-8 w-8 rounded-lg text-gray-600 hover:bg-black/10 transition-colors shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                      <DropdownMenuItem onClick={() => onViewDetails?.(reserva)}>
                        <HugeiconsIcon icon={FullScreenIcon} size={16} />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onAprobar?.(reserva)}>
                        <Check className="h-4 w-4 text-emerald-600" />
                        Aprobar
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onRechazar?.(reserva)} variant="destructive">
                        <X className="h-4 w-4" />
                        Rechazar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
