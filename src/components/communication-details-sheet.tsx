import { useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { HugeiconsIcon } from '@hugeicons/react'
import { MailOpenIcon } from '@hugeicons/core-free-icons'
import { Loader2 } from 'lucide-react'

interface ComunicadoUI {
  id: string
  asunto: string
  mensaje: string
  fechaEnvio: string
  destinatarios: string
  destinatariosCount?: number
  estado: 'enviado' | 'pendiente' | 'error'
}

interface DestinatarioCorreo {
  nombreCompleto: string
  idCasa: number
  email: string
}

interface CommunicationDetailsSheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedComunicado: ComunicadoUI | null
  destinatarios: DestinatarioCorreo[]
  loadingDestinatarios: boolean
  onFetchDestinatarios: (idCorreo: string) => void
}

function getInitials(nombre: string) {
  if (!nombre) return '??'
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// CSS styles for HTML content
const htmlContentStyles = `
  .html-content ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.5rem 0; }
  .html-content ol { list-style-type: decimal; padding-left: 1.25rem; margin: 0.5rem 0; }
  .html-content li { margin: 0.25rem 0; }
  .html-content p { margin: 0.25rem 0; }
  .html-content strong, .html-content b { font-weight: 600; }
  .html-content em, .html-content i { font-style: italic; }
  .html-content u { text-decoration: underline; }
  .html-content s, .html-content strike, .html-content del { text-decoration: line-through; }
  .html-content a { color: #2563eb; text-decoration: underline; }
`

export function CommunicationDetailsSheet({
  isOpen,
  onOpenChange,
  selectedComunicado,
  destinatarios,
  loadingDestinatarios,
  onFetchDestinatarios,
}: CommunicationDetailsSheetProps) {
  useEffect(() => {
    if (isOpen && selectedComunicado) {
      onFetchDestinatarios(selectedComunicado.id)
    }
  }, [isOpen, selectedComunicado, onFetchDestinatarios])

  const visibleAvatars = destinatarios.slice(0, 4)
  const remainingCount = destinatarios.length - 4

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <style dangerouslySetInnerHTML={{ __html: htmlContentStyles }} />
      <SheetContent
        side="right"
        className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 !rounded-lg !top-2 !bottom-2 !right-2 !h-[calc(100vh-1rem)] overflow-hidden"
        style={{ width: '600px', maxWidth: 'none' }}
      >
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
                  <div
                    className="html-content text-sm text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: selectedComunicado.mensaje }}
                  />
                </div>
              </div>

              {/* Destinatarios */}
              <div className="space-y-3">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Destinatarios</label>

                {loadingDestinatarios ? (
                  <div className="flex items-center gap-2 py-2">
                    <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                    <span className="text-sm text-gray-400">Cargando...</span>
                  </div>
                ) : (
                  <Popover modal={false}>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center gap-3 hover:bg-gray-50 rounded-xl p-2 -m-2 mt-0.5 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center -space-x-2">
                          {visibleAvatars.map((dest, index) => (
                            <Avatar
                              key={index}
                              className="h-9 w-9 rounded-full outline outline-1 outline-gray-200"
                              style={{ zIndex: 4 - index }}
                            >
                              <AvatarFallback className="h-9 w-9 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                                {getInitials(dest.nombreCompleto || dest.email)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {remainingCount > 0 && (
                          <span className="text-sm font-medium text-gray-500">
                            +{remainingCount} personas
                          </span>
                        )}
                        {destinatarios.length <= 4 && destinatarios.length > 0 && (
                          <span className="text-sm font-medium text-gray-500">
                            {destinatarios.length} {destinatarios.length === 1 ? 'persona' : 'personas'}
                          </span>
                        )}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-96 p-0"
                      align="start"
                      side="bottom"
                      onOpenAutoFocus={(e) => e.preventDefault()}
                      onInteractOutside={(e) => e.preventDefault()}
                      sideOffset={8}
                    >
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          Destinatarios ({destinatarios.length})
                        </p>
                      </div>
                      <div
                        className="divide-y divide-gray-100 overflow-y-auto pointer-events-auto"
                        style={{
                          maxHeight: '320px',
                          overscrollBehavior: 'contain',
                          WebkitOverflowScrolling: 'touch'
                        }}
                        onWheel={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                      >
                        {destinatarios.map((dest, index) => (
                          <div key={index} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback className="rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">
                                {getInitials(dest.nombreCompleto || dest.email)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {dest.nombreCompleto || 'Sin nombre'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {dest.idCasa != null ? `Casa ${dest.idCasa} · ` : ''}{dest.email}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              {/* Fecha de envío */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-1">
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de envío</label>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(selectedComunicado.fechaEnvio + 'Z').toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(selectedComunicado.fechaEnvio + 'Z').toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </p>
              </div>
            </div>
          </ScrollArea>
        )}
      </SheetContent>
    </Sheet>
  )
}
