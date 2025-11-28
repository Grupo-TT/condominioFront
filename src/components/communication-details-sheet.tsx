import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { HugeiconsIcon } from '@hugeicons/react'
import { MailOpenIcon } from '@hugeicons/core-free-icons'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface Comunicado {
  id: string
  asunto: string
  mensaje: string
  fechaEnvio: string
  destinatarios: number
  estado: 'enviado' | 'pendiente' | 'error'
}

interface PropietarioSeleccionable {
  id: string
  nombre: string
  email: string
  numeroCasa: string
  tipo: 'propietario' | 'arrendatario'
}

interface CommunicationDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedComunicado: Comunicado | null
  propietariosDisponibles: PropietarioSeleccionable[]
}

// Función para obtener las iniciales del nombre
function getInitials(nombre: string) {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function CommunicationDetailsSheet({
  isOpen,
  onOpenChange,
  selectedComunicado,
  propietariosDisponibles,
}: CommunicationDetailsSheetProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 !rounded-lg !top-2 !bottom-2 !right-2 !h-[calc(100vh-1rem)] overflow-hidden"
        style={{ width: '600px', maxWidth: 'none' }}
      >
        {/* Header con icono */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
              <HugeiconsIcon icon={MailOpenIcon} size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                Detalles del Comunicado
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                Información completa del comunicado enviado.
              </SheetDescription>
            </div>
          </div>
        </div>

        {selectedComunicado && (
          <ScrollArea className="flex-1">
            <div className="px-6 py-6 space-y-6">
              {/* Asunto */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Asunto</label>
                <p className="text-base font-medium text-gray-900">{selectedComunicado.asunto}</p>
              </div>

              {/* Mensaje */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</label>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedComunicado.mensaje}</p>
                </div>
              </div>

              {/* Destinatarios con avatares */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatarios</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button type="button" className="mt-1 flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
                      <div className="flex items-center -space-x-2">
                        {propietariosDisponibles.slice(0, 4).map((propietario, index) => (
                          <Avatar
                            key={propietario.id}
                            className="h-8 w-8 rounded-full"
                            style={{ zIndex: 4 - index }}
                          >
                            <AvatarFallback className="h-8 w-8 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 flex items-center justify-center">
                              {getInitials(propietario.nombre)}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {selectedComunicado.destinatarios > 4 && (
                        <span className="text-sm font-medium text-gray-600">
                          +{selectedComunicado.destinatarios - 4} personas
                        </span>
                      )}
                      {selectedComunicado.destinatarios <= 4 && (
                        <span className="text-sm font-medium text-gray-600">
                          {selectedComunicado.destinatarios} {selectedComunicado.destinatarios === 1 ? 'persona' : 'personas'}
                        </span>
                      )}
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96 p-0" align="start" side="bottom">
                    <div className="px-4 pt-4 pb-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">Destinatarios ({selectedComunicado.destinatarios})</p>
                    </div>
                    <div
                      className="max-h-72 overflow-y-auto py-2 px-2 space-y-1"
                      onWheelCapture={(event) => event.stopPropagation()}
                    >
                      {propietariosDisponibles.slice(0, selectedComunicado.destinatarios).map((propietario) => (
                        <div
                          key={propietario.id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="rounded-xl text-[10px] font-medium">
                              {getInitials(propietario.nombre)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{propietario.nombre}</p>
                            <p className="text-xs text-gray-500 truncate">Casa {propietario.numeroCasa} · {propietario.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Fecha de envío */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de envío</label>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedComunicado.fechaEnvio).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(selectedComunicado.fechaEnvio).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</label>
                <div>
                  <Badge
                    variant={selectedComunicado.estado === 'enviado' ? 'success' : selectedComunicado.estado === 'pendiente' ? 'warning' : 'destructive'}
                    appearance="outline"
                    size="md"
                  >
                    {selectedComunicado.estado === 'enviado' ? 'Enviado' : selectedComunicado.estado === 'pendiente' ? 'Pendiente' : 'Error'}
                  </Badge>
                </div>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}
