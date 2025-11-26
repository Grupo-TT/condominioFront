'use client'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { IEventExtended } from '@/types/reservas-calendar.types'
import { 
  MapPin,
  Package,
  MoreHorizontal,
  Check,
  X,
  Clock,
  Users,
  Pencil,
  Trash2
} from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FullScreenIcon } from '@hugeicons/core-free-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface ReservaCardProps {
  reserva: IEventExtended
  compact?: boolean
  onEdit?: (reserva: IEventExtended) => void
  onDelete?: (reserva: IEventExtended) => void
  onAprobar?: (reserva: IEventExtended) => void
  onRechazar?: (reserva: IEventExtended) => void
  onViewDetails?: (reserva: IEventExtended) => void
}

// Esquemas de color por tipo
const colorSchemes = {
  zona: {
    card: 'bg-[#feeecd]',
    footer: 'bg-[#efe1c7]',
    iconBox: 'bg-[#fef9f0]',
    badge: 'bg-white',
    text: 'text-gray-800',
  },
  objeto: {
    card: 'bg-violet-100',
    footer: 'bg-violet-200/80',
    iconBox: 'bg-violet-50',
    badge: 'bg-white',
    text: 'text-gray-800',
  },
}

// Configuración de estados - círculo de color con icono blanco
const estadoConfig = {
  aprobada: {
    icon: Check,
    label: 'Confirmada',
    bgColor: 'bg-emerald-700',
  },
  pendiente: {
    icon: Clock,
    label: 'Pendiente',
    bgColor: 'bg-amber-500',
  },
  rechazada: {
    icon: X,
    label: 'Rechazada',
    bgColor: 'bg-red-700',
  },
}

export function ReservaCard({ reserva, compact = false, onEdit, onDelete, onAprobar, onRechazar, onViewDetails }: ReservaCardProps) {
  const tipoRecurso = reserva.tipoRecurso?.toLowerCase() === 'zona' ? 'zona' : 'objeto'
  const colors = colorSchemes[tipoRecurso]
  const estado = reserva.estado || 'pendiente'
  const estadoCfg = estadoConfig[estado]
  const EstadoIcon = estadoCfg.icon
  const RecursoIcon = tipoRecurso === 'zona' ? MapPin : Package
  const isPendiente = estado === 'pendiente'

  const horaInicio = format(new Date(reserva.startDate), 'h:mm a', { locale: es })
  const horaFin = format(new Date(reserva.endDate), 'h:mm a', { locale: es })
  const mesReserva = format(new Date(reserva.startDate), 'MMM', { locale: es })
  const diaReserva = format(new Date(reserva.startDate), 'd', { locale: es })

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit?.(reserva)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete?.(reserva)
  }

  const handleAprobar = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAprobar?.(reserva)
  }

  const handleRechazar = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRechazar?.(reserva)
  }

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    onViewDetails?.(reserva)
  }

  if (compact) {
    return (
      <div 
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer hover:shadow-sm",
          colors.card
        )}
      >
        {/* Número de casa - blanco sin contorno */}
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white text-sm font-bold text-gray-800">
          {reserva.casaNumero || '—'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate">
            Casa {reserva.casaNumero}
          </p>
          <p className="text-xs text-gray-600">
            {horaInicio}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={cn(
        "relative flex flex-col rounded-2xl transition-all cursor-pointer hover:shadow-lg overflow-hidden w-[320px]",
        colors.card
      )}
    >
      {/* Botón de ver detalles - esquina superior derecha */}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className="absolute top-3 right-3 z-10 flex items-center justify-center h-8 w-8 rounded-lg bg-white/80 text-gray-600 hover:bg-white hover:text-gray-900 transition-colors shadow-sm"
            onClick={handleViewDetails}
          >
            <HugeiconsIcon icon={FullScreenIcon} size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ver detalles</p>
        </TooltipContent>
      </Tooltip>

      {/* Header con fecha y hora */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-center gap-3">
          {/* Badge de fecha - mes y día en dos filas */}
          <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-white font-bold text-gray-800">
            <span className="text-[10px] uppercase leading-tight text-gray-500">{mesReserva}</span>
            <span className="text-base leading-tight">{diaReserva}</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-base">
              Casa {reserva.casaNumero}
            </p>
            <p className="text-sm text-gray-600">
              {horaInicio} - {horaFin}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido - Recurso con fondo blanco */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
          {/* Icono con fondo más claro */}
          <div className={cn(
            "flex items-center justify-center w-9 h-9 rounded-lg",
            colors.iconBox
          )}>
            <RecursoIcon className="h-4 w-4 text-gray-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {reserva.title}
            </p>
            <p className="text-xs text-gray-500">
              {reserva.tipoRecurso === 'Zona' ? 'Zona común' : 'Objeto'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer con color más oscuro */}
      <div className={cn(
        "px-4 py-3 flex items-center justify-between",
        colors.footer
      )}>
        {/* Estado y número de invitados juntos */}
        <div className="flex items-center gap-2">
          {/* Estado - círculo de color con icono blanco */}
          <div className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium",
            colors.badge
          )}>
            {/* Círculo de color con icono blanco */}
            <div className={cn(
              "flex items-center justify-center w-4 h-4 rounded-full",
              estadoCfg.bgColor
            )}>
              <EstadoIcon className="h-2.5 w-2.5 text-white" strokeWidth={3} />
            </div>
            <span className="text-gray-700">{estadoCfg.label}</span>
          </div>

          {/* Número de invitados - al lado del estado */}
          {reserva.numeroInvitados !== undefined && reserva.numeroInvitados > 0 && (
            <div className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium",
              colors.badge
            )}>
              <Users className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-gray-700">{reserva.numeroInvitados}</span>
            </div>
          )}
        </div>

        {/* Botón de opciones con dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center justify-center h-7 w-7 rounded-lg text-gray-800 hover:bg-black/10 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {isPendiente && (
              <>
                <DropdownMenuItem onClick={handleAprobar}>
                  <Check className="h-4 w-4 text-emerald-600" />
                  Aprobar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleRechazar} variant="destructive">
                  <X className="h-4 w-4" />
                  Rechazar
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
              Modificar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} variant="destructive">
              <Trash2 className="h-4 w-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
