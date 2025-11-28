'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Mail, Search, X, Send, Paperclip, FileText, Image, File, Users, History, Bold, Italic, Underline, AlignLeft, List, Type, ChevronDown, Check, Trash2 } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Delete02Icon, MailSearch02Icon, MailOpenIcon, Sent02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { propietariosMock } from '@/data/propietarios.mock'
import { comunicadosMock as comunicadosData } from '@/data/comunicados.mock'
import { useTiptapEditor, TiptapContent, TiptapToolbar } from '@/components/ui/shadcn-io/minimal-tiptap'

// Tipo para los comunicados
interface Comunicado {
  id: string
  asunto: string
  mensaje: string
  fechaEnvio: string
  destinatarios: number
  estado: 'enviado' | 'pendiente' | 'error'
}

// Tipo para propietario seleccionable
interface PropietarioSeleccionable {
  id: string
  nombre: string
  email: string
  numeroCasa: string
  tipo: 'propietario' | 'arrendatario'
}

// Tipo para archivos adjuntos
interface ArchivoAdjunto {
  id: string
  nombre: string
  tamaño: number
  tipo: string
  file: File
}

// Función para obtener el icono del archivo según su tipo
function getFileIcon(tipo: string) {
  if (tipo.startsWith('image/')) {
    return <Image className="w-5 h-5" />
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

// Función para obtener la etiqueta del tipo de archivo
function getFileTypeLabel(tipo: string) {
  if (tipo.startsWith('image/')) {
    return tipo.split('/')[1]?.toUpperCase() || 'IMG'
  }
  if (tipo === 'application/pdf') {
    return 'PDF'
  }
  if (tipo.includes('word') || tipo.includes('document')) {
    return 'DOC'
  }
  if (tipo.includes('excel') || tipo.includes('spreadsheet')) {
    return 'XLS'
  }
  return 'FILE'
}

// Función para formatear el tamaño del archivo
function formatFileSize(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' kB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
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

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>(comunicadosData)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchPropietarios, setSearchPropietarios] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Estados del formulario
  const [formAsunto, setFormAsunto] = useState('')
  const [formMensaje, setFormMensaje] = useState('')
  const [selectedPropietarios, setSelectedPropietarios] = useState<PropietarioSeleccionable[]>([])
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<ArchivoAdjunto[]>([])
  const [errors, setErrors] = useState<{ asunto?: string; mensaje?: string; destinatarios?: string }>({})

  // Editor Tiptap
  const tiptapEditor = useTiptapEditor({
    content: formMensaje,
    onChange: (value) => {
      setFormMensaje(value)
      if (value.trim().length > 0) {
        setErrors(prev => ({ ...prev, mensaje: undefined }))
      }
    },
    placeholder: 'Descripción del comunicado...',
  })

  // Usar propietarios mock directamente
  const propietariosDisponibles = useMemo<PropietarioSeleccionable[]>(() => {
    return propietariosMock.map(p => ({
      id: p.id,
      nombre: p.nombre,
      email: p.email,
      numeroCasa: p.numeroCasa,
      tipo: p.tipo,
    }))
  }, [])

  // Filtrar propietarios por búsqueda
  const propietariosFiltrados = useMemo(() => {
    if (!searchPropietarios) return propietariosDisponibles
    const term = searchPropietarios.toLowerCase()
    return propietariosDisponibles.filter(
      p => p.nombre.toLowerCase().includes(term) || 
           p.email.toLowerCase().includes(term) ||
           p.numeroCasa.toLowerCase().includes(term) ||
           p.tipo.toLowerCase().includes(term)
    )
  }, [propietariosDisponibles, searchPropietarios])

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  // Manejar selección de propietario
  const handleTogglePropietario = useCallback((propietario: PropietarioSeleccionable) => {
    setSelectedPropietarios(prev => {
      const isSelected = prev.some(p => p.id === propietario.id)
      if (isSelected) {
        return prev.filter(p => p.id !== propietario.id)
      } else {
        return [...prev, propietario]
      }
    })
    // Limpiar error de destinatarios si hay al menos uno seleccionado
    setErrors(prev => ({ ...prev, destinatarios: undefined }))
  }, [])

  // Seleccionar todos los propietarios
  const handleSelectAll = useCallback(() => {
    if (selectedPropietarios.length === propietariosDisponibles.length) {
      setSelectedPropietarios([])
    } else {
      setSelectedPropietarios([...propietariosDisponibles])
    }
    setErrors(prev => ({ ...prev, destinatarios: undefined }))
  }, [propietariosDisponibles, selectedPropietarios.length])

  // Remover propietario de la selección
  const handleRemovePropietario = useCallback((id: string) => {
    setSelectedPropietarios(prev => prev.filter(p => p.id !== id))
  }, [])

  // Manejar archivos adjuntos
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const nuevosArchivos: ArchivoAdjunto[] = Array.from(files).map(file => ({
      id: `${Date.now()}-${file.name}`,
      nombre: file.name,
      tamaño: file.size,
      tipo: file.type,
      file: file,
    }))

    setArchivosAdjuntos(prev => [...prev, ...nuevosArchivos])
    
    // Reset input para permitir seleccionar el mismo archivo de nuevo
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  // Remover archivo adjunto
  const handleRemoveArchivo = useCallback((id: string) => {
    setArchivosAdjuntos(prev => prev.filter(a => a.id !== id))
  }, [])

  const validateForm = () => {
    const nextErrors: { asunto?: string; mensaje?: string; destinatarios?: string } = {}
    
    if (selectedPropietarios.length === 0) {
      nextErrors.destinatarios = 'Debes seleccionar al menos un destinatario.'
    }
    if (!formAsunto || formAsunto.trim().length === 0) {
      nextErrors.asunto = 'El asunto es requerido.'
    } else if (formAsunto.length > 200) {
      nextErrors.asunto = 'El asunto no puede superar los 200 caracteres.'
    }
    if (!formMensaje || formMensaje.trim().length === 0) {
      nextErrors.mensaje = 'El mensaje es requerido.'
    } else if (formMensaje.length > 5000) {
      nextErrors.mensaje = 'El mensaje no puede superar los 5000 caracteres.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleLimpiarFormulario = () => {
    setFormAsunto('')
    setFormMensaje('')
    setSelectedPropietarios([])
    setArchivosAdjuntos([])
    setErrors({})
    // Limpiar el editor Tiptap
    tiptapEditor?.commands.clearContent()
  }

  const handleEnviarComunicado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      
      // Aquí iría la llamada al servicio para enviar el comunicado
      // const response = await comunicadoService.enviarComunicado({
      //   asunto: formAsunto,
      //   mensaje: formMensaje,
      //   destinatarios: selectedPropietarios.map(p => p.email),
      //   archivos: archivosAdjuntos.map(a => a.file),
      // })

      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1000))

      const nuevoComunicado: Comunicado = {
        id: Date.now().toString(),
        asunto: formAsunto,
        mensaje: formMensaje,
        fechaEnvio: new Date().toISOString(),
        destinatarios: selectedPropietarios.length,
        estado: 'enviado',
      }

      setComunicados(prev => [nuevoComunicado, ...prev])
      
      toast.success('Comunicado enviado exitosamente', {
        description: `Se envió a ${nuevoComunicado.destinatarios} propietarios`,
      })

      // Limpiar formulario
      setFormAsunto('')
      setFormMensaje('')
      setSelectedPropietarios([])
      setArchivosAdjuntos([])
      setErrors({})
    } catch (err) {
      console.error('Error enviando comunicado:', err)
      toast.error('Error al enviar el comunicado', {
        description: 'Por favor, intenta de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredComunicados = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return comunicados.filter((c) => {
      if (!term) return true
      return (
        c.asunto.toLowerCase().includes(term) ||
        c.mensaje.toLowerCase().includes(term)
      )
    })
  }, [searchTerm, comunicados])

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] overflow-hidden">
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">
                  Dashboard Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Comunicados</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex-1 flex flex-col overflow-hidden min-h-0 bg-gray-50/50">
        <div className="flex-1 flex flex-col gap-6 p-6 overflow-hidden min-h-0">
          {/* Header */}
          <div className="flex items-start justify-between shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Comunicados</h1>
              <p className="text-gray-500 mt-1">
                Envía correos masivos a los propietarios del condominio.
              </p>
            </div>
            <Button
              variant="outline"
              className="gap-2 rounded-xl mt-6 self-end"
              onClick={() => setIsHistorySheetOpen(true)}
            >
              <HugeiconsIcon icon={Sent02Icon} size={18} />
              Ver enviados
            </Button>
          </div>

          {/* Contenido principal: dos columnas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 flex-1 min-h-0">
            {/* Sección izquierda: Lista de propietarios */}
            <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Header */}
              <div className="px-6 py-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">Seleccionar destinatarios</h3>
                    <p className="text-sm text-gray-400">{selectedPropietarios.length} seleccionados</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-full px-4 h-9 font-medium border-gray-200 text-gray-700 hover:bg-gray-50 gap-2"
                    >
                      Seleccionar
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-52 p-2">
                    <div className="space-y-1">
                      <label 
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedPropietarios.length === propietariosDisponibles.length && propietariosDisponibles.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPropietarios(propietariosDisponibles)
                            } else {
                              setSelectedPropietarios([])
                            }
                          }}
                          className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                        />
                        <span className="text-sm font-medium text-gray-700">Todos</span>
                        <span className="text-xs text-gray-400 ml-auto">{propietariosDisponibles.length}</span>
                      </label>
                      <label 
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={propietariosDisponibles.filter(p => p.tipo === 'propietario').every(p => selectedPropietarios.some(s => s.id === p.id))}
                          onCheckedChange={(checked) => {
                            const propietarios = propietariosDisponibles.filter(p => p.tipo === 'propietario')
                            if (checked) {
                              // Agregar todos los propietarios sin duplicar
                              const nuevosSeleccionados = [...selectedPropietarios]
                              propietarios.forEach(p => {
                                if (!nuevosSeleccionados.some(s => s.id === p.id)) {
                                  nuevosSeleccionados.push(p)
                                }
                              })
                              setSelectedPropietarios(nuevosSeleccionados)
                            } else {
                              // Quitar todos los propietarios
                              setSelectedPropietarios(selectedPropietarios.filter(s => s.tipo !== 'propietario'))
                            }
                          }}
                          className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                        />
                        <span className="text-sm font-medium text-gray-700">Propietarios</span>
                        <span className="text-xs text-gray-400 ml-auto">{propietariosDisponibles.filter(p => p.tipo === 'propietario').length}</span>
                      </label>
                      <label 
                        className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={propietariosDisponibles.filter(p => p.tipo === 'arrendatario').every(p => selectedPropietarios.some(s => s.id === p.id))}
                          onCheckedChange={(checked) => {
                            const arrendatarios = propietariosDisponibles.filter(p => p.tipo === 'arrendatario')
                            if (checked) {
                              // Agregar todos los arrendatarios sin duplicar
                              const nuevosSeleccionados = [...selectedPropietarios]
                              arrendatarios.forEach(p => {
                                if (!nuevosSeleccionados.some(s => s.id === p.id)) {
                                  nuevosSeleccionados.push(p)
                                }
                              })
                              setSelectedPropietarios(nuevosSeleccionados)
                            } else {
                              // Quitar todos los arrendatarios
                              setSelectedPropietarios(selectedPropietarios.filter(s => s.tipo !== 'arrendatario'))
                            }
                          }}
                          className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                        />
                        <span className="text-sm font-medium text-gray-700">Arrendatarios</span>
                        <span className="text-xs text-gray-400 ml-auto">{propietariosDisponibles.filter(p => p.tipo === 'arrendatario').length}</span>
                      </label>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Búsqueda */}
              <div className="px-6 pb-4 shrink-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Buscar propietario..."
                    value={searchPropietarios}
                    onChange={(e) => setSearchPropietarios(e.target.value)}
                    className="pl-11 h-11 text-sm bg-gray-50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-200 placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Lista de propietarios */}
              <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4">
                <div className="space-y-2">
                  {propietariosFiltrados.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                      <Users className="w-10 h-10 text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">
                        {searchPropietarios 
                          ? 'No se encontraron propietarios' 
                          : 'No hay propietarios disponibles'}
                      </p>
                    </div>
                  ) : (
                    propietariosFiltrados.map((propietario) => {
                      const isSelected = selectedPropietarios.some(p => p.id === propietario.id)
                      return (
                        <div
                          key={propietario.id}
                          onClick={() => handleTogglePropietario(propietario)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
                            isSelected 
                              ? "bg-gray-900 text-white shadow-md" 
                              : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                          )}
                        >
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className={cn(
                              "rounded-xl text-xs font-semibold",
                              isSelected ? "bg-gray-700 text-white" : "bg-white text-gray-700 border border-gray-200"
                            )}>
                              {getInitials(propietario.nombre)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              isSelected ? "text-white" : "text-gray-900"
                            )}>
                              {propietario.nombre}
                            </p>
                            <p className={cn(
                              "text-xs truncate",
                              isSelected ? "text-gray-300" : "text-gray-400"
                            )}>
                              Casa {propietario.numeroCasa} · {propietario.email}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge
                              variant={propietario.tipo === 'propietario' ? 'outline' : 'secondary'}
                              appearance="light"
                              size="sm"
                              className={cn(
                                "text-[10px] capitalize",
                                isSelected && "bg-white/20 text-white border-white/30"
                              )}
                            >
                              {propietario.tipo}
                            </Badge>
                            {isSelected && (
                              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {errors.destinatarios && (
                <div className="px-4 py-2 bg-red-50 border-t border-red-100 shrink-0">
                  <p className="text-xs text-red-600">{errors.destinatarios}</p>
                </div>
              )}
            </div>

            {/* Sección derecha: Formulario de comunicado estilo email */}
            <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <form onSubmit={handleEnviarComunicado} className="flex flex-col h-full">
                
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
                    onClick={handleLimpiarFormulario}
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
                                    onClick={() => handleRemovePropietario(propietario.id)}
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
                                            onClick={() => handleRemovePropietario(propietario.id)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 opacity-0 group-hover:opacity-100"
                                          >
                                            <Trash2 className="w-4 h-4" />
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
                        setFormAsunto(e.target.value)
                        if (e.target.value.trim().length > 0) {
                          setErrors(prev => ({ ...prev, asunto: undefined }))
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
                      {errors.mensaje && (
                        <p className="text-xs text-red-500 mt-1">{errors.mensaje}</p>
                      )}
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
                                onClick={() => handleRemoveArchivo(archivo.id)}
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
                </div>

                {/* Footer con acciones */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 shrink-0">
                  <div className="flex items-center gap-2">
                    {/* Input oculto para archivos */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      onChange={handleFileChange}
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
          </div>
        </div>
      </div>

      {/* Sheet para ver detalles del comunicado */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
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

      {/* Sheet para historial de comunicados enviados */}
      <Sheet open={isHistorySheetOpen} onOpenChange={setIsHistorySheetOpen}>
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
                  onChange={(e) => setSearchTerm(e.target.value)}
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
                        setSelectedComunicado(comunicado)
                        setIsSheetOpen(true)
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
    </div>
  )
}

