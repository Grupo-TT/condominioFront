'use client'

import { useEffect, useState } from 'react'
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
import { RecipientSelector } from '@/components/recipient-selector'
import { EmailComposer } from '@/components/email-composer'
import { CommunicationDetailsSheet } from '@/components/communication-details-sheet'
import { CommunicationHistorySheet } from '@/components/communication-history-sheet'
import { useComunicados } from '@/hooks/useComunicados'
import { PersonaSeleccionable, ComunicadoUI } from '@/types/comunicados.types'

export default function ComunicadosPage() {
  const {
    personas,
    loadingPersonas,
    fetchPersonas,
    comunicados,
    loadingComunicados,
    fetchComunicados,
    destinatarios,
    loadingDestinatarios,
    fetchDestinatarios,
    sendingEmail,
    enviarEmail,
    deletingId,
    eliminarComunicado,
  } = useComunicados()

  const [searchTerm, setSearchTerm] = useState('')
  const [searchPropietarios, setSearchPropietarios] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [selectedComunicado, setSelectedComunicado] = useState<ComunicadoUI | null>(null)

  // Form state
  const [formAsunto, setFormAsunto] = useState('')
  const [formMensaje, setFormMensaje] = useState('')
  const [selectedPropietarios, setSelectedPropietarios] = useState<PersonaSeleccionable[]>([])
  const [archivos, setArchivos] = useState<File[]>([])
  const [errors, setErrors] = useState<{ asunto?: string; contenido?: string; destinatarios?: string }>({})

  // Fetch data on mount
  useEffect(() => {
    fetchPersonas()
    fetchComunicados()
  }, [fetchPersonas, fetchComunicados])

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

    // Validate that there is content
    const hasMensaje = formMensaje && formMensaje.trim().length > 0

    if (!hasMensaje) {
      nextErrors.contenido = 'Debes incluir una descripción del comunicado.'
    }

    // If there is a message, validate max length
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
      // Pass the file directly - the service handles multipart/form-data
      const success = await enviarEmail({
        emails: selectedPropietarios.map(p => p.correo),
        subject: formAsunto,
        message: formMensaje,
      }, archivos.length > 0 ? archivos[0] : undefined)

      if (success) {
        toast.success('Comunicado enviado exitosamente', {
          description: `Se envió a ${selectedPropietarios.length} destinatarios`,
        })

        // Clear form
        setFormAsunto('')
        setFormMensaje('')
        setSelectedPropietarios([])
        setArchivos([])
        setErrors({})
      } else {
        toast.error('Error al enviar el comunicado', {
          description: 'Por favor, intenta de nuevo.',
        })
      }
    } catch (err) {
      console.error('Error enviando comunicado:', err)
      toast.error('Error al enviar el comunicado', {
        description: 'Por favor, intenta de nuevo.',
      })
    }
  }

  const handleDeleteComunicado = async (id: string): Promise<boolean> => {
    const success = await eliminarComunicado(id)
    if (success) {
      toast.success('Comunicado eliminado', {
        description: 'El comunicado ha sido eliminado correctamente.',
      })
    } else {
      toast.error('Error al eliminar', {
        description: 'No se pudo eliminar el comunicado. Intenta de nuevo.',
      })
    }
    return success
  }

  const handleTogglePropietario = (propietario: PersonaSeleccionable) => {
    setSelectedPropietarios(prev => {
      const isSelected = prev.some(p => p.id === propietario.id)
      if (isSelected) {
        return prev.filter(p => p.id !== propietario.id)
      } else {
        return [...prev, propietario]
      }
    })
    setErrors(prev => ({ ...prev, destinatarios: undefined }))
  }

  const handleSelectAll = () => {
    if (selectedPropietarios.length === personas.length) {
      setSelectedPropietarios([])
    } else {
      setSelectedPropietarios([...personas])
    }
    setErrors(prev => ({ ...prev, destinatarios: undefined }))
  }

  const handleSelectByRole = (role: string) => {
    const personasWithRole = personas.filter(p => (p.roles || []).includes(role))
    const isAllSelected = personasWithRole.every(p => selectedPropietarios.some(s => s.id === p.id))

    if (isAllSelected) {
      // Deselect all with this role
      setSelectedPropietarios(selectedPropietarios.filter(s => !(s.roles || []).includes(role)))
    } else {
      // Add all with this role that are not already selected
      const nuevosSeleccionados = [...selectedPropietarios]
      personasWithRole.forEach(p => {
        if (!nuevosSeleccionados.some(s => s.id === p.id)) {
          nuevosSeleccionados.push(p)
        }
      })
      setSelectedPropietarios(nuevosSeleccionados)
    }
    setErrors(prev => ({ ...prev, destinatarios: undefined }))
  }

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
                Envía correos masivos a los residentes del condominio.
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
              propietariosDisponibles={personas}
              selectedPropietarios={selectedPropietarios}
              searchPropietarios={searchPropietarios}
              onSearchChange={setSearchPropietarios}
              onTogglePropietario={handleTogglePropietario}
              onSelectAll={handleSelectAll}
              onSelectByRole={handleSelectByRole}
              loading={loadingPersonas}
            />

            {/* Sección derecha: Formulario de comunicado estilo email */}
            <EmailComposer
              selectedPropietarios={selectedPropietarios}
              formAsunto={formAsunto}
              formMensaje={formMensaje}
              errors={errors}
              loading={sendingEmail}
              onAsuntoChange={setFormAsunto}
              onMensajeChange={setFormMensaje}
              onRemovePropietario={(id) => {
                setSelectedPropietarios(prev => prev.filter(p => p.id !== id))
              }}
              onLimpiarFormulario={() => {
                setFormAsunto('')
                setFormMensaje('')
                setSelectedPropietarios([])
                setArchivos([])
                setErrors({})
              }}
              onSubmit={handleEnviarComunicado}
              onClearError={clearError}
              archivos={archivos}
              onArchivosChange={setArchivos}
            />
          </div>
        </div>
      </div>

      {/* Sheet para ver detalles del comunicado */}
      <CommunicationDetailsSheet
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        selectedComunicado={selectedComunicado}
        destinatarios={destinatarios}
        loadingDestinatarios={loadingDestinatarios}
        onFetchDestinatarios={fetchDestinatarios}
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
        onDelete={handleDeleteComunicado}
        deletingId={deletingId}
        loading={loadingComunicados}
      />
    </div>
  )
}
