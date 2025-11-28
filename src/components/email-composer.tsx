import React, { useRef, FormEvent, ChangeEvent } from 'react'
import { Mail, Send, Paperclip, X, FileText, Image as ImageIcon, File } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon } from '@hugeicons/core-free-icons'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useTiptapEditor, TiptapContent, TiptapToolbar } from '@/components/ui/shadcn-io/minimal-tiptap'

interface PropietarioSeleccionable {
  id: string
  nombre: string
  email: string
  numeroCasa: string
  tipo: 'propietario' | 'arrendatario'
}

interface ArchivoAdjunto {
  id: string
  nombre: string
  tamaño: number
  tipo: string
  file: File
}

interface EmailComposerProps {
  selectedPropietarios: PropietarioSeleccionable[]
  formAsunto: string
  formMensaje: string
  archivosAdjuntos: ArchivoAdjunto[]
  errors: { asunto?: string; contenido?: string; destinatarios?: string }
  loading: boolean
  onAsuntoChange: (asunto: string) => void
  onMensajeChange: (mensaje: string) => void
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  onRemoveArchivo: (id: string) => void
  onRemovePropietario: (id: string) => void
  onLimpiarFormulario: () => void
  onSubmit: (e: FormEvent) => void
  onClearError?: (errorKey: string) => void
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

// Función para obtener el icono del archivo según su tipo
function getFileIcon(tipo: string) {
  if (tipo.startsWith('image/')) {
    return <ImageIcon className="w-5 h-5" />
  }
  if (tipo === 'application/pdf') {
    return <FileText className="w-5 h-5" />
  }
  return <File className="w-5 h-5" />
}

// Función para obtener el color de fondo del icono según el tipo
function getFileIconBg(tipo: string) {
  if (tipo.startsWith('image/')) {
    return 'bg-purple-100 text-purple-600'
  }
  if (tipo === 'application/pdf') {
    return 'bg-red-100 text-red-600'
  }
  return 'bg-blue-100 text-blue-600'
}

// Función para formatear el tamaño del archivo
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' kB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export function EmailComposer({
  selectedPropietarios,
  formAsunto,
  formMensaje,
  archivosAdjuntos,
  errors,
  loading,
  onAsuntoChange,
  onMensajeChange,
  onFileChange,
  onRemoveArchivo,
  onRemovePropietario,
  onLimpiarFormulario,
  onSubmit,
  onClearError,
}: EmailComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Limpiar error de contenido cuando se adjuntan archivos
  React.useEffect(() => {
    if (archivosAdjuntos.length > 0 && onClearError && errors.contenido) {
      onClearError('contenido')
    }
  }, [archivosAdjuntos.length, onClearError, errors.contenido])

  // Editor Tiptap
  const tiptapEditor = useTiptapEditor({
    content: formMensaje,
    onChange: (value) => {
      onMensajeChange(value)
      if (value.trim().length > 0 && onClearError && errors.contenido) {
        onClearError('contenido')
      }
    },
    placeholder: 'Descripción del comunicado (opcional)...',
  })

  // Resetear editor Tiptap cuando se limpia el formulario
  React.useEffect(() => {
    if (tiptapEditor && formMensaje === '') {
      tiptapEditor.commands.setContent('')
    }
  }, [tiptapEditor, formMensaje])

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <form onSubmit={onSubmit} className="flex flex-col h-full">

        {/* Header del formulario */}
        <div className="px-6 pt-5 pb-2 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-gray-900">Nuevo comunicado</h3>
              <p className="text-sm text-gray-400">Redacta tu mensaje</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-gray-400 hover:text-red-500 transition-colors rounded-xl"
            onClick={onLimpiarFormulario}
            title="Limpiar formulario"
          >
            <HugeiconsIcon icon={Delete02Icon} size={18} />
          </Button>
        </div>

        {/* Contenido del formulario */}
        <div className="flex-1 flex flex-col px-4 pt-2 pb-4 gap-3 overflow-hidden min-h-0">
          {/* Campo Para */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 shrink-0 font-medium">Para</span>
              <div className="flex-1 min-w-0 overflow-hidden">
                {selectedPropietarios.length === 0 ? (
                  <p className="text-sm text-gray-400">Selecciona destinatarios de la lista</p>
                ) : (
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                      {selectedPropietarios.slice(0, 3).map((propietario) => (
                        <div
                          key={propietario.id}
                          className="inline-flex items-center gap-1.5 pl-2.5 pr-2.5 py-1.5 bg-white rounded-full text-sm group hover:bg-gray-100 transition-colors border border-gray-200 shrink-0"
                        >
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="rounded-lg text-[9px] font-medium flex items-center justify-center">
                              {getInitials(propietario.nombre)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-700 truncate max-w-[100px] text-xs font-medium">{propietario.nombre}</span>
                          <button
                            type="button"
                            onClick={() => onRemovePropietario(propietario.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                    {selectedPropietarios.length > 3 && (
                      <Popover>
                        <PopoverTrigger asChild>
                          <button
                            type="button"
                            className="inline-flex items-center justify-center h-7 px-3 bg-white rounded-full text-xs font-medium text-gray-600 border border-gray-200 hover:bg-gray-100 transition-colors shrink-0"
                          >
                            +{selectedPropietarios.length - 3}
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-96 p-4" align="center" side="bottom">
                          <div className="space-y-3">
                            <p className="text-sm font-semibold text-gray-700">Todos los destinatarios ({selectedPropietarios.length})</p>
                            <div className="max-h-72 overflow-y-auto space-y-2">
                              {selectedPropietarios.map((propietario) => (
                                <div
                                  key={propietario.id}
                                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                                >
                                  <Avatar className="h-9 w-9">
                                    <AvatarFallback className="rounded-xl text-xs font-medium">
                                      {getInitials(propietario.nombre)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{propietario.nombre}</p>
                                    <p className="text-xs text-gray-500 truncate">Casa {propietario.numeroCasa}</p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => onRemovePropietario(propietario.id)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1.5 opacity-0 group-hover:opacity-100"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Campo Asunto */}
          <div className="bg-gray-50 rounded-xl px-4 py-3 shrink-0">
            <input
              type="text"
              value={formAsunto}
              onChange={(e) => {
                onAsuntoChange(e.target.value)
                if (e.target.value.trim().length > 0 && onClearError && errors.asunto) {
                  onClearError('asunto')
                }
              }}
              placeholder="Asunto del comunicado..."
              className={cn(
                "w-full text-sm font-medium text-gray-900 placeholder:text-gray-400 bg-transparent border-0 outline-none focus:ring-0 p-0 selection:bg-black selection:text-white",
                errors.asunto && "text-red-600 placeholder:text-red-300"
              )}
              maxLength={200}
            />
            {errors.asunto && (
              <p className="text-xs text-red-500 mt-1">{errors.asunto}</p>
            )}
          </div>

          {/* Campo Mensaje */}
          <div className="flex-1 flex flex-col bg-gray-50 rounded-xl overflow-hidden min-h-0">
            <div className="flex-1 px-4 py-3 min-h-0 overflow-hidden">
              <TiptapContent
                editor={tiptapEditor}
                placeholder="Descripción del comunicado (opcional)..."
                className="h-full"
              />
            </div>

            {/* Archivos adjuntos */}
            {archivosAdjuntos.length > 0 && (
              <div className="px-4 pb-4 border-t border-gray-200/50 pt-3">
                <p className="text-xs text-gray-400 mb-2 font-medium uppercase tracking-wider">{archivosAdjuntos.length} archivos adjuntos</p>
                <div className="flex flex-wrap gap-2">
                  {archivosAdjuntos.map((archivo) => (
                    <div
                      key={archivo.id}
                      className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-200 min-w-[180px] group hover:border-gray-300 transition-all relative"
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", getFileIconBg(archivo.tipo))}>
                        {getFileIcon(archivo.tipo)}
                      </div>
                      <div className="flex-1 min-w-0 pr-5">
                        <p className="text-xs font-medium text-gray-900 truncate">{archivo.nombre}</p>
                        <p className="text-[10px] text-gray-400">{formatFileSize(archivo.tamaño)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveArchivo(archivo.id)}
                        className="absolute top-1.5 right-1.5 p-0.5 text-gray-300 hover:text-red-500 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mensaje de error del contenido */}
          {errors.contenido && (
            <p className="text-xs text-red-500 mt-1 px-4">{errors.contenido}</p>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {/* Input oculto para archivos */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={onFileChange}
              className="hidden"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif"
            />

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar archivo"
            >
              <Paperclip className="w-5 h-5" />
            </Button>

            <div className="h-5 w-px bg-gray-300 mx-1" />

            {/* Controles del editor Tiptap */}
            <TiptapToolbar editor={tiptapEditor} />
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="submit"
              className="gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-6 h-10 shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar
                  <Send className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
