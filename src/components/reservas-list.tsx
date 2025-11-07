'use client'

import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { Calendar, Users, MapPin, Package, Home, MoreVertical, Pencil, Trash2, CheckCircle, XCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { EditEventDialog } from '@/calendar/components/dialogs/edit-event-dialog'
import type { IEventExtended } from '@/types/reservas-calendar.types'

interface ReservasListProps {
  reservas: IEventExtended[]
}

// Los tipos y constantes de estado se manejan directamente en el componente

export function ReservasList({ reservas }: ReservasListProps) {
  const [activeTab, setActiveTab] = useState('pendiente')

  // Filtrar y ordenar reservas por estado
  const reservasFiltradas = useMemo(() => {
    const filtered = reservas.filter(r => r.estado === activeTab)

    // Ordenar por fecha
    return filtered.sort((a, b) => {
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    })
  }, [reservas, activeTab])

  // Contar por estado
  const counts = useMemo(() => {
    return {
      pendientes: reservas.filter(r => r.estado === 'pendiente').length,
      aprobadas: reservas.filter(r => r.estado === 'aprobada').length,
      rechazadas: reservas.filter(r => r.estado === 'rechazada').length,
    }
  }, [reservas])

  // const extractEspacioName = (title: string): string => {
  //   return title.replace('Reserva - ', '')
  // }

  // Colores y estilos según tipo de recurso (igual que en la vista de recursos)
  const getStylesByTipo = (tipo: 'Zona' | 'Objeto' | undefined) => {
    if (tipo === 'Zona') {
      return {
        iconBgColor: '#A3917020', // Tono amarillo/dorado con transparencia
        iconColor: '#A39170',     // Tono amarillo/dorado
        Icon: MapPin,
      }
    } else if (tipo === 'Objeto') {
      return {
        iconBgColor: '#595D7520', // Tono gris/azul con transparencia
        iconColor: '#595D75',     // Tono gris/azul
        Icon: Package,
      }
    }
    // Default
    return {
      iconBgColor: '#E5E7EB',
      iconColor: '#6B7280',
      Icon: Calendar,
    }
  }

  return (
    <div className="flex h-full flex-col">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="pendiente" className="relative">
            Pendientes
            <Badge variant="secondary" className="ml-2 h-5 min-w-5 px-1 text-xs">
              {counts.pendientes}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="aprobada" className="relative">
            Aprobadas
          </TabsTrigger>
          <TabsTrigger value="rechazada" className="relative">
            Rechazadas
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-280px)] pr-2">
            {reservasFiltradas.map((reserva) => {
              // const espacioNombre = extractEspacioName(reserva.title)
              const espacioNombre = reserva.title
              const startDate = parseISO(reserva.startDate)
              const endDate = parseISO(reserva.endDate)
              const styles = getStylesByTipo(reserva.tipoRecurso)
              const RecursoIcon = styles.Icon
              // Las reservas siempre tienen horario específico

              return (
                <div
                  key={reserva.id}
                  className={`p-4 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-all duration-200 relative ${
                    reserva.estado === 'rechazada' ? 'opacity-60' : ''
                  } ${reserva.estado === 'aprobada' ? 'bg-gray-50' : ''}`}
                >
                  {/* Badge de estado en esquina superior derecha */}
                  <div className="absolute top-3 right-3">
                    {reserva.estado === 'pendiente' && (
                      <Badge variant="outline" className="border-yellow-600 text-yellow-700 hover:bg-yellow-50 font-medium text-xs px-2.5 py-1 rounded-full">
                        Pendiente
                      </Badge>
                    )}
                    {reserva.estado === 'aprobada' && (
                      <Badge variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 font-medium text-xs px-2.5 py-1 rounded-full">
                        Aprobada
                      </Badge>
                    )}
                    {reserva.estado === 'rechazada' && (
                      <Badge variant="outline" className="border-red-600 text-red-700 hover:bg-red-50 font-medium text-xs px-2.5 py-1 rounded-full">
                        Rechazada
                      </Badge>
                    )}
                  </div>

                  {/* Contenido principal */}
                  <div className="mb-4 pr-24">
                    {/* Nombre del recurso con icono */}
                    <div className="flex items-start gap-3 mb-2">
                      <div 
                        className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: styles.iconBgColor }}
                      >
                        <RecursoIcon className="w-5 h-5" style={{ color: styles.iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className={`font-semibold text-base mb-0.5 ${
                          reserva.estado === 'rechazada' ? 'text-gray-500' : 'text-gray-900'
                        }`}>
                          {espacioNombre}
                        </h3>
                        <p className={`text-xs ${
                          reserva.estado === 'rechazada' ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {reserva.tipoRecurso === 'Zona' ? 'Zona común' : 'Objeto'}
                        </p>
                      </div>
                    </div>

                    {/* Descripción breve o información adicional */}
                    <div className={`flex items-center gap-1.5 text-sm mb-3 min-w-0 ${
                      reserva.estado === 'rechazada' ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <Home className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">Casa {reserva.casaNumero} - {reserva.user.name}</span>
                    </div>

                    {/* Fecha con icono de calendario */}
                    <div className={`flex items-center gap-2 text-sm ${
                      reserva.estado === 'rechazada' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{format(startDate, "MMM d, yyyy", { locale: es })} - {format(startDate, 'HH:mm')} - {format(endDate, 'HH:mm')}</span>
                    </div>
                  </div>

                  {/* Footer: invitados y botones */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    {/* Número de invitados */}
                    <div className={`flex items-center gap-1.5 ${
                      reserva.estado === 'rechazada' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">{reserva.numeroInvitados || 1}</span>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center gap-1.5">
                      {/* Botones de aprobar/rechazar (solo para pendientes) */}
                      {reserva.estado === 'pendiente' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700"
                            onClick={() => {
                              console.log('Aprobar reserva:', reserva.id)
                            }}
                          >
                            <CheckCircle className="w-4 h-4 mr-1.5" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => {
                              console.log('Rechazar reserva:', reserva.id)
                            }}
                          >
                            <XCircle className="w-4 h-4 mr-1.5" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      
                      {/* Menú desplegable de acciones */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            aria-label="acciones" 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <EditEventDialog event={reserva}>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Modificar
                            </DropdownMenuItem>
                          </EditEventDialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem
                                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                onSelect={(e) => e.preventDefault()}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Eliminar
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>¿Eliminar reserva?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta acción no se puede deshacer. La reserva será eliminada permanentemente del sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => {
                                    console.log('Eliminar reserva:', reserva.id)
                                    // Aquí se implementará la lógica para eliminar la reserva
                                  }}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Eliminar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              )
            })}

            {reservasFiltradas.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p>No hay reservas en esta categoría</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

