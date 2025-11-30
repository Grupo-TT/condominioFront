import { useRef } from 'react'
import { Search, Mail, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HugeiconsIcon } from '@hugeicons/react'
import { MailSearch02Icon } from '@hugeicons/core-free-icons'

interface Comunicado {
  id: string
  asunto: string
  mensaje: string
  fechaEnvio: string
  destinatarios: number
  estado: 'enviado' | 'pendiente' | 'error'
}

interface CommunicationHistorySheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  comunicados: Comunicado[]
  searchTerm: string
  onSearchChange: (term: string) => void
  onSelectComunicado: (comunicado: Comunicado) => void
  onOpenDetails: () => void
}

export function CommunicationHistorySheet({
  isOpen,
  onOpenChange,
  comunicados,
  searchTerm,
  onSearchChange,
  onSelectComunicado,
  onOpenDetails,
}: CommunicationHistorySheetProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleClearSearch = () => {
    onSearchChange('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }

  const filteredComunicados = comunicados.filter((c) => {
    const term = searchTerm.toLowerCase()
    return (
      c.asunto.toLowerCase().includes(term) ||
      c.mensaje.toLowerCase().includes(term)
    )
  })

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
              <HugeiconsIcon icon={MailSearch02Icon} size={24} className="text-blue-600" />
            </div>
            <div className="flex-1">
              <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                Comunicados Enviados
              </SheetTitle>
              <SheetDescription className="text-sm text-gray-500">
                Historial de todos los comunicados enviados.
              </SheetDescription>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Barra de búsqueda */}
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                placeholder="Buscar comunicados..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-11 pr-10 h-11 bg-gray-50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-200 placeholder:text-gray-400"
                ref={searchInputRef}
              />
              {searchTerm !== '' && (
                <Button
                  onClick={handleClearSearch}
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-200 rounded-full"
                >
                  <X size={16} className="text-gray-500" />
                </Button>
              )}
            </div>
          </div>

          {/* Lista de comunicados */}
          <ScrollArea className="flex-1">
            <div className="px-6 py-4 space-y-3">
              {filteredComunicados.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
                    <Mail className="w-7 h-7 text-gray-400" />
                  </div>
                  <p className="text-base font-semibold text-gray-700">
                    {searchTerm ? 'No se encontraron resultados' : 'No hay comunicados enviados'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {searchTerm
                      ? `No hay comunicados que coincidan con "${searchTerm}"`
                      : 'Aún no has enviado ningún comunicado.'}
                  </p>
                </div>
              ) : (
                filteredComunicados.map((comunicado) => (
                  <div
                    key={comunicado.id}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {
                      onSelectComunicado(comunicado)
                      onOpenDetails()
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                        <Mail className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h4 className="font-medium text-gray-900 truncate">{comunicado.asunto}</h4>
                          <Badge
                            variant={comunicado.estado === 'enviado' ? 'success' : comunicado.estado === 'pendiente' ? 'warning' : 'destructive'}
                            appearance="outline"
                            className="shrink-0"
                          >
                            {comunicado.estado === 'enviado' ? 'Enviado' : comunicado.estado === 'pendiente' ? 'Pendiente' : 'Error'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{comunicado.mensaje}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>
                            {new Date(comunicado.fechaEnvio).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>•</span>
                          <span>{comunicado.destinatarios} destinatarios</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
