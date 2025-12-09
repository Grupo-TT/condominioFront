import { useRef, useState } from 'react'
import { Search, Mail, X, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { HugeiconsIcon } from '@hugeicons/react'
import { MailSearch02Icon } from '@hugeicons/core-free-icons'
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

interface ComunicadoUI {
  id: string
  asunto: string
  mensaje: string
  fechaEnvio: string
  destinatarios: string
  estado: 'enviado' | 'pendiente' | 'error'
}

interface CommunicationHistorySheetProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  comunicados: ComunicadoUI[]
  searchTerm: string
  onSearchChange: (term: string) => void
  onSelectComunicado: (comunicado: ComunicadoUI) => void
  onOpenDetails: () => void
  onDelete: (id: string) => Promise<boolean>
  deletingId: string | null
  loading?: boolean
}

export function CommunicationHistorySheet({
  isOpen,
  onOpenChange,
  comunicados,
  searchTerm,
  onSearchChange,
  onSelectComunicado,
  onOpenDetails,
  onDelete,
  deletingId,
  loading = false,
}: CommunicationHistorySheetProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    await onDelete(id)
  }

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
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Loader2 className="w-8 h-8 text-gray-400 mb-4 animate-spin" />
                  <p className="text-sm text-gray-500">Cargando comunicados...</p>
                </div>
              ) : filteredComunicados.length === 0 ? (
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
                filteredComunicados.map((comunicado) => {
                  const isDeleting = deletingId === comunicado.id
                  return (
                    <div
                      key={comunicado.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer relative group"
                      onClick={() => {
                        if (openDialogId) return // Prevent click when dialog is open
                        onSelectComunicado(comunicado)
                        onOpenDetails()
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 border border-gray-200">
                          <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0 pr-10">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900 truncate">{comunicado.asunto}</h4>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{comunicado.mensaje.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>
                              {new Date(comunicado.fechaEnvio + 'Z').toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </span>
                            <span>•</span>
                            <span>{comunicado.destinatarios}</span>
                          </div>
                        </div>
                        {/* Delete button */}
                        <AlertDialog open={openDialogId === comunicado.id} onOpenChange={(open) => setOpenDialogId(open ? comunicado.id : null)}>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500 hover:bg-red-50"
                              onClick={(e) => e.stopPropagation()}
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Eliminar comunicado?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. El comunicado &ldquo;{comunicado.asunto}&rdquo; será eliminado permanentemente.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={(e) => handleDelete(e, comunicado.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Eliminar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
