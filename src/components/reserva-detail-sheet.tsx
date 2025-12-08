'use client'

import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { IEventExtended } from '@/types/reservas-calendar.types'
import { 
  MapPin,
  Package,
  Check,
  X,
  Clock,
  Users,
  Pencil,
  Trash2
} from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home07Icon } from '@hugeicons/core-free-icons'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ReservaDetailModalProps {
  reserva: IEventExtended | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (reserva: IEventExtended) => void
  onDelete?: (reserva: IEventExtended) => void
  onAprobar?: (reserva: IEventExtended) => void
  onRechazar?: (reserva: IEventExtended) => void
}

// Esquemas de color por tipo - mismos que las tarjetas
const colorSchemes = {
  zona: {
    cardBg: 'bg-[#feeecd]',
    iconCircle: 'bg-[#efe1c7]',
    iconBox: 'bg-[#fef9f0]',
    iconColor: 'text-gray-700',
  },
  objeto: {
    cardBg: 'bg-violet-100',
    iconCircle: 'bg-violet-200/80',
    iconBox: 'bg-violet-50',
    iconColor: 'text-gray-700',
  },
}

export function ReservaDetailSheet({ 
  reserva, 
  open, 
  onOpenChange,
  onEdit,
  onDelete,
  onAprobar,
  onRechazar
}: ReservaDetailModalProps) {
  if (!reserva) return null

  const tipoRecurso = reserva.tipoRecurso?.toLowerCase() === 'zona' ? 'zona' : 'objeto'
  const colors = colorSchemes[tipoRecurso]
  const estado = reserva.estado || 'pendiente'
  const isPendiente = estado === 'pendiente'
  const RecursoIcon = tipoRecurso === 'zona' ? MapPin : Package

  // Formatear fecha como en la imagen: "Wed, May 19 • 7:30pm - 8:00pm"
  const fechaFormateada = format(new Date(reserva.startDate), "EEE, d MMM", { locale: es })
  const horaInicio = format(new Date(reserva.startDate), 'h:mma', { locale: es }).toLowerCase()
  const horaFin = format(new Date(reserva.endDate), 'h:mma', { locale: es }).toLowerCase()

  const handleEdit = () => {
    onEdit?.(reserva)
    onOpenChange(false)
  }

  const handleDelete = () => {
    onDelete?.(reserva)
    onOpenChange(false)
  }

  const handleAprobar = () => {
    onAprobar?.(reserva)
    onOpenChange(false)
  }

  const handleRechazar = () => {
    onRechazar?.(reserva)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0 overflow-hidden rounded-2xl" showCloseButton={false}>
        {/* Header - Título a la izquierda, tres iconos a la derecha */}
        <DialogHeader className="px-6 pt-4 pb-4 flex-row items-center justify-between space-y-0 border-b border-gray-100">
          <DialogTitle className="text-lg font-bold text-gray-900">
            Detalles de reserva
          </DialogTitle>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>

        {/* Contenido con padding generoso */}
        <div className="px-6 pt-0 pb-6 space-y-4">
          {/* Card principal del evento - mismo color que las tarjetas */}
          <div className={cn(
            "p-3 rounded-2xl",
            colors.cardBg
          )}>
            <div className="flex items-center gap-3">
              {/* Icono del recurso con fondo blanco */}
              <div className="flex items-center justify-center w-14 h-14 rounded-lg shrink-0 bg-white">
                <RecursoIcon className={cn("h-7 w-7", colors.iconColor)} />
              </div>
              
              <div className="flex-1 min-w-0">
                {/* Título grande y negrita */}
                <h3 className="font-bold text-gray-900 text-xl mb-1">
                  {reserva.title}
                </h3>
                {/* Fecha y hora en formato compacto */}
                <p className="text-sm text-gray-700">
                  {fechaFormateada} • {horaInicio} - {horaFin}
                </p>
              </div>
            </div>
          </div>

          {/* Propietario y Casa juntos */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-gray-100 shrink-0">
              <HugeiconsIcon icon={Home07Icon} size={20} className="text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-700 leading-relaxed">
                <span className="font-medium">Solicitado por:</span> {reserva.user?.name || 'Propietario desconocido'}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed mt-0.5">
                Casa No.{reserva.casaNumero}
              </p>
            </div>
          </div>

          {/* Invitados y Estado en la misma fila */}
          <div className="flex items-center gap-6">
            {/* Invitados */}
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 shrink-0">
                <Users className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Invitados:</span> {reserva.numeroInvitados ?? 1} personas
                </p>
              </div>
            </div>

            {/* Estado */}
            <div className="flex items-center gap-2 flex-1">
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-100 shrink-0">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 leading-relaxed">
                  <span className="font-medium">Estado:</span>{' '}
                  <span className={cn(
                    estado === 'aprobada' && 'text-emerald-600',
                    estado === 'pendiente' && 'text-amber-600',
                    estado === 'rechazada' && 'text-red-600'
                  )}>
                    {estado === 'aprobada' ? 'Confirmada' : estado === 'pendiente' ? 'Pendiente' : 'Rechazada'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer con acciones si es pendiente */}
        {isPendiente && (
          <div className="shrink-0 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1 h-11 border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                onClick={handleRechazar}
              >
                <X className="h-4 w-4 mr-2" />
                Rechazar
              </Button>
              <Button
                className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handleAprobar}
              >
                <Check className="h-4 w-4 mr-2" />
                Aprobar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
