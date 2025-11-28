'use client'

import { useMemo, useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Sent02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { propietariosMock } from '@/data/propietarios.mock'
import { comunicadosMock as comunicadosData } from '@/data/comunicados.mock'
import { RecipientSelector } from '@/components/recipient-selector'
import { EmailComposer } from '@/components/email-composer'
import { CommunicationDetailsSheet } from '@/components/communication-details-sheet'
import { CommunicationHistorySheet } from '@/components/communication-history-sheet'

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

export default function ComunicadosPage() {
  const [comunicados, setComunicados] = useState<Comunicado[]>(comunicadosData)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchPropietarios, setSearchPropietarios] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null)

  // Estados del formulario
  const [formAsunto, setFormAsunto] = useState('')
  const [formMensaje, setFormMensaje] = useState('')
  const [selectedPropietarios, setSelectedPropietarios] = useState<PropietarioSeleccionable[]>([])
  const [archivosAdjuntos, setArchivosAdjuntos] = useState<ArchivoAdjunto[]>([])
  const [errors, setErrors] = useState<{ asunto?: string; contenido?: string; destinatarios?: string }>({})

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

  // Filtrar propietarios por búsqueda (ahora manejado en RecipientSelector)
  // const propietariosFiltrados = useMemo(() => {
  //   if (!searchPropietarios) return propietariosDisponibles
  //   const term = searchPropietarios.toLowerCase()
  //   return propietariosDisponibles.filter(
  //     p => p.nombre.toLowerCase().includes(term) ||
  //          p.email.toLowerCase().includes(term) ||
  //          p.numeroCasa.toLowerCase().includes(term) ||
  //          p.tipo.toLowerCase().includes(term)
  //   )
  // }, [propietariosDisponibles, searchPropietarios])

  const clearError = (errorKey: string) => {
    setErrors(prev => ({ ...prev, [errorKey]: undefined }))
  }

  const validateForm = () => {
    const nextErrors: { asunto?: string; contenido?: string; destinatarios?: string } = {}

    if (selectedPropietarios.length === 0) {
      nextErrors.destinatarios = 'Debes seleccionar al menos un destinatario.'
    }
    if (!formAsunto || formAsunto.trim().length === 0) {
      nextErrors.asunto = 'El asunto es requerido.'
    } else if (formAsunto.length > 200) {
      nextErrors.asunto = 'El asunto no puede superar los 200 caracteres.'
    }

    // Validar que haya contenido: mensaje o archivos adjuntos (o ambos)
    const hasMensaje = formMensaje && formMensaje.trim().length > 0
    const hasArchivos = archivosAdjuntos.length > 0

    if (!hasMensaje && !hasArchivos) {
      nextErrors.contenido = 'Debes incluir una descripción o adjuntar al menos un archivo.'
    }

    // Si hay mensaje, validar longitud máxima
    if (hasMensaje && formMensaje.length > 5000) {
      nextErrors.contenido = 'El mensaje no puede superar los 5000 caracteres.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
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

  // const filteredComunicados = useMemo(() => {
  //   const term = searchTerm.toLowerCase()
  //   return comunicados.filter((c) => {
  //     if (!term) return true
  //     return (
  //       c.asunto.toLowerCase().includes(term) ||
  //       c.mensaje.toLowerCase().includes(term)
  //     )
  //   })
  // }, [searchTerm, comunicados])

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
            <RecipientSelector
              propietariosDisponibles={propietariosDisponibles}
              selectedPropietarios={selectedPropietarios}
              searchPropietarios={searchPropietarios}
              onSearchChange={setSearchPropietarios}
              onTogglePropietario={(propietario) => {
                setSelectedPropietarios(prev => {
                  const isSelected = prev.some(p => p.id === propietario.id)
                  if (isSelected) {
                    return prev.filter(p => p.id !== propietario.id)
                  } else {
                    return [...prev, propietario]
                  }
                })
                setErrors(prev => ({ ...prev, destinatarios: undefined }))
              }}
              onSelectAll={() => {
                if (selectedPropietarios.length === propietariosDisponibles.length) {
                  setSelectedPropietarios([])
                } else {
                  setSelectedPropietarios([...propietariosDisponibles])
                }
                setErrors(prev => ({ ...prev, destinatarios: undefined }))
              }}
              onSelectTipo={(tipo) => {
                if (tipo === 'propietario') {
                  const propietarios = propietariosDisponibles.filter(p => p.tipo === 'propietario')
                  const isAllSelected = propietarios.every(p => selectedPropietarios.some(s => s.id === p.id))
                  if (isAllSelected) {
                    setSelectedPropietarios(selectedPropietarios.filter(s => s.tipo !== 'propietario'))
                  } else {
                    const nuevosSeleccionados = [...selectedPropietarios]
                    propietarios.forEach(p => {
                      if (!nuevosSeleccionados.some(s => s.id === p.id)) {
                        nuevosSeleccionados.push(p)
                      }
                    })
                    setSelectedPropietarios(nuevosSeleccionados)
                  }
                } else {
                  const arrendatarios = propietariosDisponibles.filter(p => p.tipo === 'arrendatario')
                  const isAllSelected = arrendatarios.every(p => selectedPropietarios.some(s => s.id === p.id))
                  if (isAllSelected) {
                    setSelectedPropietarios(selectedPropietarios.filter(s => s.tipo !== 'arrendatario'))
                  } else {
                    const nuevosSeleccionados = [...selectedPropietarios]
                    arrendatarios.forEach(p => {
                      if (!nuevosSeleccionados.some(s => s.id === p.id)) {
                        nuevosSeleccionados.push(p)
                      }
                    })
                    setSelectedPropietarios(nuevosSeleccionados)
                  }
                }
                setErrors(prev => ({ ...prev, destinatarios: undefined }))
              }}
            />

            {/* Sección derecha: Formulario de comunicado estilo email */}
            <EmailComposer
              selectedPropietarios={selectedPropietarios}
              formAsunto={formAsunto}
              formMensaje={formMensaje}
              archivosAdjuntos={archivosAdjuntos}
              errors={errors}
              loading={loading}
              onAsuntoChange={setFormAsunto}
              onMensajeChange={setFormMensaje}
              onFileChange={(e) => {
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
                if (e.target) {
                  e.target.value = ''
                }
              }}
              onRemoveArchivo={(id) => {
                setArchivosAdjuntos(prev => prev.filter(a => a.id !== id))
              }}
              onRemovePropietario={(id) => {
                setSelectedPropietarios(prev => prev.filter(p => p.id !== id))
              }}
              onLimpiarFormulario={() => {
                setFormAsunto('')
                setFormMensaje('')
                setSelectedPropietarios([])
                setArchivosAdjuntos([])
                setErrors({})
              }}
              onSubmit={handleEnviarComunicado}
              onClearError={clearError}
            />
          </div>
        </div>
      </div>

      {/* Sheet para ver detalles del comunicado */}
      <CommunicationDetailsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedComunicado={selectedComunicado}
        propietariosDisponibles={propietariosDisponibles}
      />

      {/* Sheet para historial de comunicados enviados */}
      <CommunicationHistorySheet
        isOpen={isHistorySheetOpen}
        onOpenChange={setIsHistorySheetOpen}
        comunicados={comunicados}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onSelectComunicado={setSelectedComunicado}
        onOpenDetails={() => setIsSheetOpen(true)}
      />
    </div>
  )
}

