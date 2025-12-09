import React, { useRef, FormEvent, ChangeEvent } from 'react'
import { Mail, Send, X, Paperclip, FileText } from 'lucide-react'
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

interface PersonaSeleccionable {
  id: string
  nombreCompleto: string
  correo: string
  telefono: number
  roles: string[]
  idCasa: number
}

interface EmailComposerProps {
  selectedPropietarios: PersonaSeleccionable[]
  formAsunto: string
  formMensaje: string
  errors: { asunto?: string; contenido?: string; destinatarios?: string }
  loading: boolean
  archivos: File[]
  onAsuntoChange: (asunto: string) => void
  onMensajeChange: (mensaje: string) => void
  onRemovePropietario: (id: string) => void
  onLimpiarFormulario: () => void
  onSubmit: (e: FormEvent) => void
  onClearError?: (errorKey: string) => void
  onArchivosChange: (files: File[]) => void
}

// Helper to get file extension color
function getExtensionColor(extension: string): string {
  const colors: Record<string, string> = {
    pdf: 'text-red-500',
    doc: 'text-blue-600',
    docx: 'text-blue-600',
    xls: 'text-green-600',
    xlsx: 'text-green-600',
    ppt: 'text-orange-500',
    pptx: 'text-orange-500',
    png: 'text-purple-500',
    jpg: 'text-purple-500',
    jpeg: 'text-purple-500',
    gif: 'text-purple-500',
    svg: 'text-purple-500',
    fig: 'text-purple-600',
    zip: 'text-yellow-600',
    rar: 'text-yellow-600',
  }
  return colors[extension.toLowerCase()] || 'text-gray-600'
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

export function EmailComposer({
  selectedPropietarios,
  formAsunto,
  formMensaje,
  errors,
  loading,
  archivos = [],
  onAsuntoChange,
  onMensajeChange,
  onRemovePropietario,
  onLimpiarFormulario,
  onSubmit,
  onClearError,
  onArchivosChange,
}: EmailComposerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAddFiles = (newFiles: FileList | null) => {
    if (!newFiles || newFiles.length === 0) return
    // Only keep one file - replace any existing
    onArchivosChange([newFiles[0]])
  }

  const handleRemoveFile = (index: number) => {
    onArchivosChange(archivos.filter((_, i) => i !== index))
  }
  // Editor Tiptap
  const tiptapEditor = useTiptapEditor({
    content: formMensaje,
    onChange: (value) => {
      onMensajeChange(value)
      if (value.trim().length > 0 && onClearError && errors.contenido) {
        onClearError('contenido')
      }
    },
    placeholder: 'Descripción del comunicado...',
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
                              {getInitials(propietario.nombreCompleto)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-gray-700 truncate max-w-[100px] text-xs font-medium">{propietario.nombreCompleto}</span>
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
                                      {getInitials(propietario.nombreCompleto)}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">{propietario.nombreCompleto}</p>
                                    <p className="text-xs text-gray-500 truncate">Casa {propietario.idCasa}</p>
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
                placeholder="Descripción del comunicado..."
                className="h-full"
              />
            </div>
          </div>

          {/* Mensaje de error del contenido */}
          {errors.contenido && (
            <p className="text-xs text-red-500 mt-1 px-4">{errors.contenido}</p>
          )}

          {/* Archivos adjuntos - Display as cards with horizontal scroll */}
          {archivos.length > 0 && (
            <div className="px-4 pt-2 pb-1">
              <p className="text-xs text-gray-500 mb-1">
                {archivos.length} {archivos.length === 1 ? 'archivo adjunto' : 'archivos adjuntos'}
              </p>
              <div className="flex gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                {archivos.map((archivo, index) => {
                  const extension = archivo.name.split('.').pop() || ''
                  const fileName = archivo.name.split('.').slice(0, -1).join('.') || archivo.name
                  const fileSize = archivo.size < 1024
                    ? `${archivo.size} B`
                    : archivo.size < 1024 * 1024
                      ? `${(archivo.size / 1024).toFixed(0)} kB`
                      : `${(archivo.size / (1024 * 1024)).toFixed(1)} MB`

                  return (
                    <div
                      key={`${archivo.name}-${index}`}
                      className="flex items-center gap-3 bg-gray-100 rounded-xl px-3 py-2.5 shrink-0 min-w-[180px] max-w-[220px]"
                    >
                      {/* Document-style icon */}
                      <div className="relative w-10 h-12 shrink-0">
                        {/* Document background */}
                        <div className="absolute inset-0 bg-white rounded-md shadow-sm border border-gray-200">
                          {/* Folded corner */}
                          <div className="absolute top-0 right-0 w-3 h-3 bg-gray-100 rounded-bl-md" />
                        </div>
                        {/* Extension label */}
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                          <span className={`text-[9px] font-bold uppercase ${getExtensionColor(extension)}`}>
                            {extension.slice(0, 4)}
                          </span>
                        </div>
                      </div>

                      {/* File info */}
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="font-medium text-gray-900 text-sm truncate">
                          {fileName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {fileSize}
                        </span>
                      </div>

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            {/* Controles del editor Tiptap */}
            <TiptapToolbar editor={tiptapEditor} />

            {/* Botón para adjuntar archivo */}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={(e) => {
                handleAddFiles(e.target.files)
                // Reset input so same file can be selected again
                e.target.value = ''
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-gray-700"
              onClick={() => fileInputRef.current?.click()}
              title="Adjuntar archivo"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
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
      </form >
    </div >
  )
}
