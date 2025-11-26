import { useState } from 'react'
import { editarReserva } from '@/hooks/useReserva'
import type { IEventExtended } from '@/types/reservas-calendar.types'

interface UseReservasActionsProps {
  aprobarReserva: (id: number) => Promise<void>
  rechazarReserva: (id: number) => Promise<void>
  eliminarReserva: (id: number) => Promise<void>
  recargar: () => void
}

export interface UseReservasActionsReturn {
  // Estados de sheets
  selectedReserva: IEventExtended | null
  detailSheetOpen: boolean
  setDetailSheetOpen: (open: boolean) => void
  editSheetOpen: boolean
  setEditSheetOpen: (open: boolean) => void
  reservaEditando: IEventExtended | null
  setReservaEditando: (reserva: IEventExtended | null) => void
  
  // Estados de confirmación
  confirmDialogOpen: boolean
  setConfirmDialogOpen: (open: boolean) => void
  confirmAction: {
    type: 'aprobar' | 'rechazar' | 'eliminar'
    reserva: IEventExtended | null
  } | null
  
  // Handlers
  handleViewDetails: (reserva: IEventExtended) => void
  handleEdit: (reserva: IEventExtended) => void
  handleSaveEdit: (
    reserva: IEventExtended,
    data: {
      fecha: Date
      horaInicial: string
      horaFinal: string
      numeroInvitados: number
    }
  ) => Promise<void>
  handleDelete: (reserva: IEventExtended) => void
  handleAprobar: (reserva: IEventExtended) => void
  handleRechazar: (reserva: IEventExtended) => void
  executeConfirmedAction: () => Promise<void>
  getConfirmDialogContent: () => {
    title: string
    description: string
    confirmText: string
    variant: 'default' | 'destructive'
  }
}

export function useReservasActions({
  aprobarReserva,
  rechazarReserva,
  eliminarReserva,
  recargar,
}: UseReservasActionsProps): UseReservasActionsReturn {
  // Estados para diálogos de confirmación
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<{
    type: 'aprobar' | 'rechazar' | 'eliminar'
    reserva: IEventExtended | null
  } | null>(null)

  // Estados para sheets
  const [selectedReserva, setSelectedReserva] = useState<IEventExtended | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)
  const [editSheetOpen, setEditSheetOpen] = useState(false)
  const [reservaEditando, setReservaEditando] = useState<IEventExtended | null>(null)

  // Función para ver detalles de una reserva
  const handleViewDetails = (reserva: IEventExtended) => {
    setSelectedReserva(reserva)
    setDetailSheetOpen(true)
  }

  // Función para editar una reserva
  const handleEdit = (reserva: IEventExtended) => {
    setReservaEditando(reserva)
    setEditSheetOpen(true)
    setDetailSheetOpen(false)
  }

  // Función para guardar los cambios de la reserva
  const handleSaveEdit = async (
    reserva: IEventExtended,
    data: {
      fecha: Date
      horaInicial: string
      horaFinal: string
      numeroInvitados: number
    }
  ) => {
    try {
      // Convertir los datos al formato esperado por la API
      const [horaInicioH, horaInicioM] = data.horaInicial.split(':').map(Number)
      const [horaFinH, horaFinM] = data.horaFinal.split(':').map(Number)

      await editarReserva(reserva.id, {
        fechaSolicitud: data.fecha,
        horaInicio: { hour: horaInicioH, minute: horaInicioM },
        endDate: data.fecha,
        horaFin: { hour: horaFinH, minute: horaFinM },
        numeroInvitados: data.numeroInvitados,
      })

      // Recargar las reservas
      recargar()
      
      // Cerrar el sheet
      setEditSheetOpen(false)
      setReservaEditando(null)
    } catch (error) {
      console.error('Error al guardar cambios:', error)
      throw error // Re-lanzar para que el componente pueda manejarlo
    }
  }

  // Funciones de acción - abren diálogos de confirmación
  const handleDelete = (reserva: IEventExtended) => {
    setConfirmAction({ type: 'eliminar', reserva })
    setConfirmDialogOpen(true)
  }

  const handleAprobar = (reserva: IEventExtended) => {
    setConfirmAction({ type: 'aprobar', reserva })
    setConfirmDialogOpen(true)
  }

  const handleRechazar = (reserva: IEventExtended) => {
    setConfirmAction({ type: 'rechazar', reserva })
    setConfirmDialogOpen(true)
  }

  // Función que ejecuta la acción confirmada
  const executeConfirmedAction = async () => {
    if (!confirmAction || !confirmAction.reserva) return

    try {
      switch (confirmAction.type) {
        case 'aprobar':
          await aprobarReserva(confirmAction.reserva.id)
          break
        case 'rechazar':
          await rechazarReserva(confirmAction.reserva.id)
          break
        case 'eliminar':
          await eliminarReserva(confirmAction.reserva.id)
          break
      }
      recargar()
      setConfirmDialogOpen(false)
      setConfirmAction(null)
    } catch (error) {
      console.error(`Error al ${confirmAction.type} reserva:`, error)
      throw error
    }
  }

  // Obtener texto del diálogo según la acción
  const getConfirmDialogContent = () => {
    if (!confirmAction || !confirmAction.reserva) {
      return { title: '', description: '', confirmText: '', variant: 'default' as const }
    }

    const reserva = confirmAction.reserva
    const nombreRecurso = reserva.title

    switch (confirmAction.type) {
      case 'aprobar':
        return {
          title: '¿Aprobar reserva?',
          description: `¿Estás seguro de que deseas aprobar la reserva de "${nombreRecurso}"?`,
          confirmText: 'Aprobar',
          variant: 'default' as const,
        }
      case 'rechazar':
        return {
          title: '¿Rechazar reserva?',
          description: `¿Estás seguro de que deseas rechazar la reserva de "${nombreRecurso}"? Esta acción no se puede deshacer.`,
          confirmText: 'Rechazar',
          variant: 'destructive' as const,
        }
      case 'eliminar':
        return {
          title: '¿Eliminar reserva?',
          description: `¿Estás seguro de que deseas eliminar la reserva de "${nombreRecurso}"? Esta acción no se puede deshacer.`,
          confirmText: 'Eliminar',
          variant: 'destructive' as const,
        }
    }
  }

  return {
    // Estados de sheets
    selectedReserva,
    detailSheetOpen,
    setDetailSheetOpen,
    editSheetOpen,
    setEditSheetOpen,
    reservaEditando,
    setReservaEditando,
    
    // Estados de confirmación
    confirmDialogOpen,
    setConfirmDialogOpen,
    confirmAction,
    
    // Handlers
    handleViewDetails,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleAprobar,
    handleRechazar,
    executeConfirmedAction,
    getConfirmDialogContent,
  }
}

