'use client'

import { useState, useEffect, useMemo } from 'react'
import { Separator } from '@/components/ui/separator'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Package, User, Minus, Plus, Calendar as CalendarIcon, Clock } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { HoraCombobox } from '@/components/hora-combobox'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import type { IEventExtended } from '@/types/reservas-calendar.types'
import type { RecursoUI } from '@/services/recurso.adapter'
import { RECURSOS_MOCK } from '@/data/recursos-mock'

interface EditReservaSheetProps {
  reserva: IEventExtended | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (reserva: IEventExtended, data: {
    fecha: Date
    horaInicial: string
    horaFinal: string
    numeroInvitados: number
  }) => Promise<void> | void
  todasLasReservas?: IEventExtended[]
}

export function EditReservaSheet({
  reserva,
  open,
  onOpenChange,
  onSave,
  todasLasReservas = []
}: EditReservaSheetProps) {
  // Estados del formulario
  const [selectedRecurso, setSelectedRecurso] = useState<RecursoUI | null>(null)
  const [editDate, setEditDate] = useState<Date | undefined>(undefined)
  const [editHoraInicial, setEditHoraInicial] = useState<string>('')
  const [editHoraFinal, setEditHoraFinal] = useState<string>('')
  const [editNumeroInvitados, setEditNumeroInvitados] = useState<number>(1)

  // Generar opciones de hora en formato 12 horas (7:00 AM a 11:00 PM)
  const horas = useMemo(() => {
    const horasArray: Array<{ value: string; label: string; hora24: number }> = []
    
    // Generar horas de 7:00 AM (07:00) a 11:59 PM (23:59)
    for (let i = 7; i < 24; i++) {
      const hora12 = i === 0 ? 12 : i > 12 ? i - 12 : i
      const ampm = i >= 12 ? 'PM' : 'AM'
      const hora24 = i
      const value = `${i.toString().padStart(2, '0')}:00`
      const label = `${hora12}:00 ${ampm}`
      
      horasArray.push({ value, label, hora24 })
    }
    
    return horasArray
  }, [])

  // Obtener el recurso desde la reserva
  useEffect(() => {
    if (reserva) {
      // Buscar el recurso en RECURSOS_MOCK por nombre
      const recurso = RECURSOS_MOCK.find(r => 
        r.nombre.toLowerCase() === reserva.title.toLowerCase()
      )
      
      if (recurso) {
        setSelectedRecurso(recurso)
      } else {
        // Si no se encuentra, crear un recurso temporal desde los datos de la reserva
        const tipoRecurso = reserva.tipoRecurso?.toLowerCase() === 'zona' ? 'zona' : 'objeto'
        setSelectedRecurso({
          id: reserva.id.toString(),
          nombre: reserva.title,
          descripcion: reserva.description || '',
          tipo: tipoRecurso as 'zona' | 'objeto',
          tipoRecursoComun: tipoRecurso === 'zona' ? 'ZONA' : 'OBJETO',
          disponibilidadRecurso: 'DISPONIBLE',
          estado: 'Disponible',
          habilitado: true,
        })
      }

      // Inicializar los valores del formulario desde la reserva
      const fechaInicio = new Date(reserva.startDate)
      setEditDate(fechaInicio)
      
      // Extraer hora de startDate (formato HH:mm)
      const horaInicio = `${fechaInicio.getHours().toString().padStart(2, '0')}:00`
      setEditHoraInicial(horaInicio)
      
      // Extraer hora de endDate (formato HH:mm)
      const fechaFin = new Date(reserva.endDate)
      const horaFin = `${fechaFin.getHours().toString().padStart(2, '0')}:00`
      setEditHoraFinal(horaFin)
      
      setEditNumeroInvitados(reserva.numeroInvitados || 1)
    }
  }, [reserva])

  // Limpiar estados al cerrar
  useEffect(() => {
    if (!open) {
      setSelectedRecurso(null)
      setEditDate(undefined)
      setEditHoraInicial('')
      setEditHoraFinal('')
      setEditNumeroInvitados(1)
    }
  }, [open])

  // Obtener horas ocupadas para el recurso y fecha seleccionada (excluyendo la reserva que se está editando)
  const horasOcupadasEdit = useMemo(() => {
    if (!selectedRecurso || !editDate) {
      return new Set<string>()
    }
    
    const ocupadas = new Set<string>()
    
    // Filtrar reservas que coincidan con el recurso y la fecha (excluyendo la reserva que se está editando)
    const reservasDelDia = todasLasReservas.filter(r => {
      // Excluir la reserva que se está editando
      if (reserva && r.id === reserva.id) {
        return false
      }
      
      // Comparar nombre del recurso
      if (r.title.toLowerCase() !== selectedRecurso.nombre.toLowerCase()) {
        return false
      }
      
      // Comparar fecha (solo día, mes y año)
      const fechaReserva = new Date(r.startDate)
      fechaReserva.setHours(0, 0, 0, 0)
      const fechaSeleccionada = new Date(editDate)
      fechaSeleccionada.setHours(0, 0, 0, 0)
      
      // Comparar año, mes y día por separado para evitar problemas de zona horaria
      const mismoDia = fechaReserva.getDate() === fechaSeleccionada.getDate()
      const mismoMes = fechaReserva.getMonth() === fechaSeleccionada.getMonth()
      const mismoAnio = fechaReserva.getFullYear() === fechaSeleccionada.getFullYear()
      
      const fechaCoincide = mismoDia && mismoMes && mismoAnio
      
      if (!fechaCoincide) {
        return false
      }
      
      // Solo considerar reservas aprobadas o pendientes (no rechazadas)
      return r.estado === 'aprobada' || r.estado === 'pendiente'
    })
    
    // Marcar todas las horas ocupadas por las reservas
    reservasDelDia.forEach(r => {
      const fechaInicio = new Date(r.startDate)
      const fechaFin = new Date(r.endDate)
      const horaInicio = fechaInicio.getHours()
      const horaFin = fechaFin.getHours()
      
      // Marcar todas las horas que están dentro del rango de la reserva
      for (let hora = horaInicio; hora < horaFin; hora++) {
        if (hora >= 7 && hora < 24) {
          const horaValue = `${hora.toString().padStart(2, '0')}:00`
          ocupadas.add(horaValue)
        }
      }
    })
    
    return ocupadas
  }, [selectedRecurso, editDate, todasLasReservas, reserva])

  // Filtrar horas disponibles para hora final en edición
  const horasFinalDisponiblesEdit = useMemo(() => {
    if (!editHoraInicial) {
      // Si no hay hora inicial seleccionada, mostrar todas las horas no ocupadas
      return horas.filter(h => !horasOcupadasEdit.has(h.value))
    }
    
    const horaInicialObj = horas.find(h => h.value === editHoraInicial)
    if (!horaInicialObj) return horas.filter(h => !horasOcupadasEdit.has(h.value))
    
    // Filtrar horas posteriores a la inicial y que no estén ocupadas
    return horas.filter(h => 
      h.hora24 > horaInicialObj.hora24 && !horasOcupadasEdit.has(h.value)
    )
  }, [editHoraInicial, horas, horasOcupadasEdit])

  // Resetear horas si se vuelven inválidas cuando cambia la fecha o el recurso (edición)
  useEffect(() => {
    if (editHoraInicial && horasOcupadasEdit.has(editHoraInicial)) {
      setEditHoraInicial('')
      setEditHoraFinal('')
    }
  }, [editDate, selectedRecurso, horasOcupadasEdit, editHoraInicial])

  // Resetear hora final si es inválida cuando cambia la hora inicial (edición)
  useEffect(() => {
    if (editHoraInicial && editHoraFinal) {
      const horaInicialObj = horas.find(h => h.value === editHoraInicial)
      const horaFinalObj = horas.find(h => h.value === editHoraFinal)
      
      if (horaInicialObj && horaFinalObj && horaFinalObj.hora24 <= horaInicialObj.hora24) {
        setEditHoraFinal('')
      }
      
      // También resetear si la hora final está ocupada
      if (horasOcupadasEdit.has(editHoraFinal)) {
        setEditHoraFinal('')
      }
    }
  }, [editHoraInicial, editHoraFinal, horas, horasOcupadasEdit])

  const handleSave = () => {
    if (!reserva || !editDate || !editHoraInicial || !editHoraFinal) return
    
    onSave(reserva, {
      fecha: editDate,
      horaInicial: editHoraInicial,
      horaFinal: editHoraFinal,
      numeroInvitados: editNumeroInvitados
    })
  }

  if (!reserva || !selectedRecurso) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0"
        style={{ width: '500px', maxWidth: 'none' }}
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <SheetTitle className="text-xl font-semibold">Editar Reserva</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto px-6 pt-0 pb-4">
            {/* Información del recurso */}
            <Card className="border border-gray-200 bg-white p-3 rounded-2xl">
              <div className="flex flex-row gap-4">
                {/* Contenedor izquierdo con círculos concéntricos */}
                <div 
                  className="flex-shrink-0 w-20 flex items-center justify-center relative rounded-xl"
                  style={{
                    background: selectedRecurso.tipo === 'zona'
                      ? `radial-gradient(circle at center, rgba(163, 145, 112, 0.28) 0%, rgba(163, 145, 112, 0.28) 15%, transparent 15%, transparent 18%),
                         radial-gradient(circle at center, rgba(163, 145, 112, 0.22) 0%, rgba(163, 145, 112, 0.22) 25%, transparent 25%, transparent 28%),
                         radial-gradient(circle at center, rgba(163, 145, 112, 0.18) 0%, rgba(163, 145, 112, 0.18) 35%, transparent 35%, transparent 38%),
                         radial-gradient(circle at center, rgba(163, 145, 112, 0.14) 0%, rgba(163, 145, 112, 0.14) 45%, transparent 45%, transparent 48%),
                         radial-gradient(circle at center, rgba(163, 145, 112, 0.09) 0%, rgba(163, 145, 112, 0.09) 55%, transparent 55%, transparent 58%),
                         radial-gradient(circle at center, rgba(163, 145, 112, 0.05) 0%, rgba(163, 145, 112, 0.05) 65%, transparent 65%, transparent 68%),
                         #f3f4f6`
                      : `radial-gradient(circle at center, rgba(89, 93, 117, 0.28) 0%, rgba(89, 93, 117, 0.28) 15%, transparent 15%, transparent 18%),
                         radial-gradient(circle at center, rgba(89, 93, 117, 0.22) 0%, rgba(89, 93, 117, 0.22) 25%, transparent 25%, transparent 28%),
                         radial-gradient(circle at center, rgba(89, 93, 117, 0.18) 0%, rgba(89, 93, 117, 0.18) 35%, transparent 35%, transparent 38%),
                         radial-gradient(circle at center, rgba(89, 93, 117, 0.14) 0%, rgba(89, 93, 117, 0.14) 45%, transparent 45%, transparent 48%),
                         radial-gradient(circle at center, rgba(89, 93, 117, 0.09) 0%, rgba(89, 93, 117, 0.09) 55%, transparent 55%, transparent 58%),
                         radial-gradient(circle at center, rgba(89, 93, 117, 0.05) 0%, rgba(89, 93, 117, 0.05) 65%, transparent 65%, transparent 68%),
                         #f3f4f6`,
                  }}
                >
                  {/* Contenedor del icono */}
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md">
                    {selectedRecurso.tipo === 'zona' ? (
                      <MapPin className="w-6 h-6" style={{ color: '#A39170' }} />
                    ) : (
                      <Package className="w-6 h-6" style={{ color: '#595D75' }} />
                    )}
                  </div>
                </div>
                {/* Contenido */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">{selectedRecurso.nombre}</h3>
                    <span 
                      className="inline-block text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2"
                      style={{ 
                        backgroundColor: selectedRecurso.tipo === 'zona' ? '#F1E8D6' : '#E3E4EA',
                        color: selectedRecurso.tipo === 'zona' ? '#A39170' : '#595D75'
                      }}
                    >
                      {selectedRecurso.tipo === 'zona' ? 'Zona' : 'Objeto'}
                    </span>
                  </div>
                  {/* Información de la reserva */}
                  <div className="space-y-1 mt-1">
                    {editDate && (
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <p className="text-sm text-gray-700 font-medium">
                          {editDate.toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          }).replace(/^\w/, c => c.toUpperCase())}
                        </p>
                      </div>
                    )}
                    {editHoraInicial && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
                        <p className="text-sm text-gray-600">
                          {horas.find(h => h.value === editHoraInicial)?.label || editHoraInicial}
                          {editHoraFinal && ` - ${horas.find(h => h.value === editHoraFinal)?.label || editHoraFinal}`}
                        </p>
                      </div>
                    )}
                    {!editDate && !editHoraInicial && (
                      <p className="text-sm text-gray-400 italic">
                        Selecciona el día y hora para tu reserva
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Separator className="my-3" />

            {/* Calendario */}
            <div className="space-y-2">
              <Calendar
                mode="single"
                selected={editDate}
                onSelect={setEditDate}
                disabled={(date) => {
                  const today = new Date()
                  today.setHours(0, 0, 0, 0)
                  // Calcular la fecha mínima permitida (hoy + 3 días)
                  const minDate = new Date(today)
                  minDate.setDate(today.getDate() + 3)
                  minDate.setHours(0, 0, 0, 0)
                  const checkDate = new Date(date)
                  checkDate.setHours(0, 0, 0, 0)
                  // Deshabilitar fechas pasadas y fechas con menos de 3 días de antelación
                  return checkDate.getTime() < minDate.getTime()
                }}
                className="rounded-lg border w-full"
                classNames={{
                  day_button: cn(
                    'cursor-pointer relative flex items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground transition-200',
                    'group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow]',
                    'group-[[data-selected]:not(.range-middle)]:duration-150',
                    'group-data-disabled:pointer-events-none focus-visible:z-10',
                    'hover:not-in-data-selected:bg-accent group-data-selected:bg-primary',
                    'hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground',
                    'group-data-disabled:text-foreground/30 group-data-disabled:line-through',
                    'group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground',
                    'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                    'size-12 md:size-14'
                  ),
                  day: 'group size-12 md:size-14 px-0 py-px text-sm',
                  weekday: 'size-12 md:size-14 p-0 text-xs font-medium text-muted-foreground/80',
                }}
              />
            </div>

            {/* Horas */}
            <div className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <HoraCombobox
                  horas={horas}
                  value={editHoraInicial}
                  onChange={setEditHoraInicial}
                  placeholder="Selecciona hora"
                  disabled={!editDate}
                  horasOcupadas={horasOcupadasEdit}
                  label="Hora Inicial"
                />

                <HoraCombobox
                  horas={horasFinalDisponiblesEdit}
                  value={editHoraFinal}
                  onChange={setEditHoraFinal}
                  placeholder="Selecciona hora"
                  disabled={!editHoraInicial || !editDate}
                  horasOcupadas={horasOcupadasEdit}
                  label="Hora Final"
                />
              </div>
            </div>

            {/* Número de invitados */}
            <div className="mt-4">
              <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">Invitados</span>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setEditNumeroInvitados(prev => Math.max(1, prev - 1))}
                    disabled={editNumeroInvitados <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                    {editNumeroInvitados}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => setEditNumeroInvitados(prev => prev + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer con botones */}
          <div className="border-t px-6 py-4 bg-gray-50">
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    disabled={!editDate || !editHoraInicial || !editHoraFinal}
                    className="flex-1"
                  >
                    Guardar Cambios
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Cambios de Reserva</AlertDialogTitle>
                    <AlertDialogDescription>
                      Por favor, revisa los detalles actualizados de la reserva antes de confirmar.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  
                  {selectedRecurso && editDate && editHoraInicial && editHoraFinal && (
                    <div className="space-y-4 py-4">
                      {/* Información del Recurso */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                          {selectedRecurso.tipo === 'zona' ? (
                            <MapPin className="w-5 h-5" style={{ color: '#A39170' }} />
                          ) : (
                            <Package className="w-5 h-5" style={{ color: '#595D75' }} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{selectedRecurso.nombre}</p>
                          <p className="text-xs text-gray-500 mt-1">{selectedRecurso.descripcion}</p>
                        </div>
                      </div>

                      {/* Fecha */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <CalendarIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {editDate.toLocaleDateString('es-ES', { 
                              weekday: 'long', 
                              year: 'numeric', 
                              month: 'long', 
                              day: 'numeric' 
                            }).replace(/^\w/, c => c.toUpperCase())}
                          </p>
                        </div>
                      </div>

                      {/* Horas */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {horas.find(h => h.value === editHoraInicial)?.label || editHoraInicial}
                            {' - '}
                            {horas.find(h => h.value === editHoraFinal)?.label || editHoraFinal}
                          </p>
                        </div>
                      </div>

                      {/* Número de Invitados */}
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {editNumeroInvitados} {editNumeroInvitados === 1 ? 'invitado' : 'invitados'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleSave}
                    >
                      Confirmar Cambios
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

