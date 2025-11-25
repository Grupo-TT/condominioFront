'use client'

import { useMemo, useState, useEffect } from 'react'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Carousel } from '@/components/ui/apple-cards-carousel'
import { MapPin, Package, User, Minus, Plus, Calendar as CalendarIcon, Clock, Pencil, Trash2 } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar02Icon } from '@hugeicons/core-free-icons'
import { RECURSOS_MOCK } from '@/data/recursos-mock'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Calendar } from '@/components/ui/calendar'
import { HoraCombobox } from '@/components/hora-combobox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { RecursoUI } from '@/services/recurso.adapter'

// Tipo para las reservas del usuario
interface ReservaUsuario {
  id: string
  recursoId: string
  recursoNombre: string
  tipoRecurso: 'zona' | 'objeto'
  estado: 'pendiente' | 'aprobada' | 'rechazada'
  fechaInicio: Date
  fechaFin: Date
  horaInicio: string
  horaFin: string
  numeroInvitados: number
  fechaCreacion: Date
}

// Datos mock de reservas
// Fechas fijas para facilitar pruebas - DICIEMBRE 2025 (válidas desde 9 de noviembre 2025)
const RESERVAS_MOCK: ReservaUsuario[] = [
  {
    id: '1',
    recursoId: '1', // Salón de Eventos
    recursoNombre: 'Salón de Eventos',
    tipoRecurso: 'zona',
    estado: 'aprobada',
    fechaInicio: new Date(2025, 11, 15), // 15 de diciembre 2025
    fechaFin: new Date(2025, 11, 15),
    horaInicio: '14:00',
    horaFin: '18:00', // Ocupa: 14:00, 15:00, 16:00, 17:00
    numeroInvitados: 25,
    fechaCreacion: new Date(2025, 10, 10),
  },
  {
    id: '2',
    recursoId: '1', // Salón de Eventos (mismo recurso, diferente día)
    recursoNombre: 'Salón de Eventos',
    tipoRecurso: 'zona',
    estado: 'pendiente',
    fechaInicio: new Date(2025, 11, 17), // 17 de diciembre 2025
    fechaFin: new Date(2025, 11, 17),
    horaInicio: '10:00',
    horaFin: '12:00', // Ocupa: 10:00, 11:00
    numeroInvitados: 10,
    fechaCreacion: new Date(2025, 10, 12),
  },
  {
    id: '3',
    recursoId: '2', // Piscina
    recursoNombre: 'Piscina',
    tipoRecurso: 'zona',
    estado: 'aprobada',
    fechaInicio: new Date(2025, 11, 16), // 16 de diciembre 2025
    fechaFin: new Date(2025, 11, 16),
    horaInicio: '15:00',
    horaFin: '17:00', // Ocupa: 15:00, 16:00
    numeroInvitados: 8,
    fechaCreacion: new Date(2025, 10, 11),
  },
  {
    id: '4',
    recursoId: '4', // Sillas Plegables
    recursoNombre: 'Sillas Plegables',
    tipoRecurso: 'objeto',
    estado: 'rechazada', // Esta NO debería bloquear horas (estado rechazada)
    fechaInicio: new Date(2025, 11, 15),
    fechaFin: new Date(2025, 11, 15),
    horaInicio: '19:00',
    horaFin: '21:00',
    numeroInvitados: 5,
    fechaCreacion: new Date(2025, 10, 10),
  },
]

export default function ReservasPropietarioPage() {
  const [activeTab, setActiveTab] = useState<string>('recursos')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [selectedRecurso, setSelectedRecurso] = useState<RecursoUI | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [horaInicial, setHoraInicial] = useState<string>('')
  const [horaFinal, setHoraFinal] = useState<string>('')
  const [numeroInvitados, setNumeroInvitados] = useState<number>(1)
  const [reservas, setReservas] = useState<ReservaUsuario[]>(RESERVAS_MOCK)
  const [openDialogConfirmacion, setOpenDialogConfirmacion] = useState(false)
  const [reservaEditando, setReservaEditando] = useState<ReservaUsuario | null>(null)
  // Estados para el formulario de edición
  const [editDate, setEditDate] = useState<Date | undefined>(undefined)
  const [editHoraInicial, setEditHoraInicial] = useState<string>('')
  const [editHoraFinal, setEditHoraFinal] = useState<string>('')
  const [editNumeroInvitados, setEditNumeroInvitados] = useState<number>(1)

  // Separar recursos por tipo
  const zonas = useMemo(() => RECURSOS_MOCK.filter(r => r.tipo === 'zona' && r.habilitado), [])
  const objetos = useMemo(() => RECURSOS_MOCK.filter(r => r.tipo === 'objeto' && r.habilitado), [])

  // Generar opciones de hora en formato 12 horas (7:00 AM a 11:00 PM)
  const horas = useMemo(() => {
    const horasArray: Array<{ value: string; label: string; hora24: number }> = []
    
    // Generar horas de 7:00 AM (07:00) a 11:59 PM (23:59)
    for (let i = 7; i < 24; i++) {
      const hora12 = i === 0 ? 12 : i > 12 ? i - 12 : i
      const ampm = i >= 12 ? 'PM' : 'AM'
      const hora24 = i
      const value = `${i.toString().padStart(2, '0')}:00`
      const label = `${hora12}:00 ${ampm}`
      
      horasArray.push({ value, label, hora24 })
    }
    
    return horasArray
  }, [])

  // Obtener horas ocupadas para el recurso y fecha seleccionada (para crear)
  const horasOcupadas = useMemo(() => {
    if (!selectedRecurso || !selectedDate) {
      return new Set<string>()
    }
    
    const ocupadas = new Set<string>()
    
    // Filtrar reservas que coincidan con el recurso y la fecha
    const reservasDelDia = reservas.filter(reserva => {
      // Comparar recursoId
      if (reserva.recursoId !== selectedRecurso.id) {
        return false
      }
      
      // Comparar fecha (solo día, mes y año)
      const fechaReserva = new Date(reserva.fechaInicio)
      fechaReserva.setHours(0, 0, 0, 0)
      const fechaSeleccionada = new Date(selectedDate)
      fechaSeleccionada.setHours(0, 0, 0, 0)
      
      // Comparar año, mes y día por separado para evitar problemas de zona horaria
      const mismoDia = fechaReserva.getDate() === fechaSeleccionada.getDate()
      const mismoMes = fechaReserva.getMonth() === fechaSeleccionada.getMonth()
      const mismoAnio = fechaReserva.getFullYear() === fechaSeleccionada.getFullYear()
      
      const fechaCoincide = mismoDia && mismoMes && mismoAnio
      
      if (!fechaCoincide) {
        return false
      }
      
      // Solo considerar reservas aprobadas o pendientes (no rechazadas)
      return reserva.estado === 'aprobada' || reserva.estado === 'pendiente'
    })
    
    // Marcar todas las horas ocupadas por las reservas
    reservasDelDia.forEach(reserva => {
      const [horaInicio] = reserva.horaInicio.split(':').map(Number)
      const [horaFin] = reserva.horaFin.split(':').map(Number)
      
      // Marcar todas las horas que están dentro del rango de la reserva
      // Incluimos desde la hora de inicio hasta la hora de fin (excluyendo la hora de fin)
      // Ejemplo: si la reserva es de 14:00 a 18:00, ocupamos 14:00, 15:00, 16:00, 17:00
      for (let hora = horaInicio; hora < horaFin; hora++) {
        if (hora >= 7 && hora < 24) {
          const horaValue = `${hora.toString().padStart(2, '0')}:00`
          ocupadas.add(horaValue)
        }
      }
    })
    
    return ocupadas
  }, [selectedRecurso, selectedDate, reservas])

  // Obtener horas ocupadas para el recurso y fecha seleccionada (para editar)
  const horasOcupadasEdit = useMemo(() => {
    if (!selectedRecurso || !editDate) {
      return new Set<string>()
    }
    
    const ocupadas = new Set<string>()
    
    // Filtrar reservas que coincidan con el recurso y la fecha (excluyendo la reserva que se está editando)
    const reservasDelDia = reservas.filter(reserva => {
      // Excluir la reserva que se está editando
      if (reservaEditando && reserva.id === reservaEditando.id) {
        return false
      }
      
      // Comparar recursoId
      if (reserva.recursoId !== selectedRecurso.id) {
        return false
      }
      
      // Comparar fecha (solo día, mes y año)
      const fechaReserva = new Date(reserva.fechaInicio)
      fechaReserva.setHours(0, 0, 0, 0)
      const fechaSeleccionada = new Date(editDate)
      fechaSeleccionada.setHours(0, 0, 0, 0)
      
      // Comparar año, mes y día por separado para evitar problemas de zona horaria
      const mismoDia = fechaReserva.getDate() === fechaSeleccionada.getDate()
      const mismoMes = fechaReserva.getMonth() === fechaSeleccionada.getMonth()
      const mismoAnio = fechaReserva.getFullYear() === fechaSeleccionada.getFullYear()
      
      const fechaCoincide = mismoDia && mismoMes && mismoAnio
      
      if (!fechaCoincide) {
        return false
      }
      
      // Solo considerar reservas aprobadas o pendientes (no rechazadas)
      return reserva.estado === 'aprobada' || reserva.estado === 'pendiente'
    })
    
    // Marcar todas las horas ocupadas por las reservas
    reservasDelDia.forEach(reserva => {
      const [horaInicio] = reserva.horaInicio.split(':').map(Number)
      const [horaFin] = reserva.horaFin.split(':').map(Number)
      
      // Marcar todas las horas que están dentro del rango de la reserva
      for (let hora = horaInicio; hora < horaFin; hora++) {
        if (hora >= 7 && hora < 24) {
          const horaValue = `${hora.toString().padStart(2, '0')}:00`
          ocupadas.add(horaValue)
        }
      }
    })
    
    return ocupadas
  }, [selectedRecurso, editDate, reservas, reservaEditando])

  // Filtrar horas disponibles para hora final (solo horas posteriores a la hora inicial y no ocupadas)
  const horasFinalDisponibles = useMemo(() => {
    if (!horaInicial) {
      // Si no hay hora inicial seleccionada, mostrar todas las horas no ocupadas
      return horas.filter(h => !horasOcupadas.has(h.value))
    }
    
    const horaInicialObj = horas.find(h => h.value === horaInicial)
    if (!horaInicialObj) return horas.filter(h => !horasOcupadas.has(h.value))
    
    // Filtrar horas posteriores a la inicial y que no estén ocupadas
    return horas.filter(h => 
      h.hora24 > horaInicialObj.hora24 && !horasOcupadas.has(h.value)
    )
  }, [horaInicial, horas, horasOcupadas])

  // Filtrar horas disponibles para hora final en edición
  const horasFinalDisponiblesEdit = useMemo(() => {
    if (!editHoraInicial) {
      // Si no hay hora inicial seleccionada, mostrar todas las horas no ocupadas
      return horas.filter(h => !horasOcupadasEdit.has(h.value))
    }
    
    const horaInicialObj = horas.find(h => h.value === editHoraInicial)
    if (!horaInicialObj) return horas.filter(h => !horasOcupadasEdit.has(h.value))
    
    // Filtrar horas posteriores a la inicial y que no estén ocupadas
    return horas.filter(h => 
      h.hora24 > horaInicialObj.hora24 && !horasOcupadasEdit.has(h.value)
    )
  }, [editHoraInicial, horas, horasOcupadasEdit])

  // Resetear horas si se vuelven inválidas cuando cambia la fecha o el recurso
  useEffect(() => {
    if (horaInicial && horasOcupadas.has(horaInicial)) {
      setHoraInicial('')
      setHoraFinal('')
    }
  }, [selectedDate, selectedRecurso, horasOcupadas, horaInicial])

  // Resetear hora final si es inválida cuando cambia la hora inicial
  useEffect(() => {
    if (horaInicial && horaFinal) {
      const horaInicialObj = horas.find(h => h.value === horaInicial)
      const horaFinalObj = horas.find(h => h.value === horaFinal)
      
      if (horaInicialObj && horaFinalObj && horaFinalObj.hora24 <= horaInicialObj.hora24) {
        setHoraFinal('')
      }
      
      // También resetear si la hora final está ocupada
      if (horasOcupadas.has(horaFinal)) {
        setHoraFinal('')
      }
    }
  }, [horaInicial, horaFinal, horas, horasOcupadas])

  // Resetear horas si se vuelven inválidas cuando cambia la fecha o el recurso (edición)
  useEffect(() => {
    if (editHoraInicial && horasOcupadasEdit.has(editHoraInicial)) {
      setEditHoraInicial('')
      setEditHoraFinal('')
    }
  }, [editDate, selectedRecurso, horasOcupadasEdit, editHoraInicial])

  // Resetear hora final si es inválida cuando cambia la hora inicial (edición)
  useEffect(() => {
    if (editHoraInicial && editHoraFinal) {
      const horaInicialObj = horas.find(h => h.value === editHoraInicial)
      const horaFinalObj = horas.find(h => h.value === editHoraFinal)
      
      if (horaInicialObj && horaFinalObj && horaFinalObj.hora24 <= horaInicialObj.hora24) {
        setEditHoraFinal('')
      }
      
      // También resetear si la hora final está ocupada
      if (horasOcupadasEdit.has(editHoraFinal)) {
        setEditHoraFinal('')
      }
    }
  }, [editHoraInicial, editHoraFinal, horas, horasOcupadasEdit])

  const handleReservarClick = (recurso: RecursoUI) => {
    setSelectedRecurso(recurso)
    setIsSheetOpen(true)
    setSelectedDate(undefined)
    setHoraInicial('')
    setHoraFinal('')
    setNumeroInvitados(1)
  }

  // Crear tarjetas para Zonas con diseño original
  const zonasCards = useMemo(() => {
    return zonas.map((zona) => (
      <div key={zona.id} className="min-w-[360px] md:min-w-[450px] lg:min-w-[500px] max-w-[500px]">
        <Card className="flex flex-row border border-gray-200 bg-white transition-all duration-300 h-full min-h-[210px] overflow-hidden group p-3 rounded-2xl">
          {/* Contenedor izquierdo con círculos concéntricos */}
          <div 
            className="flex-shrink-0 w-36 flex items-center justify-center relative rounded-xl"
            style={{
              background: `radial-gradient(circle at center, rgba(163, 145, 112, 0.28) 0%, rgba(163, 145, 112, 0.28) 15%, transparent 15%, transparent 18%),
                          radial-gradient(circle at center, rgba(163, 145, 112, 0.22) 0%, rgba(163, 145, 112, 0.22) 25%, transparent 25%, transparent 28%),
                          radial-gradient(circle at center, rgba(163, 145, 112, 0.18) 0%, rgba(163, 145, 112, 0.18) 35%, transparent 35%, transparent 38%),
                          radial-gradient(circle at center, rgba(163, 145, 112, 0.14) 0%, rgba(163, 145, 112, 0.14) 45%, transparent 45%, transparent 48%),
                          radial-gradient(circle at center, rgba(163, 145, 112, 0.09) 0%, rgba(163, 145, 112, 0.09) 55%, transparent 55%, transparent 58%),
                          radial-gradient(circle at center, rgba(163, 145, 112, 0.05) 0%, rgba(163, 145, 112, 0.05) 65%, transparent 65%, transparent 68%),
                          #f3f4f6`,
            }}
          >
            {/* Contenedor del icono */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <MapPin className="w-7 h-7" style={{ color: '#A39170' }} />
            </div>
          </div>
          <CardContent className="pl-5 flex-1 flex flex-col justify-between p-0">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2 mt-2">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{zona.nombre}</h3>
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2" style={{ backgroundColor: '#F1E8D6', color: '#A39170' }}>
                  Zona
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {zona.descripcion || 'Sin descripción disponible'}
              </p>
            </div>
            <div className="flex items-center justify-between overflow-hidden">
              <span 
                className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${
                  zona.estado === 'Disponible' 
                    ? 'border-green-500 text-green-700' 
                    : 'border-orange-500 text-orange-700'
                }`}
              >
                {zona.estado}
              </span> 
              {zona.estado === 'En Mantenimiento' ? (
                <Button 
                  className="h-10 font-semibold transition-all duration-300 w-[140px] bg-gray-100 border border-gray-300 text-gray-500 overflow-hidden relative shadow-sm ml-3 p-0 cursor-not-allowed" 
                  disabled
                >
                  <div className="flex items-center justify-center gap-2 px-3">
                    <HugeiconsIcon icon={Calendar02Icon} size={20} className="text-gray-400 flex-shrink-0" />
                    <span className="whitespace-nowrap">No disponible</span>
                  </div>
                </Button>
              ) : (
                <Button 
                  className="group/btn h-10 font-semibold transition-all duration-300 w-10 hover:w-[140px] bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 overflow-hidden relative shadow-sm hover:shadow-md ml-3 p-0" 
                  onClick={() => handleReservarClick(zona)}
                >
                  {/* Icono centrado cuando el botón está pequeño */}
                  <div className="absolute inset-0 flex items-center justify-center group-hover/btn:hidden">
                    <HugeiconsIcon icon={Calendar02Icon} size={20} className="text-gray-700" />
                  </div>
                  {/* Contenido cuando el botón está expandido */}
                  <div className="hidden items-center justify-center gap-2 group-hover/btn:flex px-3">
                    <HugeiconsIcon icon={Calendar02Icon} size={20} className="text-gray-700 flex-shrink-0" />
                    <span className="whitespace-nowrap">Reservar</span>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    ))
  }, [zonas])

  // Crear tarjetas para Objetos con diseño original
  const objetosCards = useMemo(() => {
    return objetos.map((objeto) => (
      <div key={objeto.id} className="min-w-[360px] md:min-w-[450px] lg:min-w-[500px] max-w-[500px]">
        <Card className="flex flex-row border border-gray-200 bg-white transition-all duration-300 h-full min-h-[210px] overflow-hidden group p-3 rounded-2xl">
          {/* Contenedor izquierdo con círculos concéntricos */}
          <div 
            className="flex-shrink-0 w-36 flex items-center justify-center relative rounded-xl"
            style={{
              background: `radial-gradient(circle at center, rgba(89, 93, 117, 0.28) 0%, rgba(89, 93, 117, 0.28) 15%, transparent 15%, transparent 18%),
                          radial-gradient(circle at center, rgba(89, 93, 117, 0.22) 0%, rgba(89, 93, 117, 0.22) 25%, transparent 25%, transparent 28%),
                          radial-gradient(circle at center, rgba(89, 93, 117, 0.18) 0%, rgba(89, 93, 117, 0.18) 35%, transparent 35%, transparent 38%),
                          radial-gradient(circle at center, rgba(89, 93, 117, 0.14) 0%, rgba(89, 93, 117, 0.14) 45%, transparent 45%, transparent 48%),
                          radial-gradient(circle at center, rgba(89, 93, 117, 0.09) 0%, rgba(89, 93, 117, 0.09) 55%, transparent 55%, transparent 58%),
                          radial-gradient(circle at center, rgba(89, 93, 117, 0.05) 0%, rgba(89, 93, 117, 0.05) 65%, transparent 65%, transparent 68%),
                          #f3f4f6`,
            }}
          >
            {/* Contenedor del icono */}
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-white shadow-md group-hover:scale-105 transition-transform duration-300">
              <Package className="w-7 h-7" style={{ color: '#595D75' }} />
            </div>
          </div>
          <CardContent className="pl-5 flex-1 flex flex-col justify-between p-0">
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2 mt-2">
                <h3 className="font-bold text-lg text-gray-900 leading-tight">{objeto.nombre}</h3>
                <span className="inline-block text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2" style={{ backgroundColor: '#E3E4EA', color: '#595D75' }}>
                  Objeto
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                {objeto.descripcion || 'Sin descripción disponible'}
              </p>
            </div>
            <div className="flex items-center justify-between overflow-hidden">
              <span 
                className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${
                  objeto.estado === 'Disponible' 
                    ? 'border-green-500 text-green-700' 
                    : 'border-orange-500 text-orange-700'
                }`}
              >
                {objeto.estado}
              </span>
              {objeto.estado === 'En Mantenimiento' ? (
                <Button 
                  className="h-10 font-semibold transition-all duration-300 w-[140px] bg-gray-100 border border-gray-300 text-gray-500 overflow-hidden relative shadow-sm ml-3 p-0 cursor-not-allowed" 
                  disabled
                >
                  <div className="flex items-center justify-center gap-2 px-3">
                    <HugeiconsIcon icon={Calendar02Icon} size={20} className="text-gray-400 flex-shrink-0" />
                    <span className="whitespace-nowrap">No disponible</span>
                  </div>
                </Button>
              ) : (
                <Button 
                  className="group/btn h-10 font-semibold transition-all duration-300 w-10 hover:w-[140px] bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 overflow-hidden relative shadow-sm hover:shadow-md ml-3 p-0" 
                  onClick={() => handleReservarClick(objeto)}
                >
                  {/* Icono centrado cuando el botón está pequeño */}
                  <div className="absolute inset-0 flex items-center justify-center group-hover/btn:hidden">
                    <HugeiconsIcon icon={Calendar02Icon} size={20} className="text-gray-700" />
                  </div>
                  {/* Contenido cuando el botón está expandido */}
                  <div className="hidden items-center justify-center gap-2 group-hover/btn:flex px-3">
                    <HugeiconsIcon icon={Calendar02Icon} size={20} className="text-gray-700 flex-shrink-0" />
                    <span className="whitespace-nowrap">Reservar</span>
                  </div>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    ))
  }, [objetos])

  return (
    <>
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
                <BreadcrumbLink href="/dashboard">
                  Dashboard Propietario
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Reservas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Contenido con padding */}
        <div className="flex flex-1 flex-col gap-4 px-6 pt-6 pb-0 overflow-x-hidden">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
              <p className="text-gray-500 mt-1">
                Reserva recursos y objetos del condominio, y gestiona tus reservas activas.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList variant="line" className="h-auto bg-transparent p-0 border-b border-gray-200">
              <TabsTrigger 
                value="recursos" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:border-green-800"
              >
                <Package className="w-4 h-4" />
                Recursos
              </TabsTrigger>
              <TabsTrigger 
                value="mis-reservas" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:border-green-800"
              >
                <CalendarIcon className="w-4 h-4" />
                Mis Reservas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="recursos" className="mt-2 mb-0">
              {/* Sección de Zonas */}
              <div className="space-y-0.5 overflow-x-hidden">
                <div className="overflow-x-hidden">
                  <div className="mb-0.5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Zonas Comunes</h2>
                    <Separator className="bg-gray-200" />
                  </div>
                  {zonas.length > 0 ? (
                    <Carousel items={zonasCards} />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg py-12 px-6 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <MapPin className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        No hay zonas registradas
                      </p>
                      <p className="text-sm text-gray-500 text-center">
                        No hay zonas comunes disponibles para reservar
                      </p>
                    </div>
                  )}
                </div>

                {/* Sección de Objetos */}
                <div className="overflow-x-hidden">
                  <div className="mb-0.5">
                    <h2 className="text-lg font-semibold text-gray-900 mb-1">Equipos Disponibles</h2>
                    <Separator className="bg-gray-200" />
                  </div>
                  {objetos.length > 0 ? (
                    <Carousel items={objetosCards} />
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg py-12 px-6 flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Package className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-base font-semibold text-gray-900 mb-1">
                        No hay equipos registrados
                      </p>
                      <p className="text-sm text-gray-500 text-center">
                        No hay equipos disponibles para reservar
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mis-reservas" className="mt-6">
              <div className="space-y-4">
                {reservas.length === 0 ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg py-12 px-6 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <CalendarIcon className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-base font-semibold text-gray-900 mb-1">
                      No hay reservas registradas
                    </p>
                    <p className="text-sm text-gray-500 text-center">
                      No tienes reservas activas en este momento
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reservas.map((reserva) => {
                      const estadoColors = {
                        aprobada: 'bg-transparent text-green-700 border-green-300',
                        pendiente: 'bg-transparent text-yellow-700 border-yellow-300',
                        rechazada: 'bg-transparent text-red-700 border-red-300',
                      }

                      const estadoLabels = {
                        aprobada: 'Aprobada',
                        pendiente: 'Pendiente',
                        rechazada: 'Rechazada',
                      }

                      // Formatear hora en formato 12 horas
                      const formatearHora = (hora24: string) => {
                        const [hora, minutos] = hora24.split(':')
                        const horaNum = parseInt(hora)
                        const hora12 = horaNum === 0 ? 12 : horaNum > 12 ? horaNum - 12 : horaNum
                        const ampm = horaNum >= 12 ? 'PM' : 'AM'
                        return `${hora12}:${minutos} ${ampm}`
                      }

                      // Formatear fecha
                      const formatearFecha = (fecha: Date) => {
                        return fecha.toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        }).replace(/^\w/, c => c.toUpperCase())
                      }

                      // Obtener día y mes para mostrar grande
                      const obtenerDia = (fecha: Date) => {
                        return fecha.getDate()
                      }

                      const obtenerMes = (fecha: Date) => {
                        return fecha.toLocaleDateString('es-ES', { month: 'short' })
                      }

                      // Formatear fecha de creación
                      const formatearFechaCreacion = (fecha: Date) => {
                        return fecha.toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      }

                      return (
                        <Card key={reserva.id} className="border border-gray-200 bg-white transition-all duration-300 hover:shadow-md py-0 h-full flex flex-col">
                          <CardContent className="px-3 pt-3 pb-1 flex flex-row gap-3 flex-1 min-h-0">
                            {/* Fecha - estilo calendario */}
                            <div className="flex-shrink-0">
                              <div className="w-16 rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                {/* Mes en la parte superior */}
                                <div className="text-white text-center py-1" style={{ backgroundColor: '#4C6C5B' }}>
                                  <div className="text-xs font-semibold uppercase tracking-wider">
                                    {obtenerMes(reserva.fechaInicio)}
                                  </div>
                                </div>
                                {/* Día en la parte inferior */}
                                <div className="bg-white text-center py-2">
                                  <div className="text-3xl font-bold text-gray-900 leading-none">
                                    {obtenerDia(reserva.fechaInicio)}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Contenido de la tarjeta */}
                            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                              {/* Header con nombre del recurso */}
                              <div className="mb-2">
                                <h3 className="font-bold text-base text-gray-900 leading-tight mb-1.5 truncate">
                                  {reserva.recursoNombre}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                  <span 
                                    className="inline-block text-xs font-medium px-2 py-1 rounded-full"
                                    style={{ 
                                      backgroundColor: reserva.tipoRecurso === 'zona' ? '#F1E8D6' : '#E3E4EA',
                                      color: reserva.tipoRecurso === 'zona' ? '#A39170' : '#595D75'
                                    }}
                                  >
                                    {reserva.tipoRecurso === 'zona' ? 'Zona' : 'Objeto'}
                                  </span>
                                  <span 
                                    className={`inline-block text-xs font-medium px-2 py-1 rounded-full border ${estadoColors[reserva.estado]}`}
                                  >
                                    {estadoLabels[reserva.estado]}
                                  </span>
                                </div>
                                {/* Descripción del recurso */}
                                {(() => {
                                  const recurso = RECURSOS_MOCK.find(r => r.id === reserva.recursoId)
                                  return recurso?.descripcion ? (
                                    <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                      {recurso.descripcion}
                                    </p>
                                  ) : null
                                })()}
                              </div>

                              {/* Fecha y hora */}
                              <div className="space-y-1 mb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                  <span className="truncate">
                                    {formatearHora(reserva.horaInicio)} - {formatearHora(reserva.horaFin)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                  <span>
                                    {reserva.numeroInvitados} {reserva.numeroInvitados === 1 ? 'invitado' : 'invitados'}
                                  </span>
                                </div>
                              </div>

                              {/* Footer con fecha de creación y botones - siempre al final */}
                              <div className="pt-1.5 border-t border-gray-100 flex items-center justify-between mt-auto">
                                <p className="text-xs text-gray-500">
                                  Creada el {formatearFechaCreacion(reserva.fechaCreacion)}
                                </p>
                                <div className="flex items-center gap-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        aria-label="editar" 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7"
                                        disabled={reserva.estado === 'aprobada' || reserva.estado === 'rechazada'}
                                        onClick={() => {
                                          const recurso = RECURSOS_MOCK.find(r => r.id === reserva.recursoId)
                                          if (recurso) {
                                            setReservaEditando(reserva)
                                            setSelectedRecurso(recurso)
                                            setEditDate(new Date(reserva.fechaInicio))
                                            setEditHoraInicial(reserva.horaInicio)
                                            setEditHoraFinal(reserva.horaFin)
                                            setEditNumeroInvitados(reserva.numeroInvitados)
                                            setIsEditSheetOpen(true)
                                          }
                                        }}
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>
                                        {reserva.estado === 'aprobada' || reserva.estado === 'rechazada' 
                                          ? 'No se puede editar una reserva ' + (reserva.estado === 'aprobada' ? 'aprobada' : 'rechazada')
                                          : 'Editar'}
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <AlertDialog>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                          <Button 
                                            aria-label="eliminar" 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </AlertDialogTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Eliminar</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>¿Eliminar reserva?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Esta acción no se puede deshacer. Se eliminará permanentemente la reserva de <strong>{reserva.recursoNombre}</strong> para el día <strong>{formatearFecha(reserva.fechaInicio)}</strong> de <strong>{formatearHora(reserva.horaInicio)}</strong> a <strong>{formatearHora(reserva.horaFin)}</strong>.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => {
                                            setReservas(reservas.filter(r => r.id !== reserva.id))
                                          }}
                                          className="bg-red-600 hover:bg-red-700"
                                        >
                                          Eliminar
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sheet para crear reserva */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="right" 
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0"
          style={{ width: '500px', maxWidth: 'none' }}
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-xl font-semibold">Nueva Reserva</SheetTitle>
          </SheetHeader>

          {selectedRecurso && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-6 pt-0 pb-4">
                {/* Información del recurso */}
                <Card className="border border-gray-200 bg-white p-3 rounded-2xl">
                  <div className="flex flex-row gap-4">
                    {/* Contenedor izquierdo con círculos concéntricos */}
                    <div 
                      className="flex-shrink-0 w-20 flex items-center justify-center relative rounded-xl"
                      style={{
                        background: selectedRecurso.tipo === 'zona'
                          ? `radial-gradient(circle at center, rgba(163, 145, 112, 0.28) 0%, rgba(163, 145, 112, 0.28) 15%, transparent 15%, transparent 18%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.22) 0%, rgba(163, 145, 112, 0.22) 25%, transparent 25%, transparent 28%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.18) 0%, rgba(163, 145, 112, 0.18) 35%, transparent 35%, transparent 38%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.14) 0%, rgba(163, 145, 112, 0.14) 45%, transparent 45%, transparent 48%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.09) 0%, rgba(163, 145, 112, 0.09) 55%, transparent 55%, transparent 58%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.05) 0%, rgba(163, 145, 112, 0.05) 65%, transparent 65%, transparent 68%),
                             #f3f4f6`
                          : `radial-gradient(circle at center, rgba(89, 93, 117, 0.28) 0%, rgba(89, 93, 117, 0.28) 15%, transparent 15%, transparent 18%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.22) 0%, rgba(89, 93, 117, 0.22) 25%, transparent 25%, transparent 28%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.18) 0%, rgba(89, 93, 117, 0.18) 35%, transparent 35%, transparent 38%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.14) 0%, rgba(89, 93, 117, 0.14) 45%, transparent 45%, transparent 48%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.09) 0%, rgba(89, 93, 117, 0.09) 55%, transparent 55%, transparent 58%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.05) 0%, rgba(89, 93, 117, 0.05) 65%, transparent 65%, transparent 68%),
                             #f3f4f6`,
                      }}
                    >
                      {/* Contenedor del icono */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md">
                        {selectedRecurso.tipo === 'zona' ? (
                          <MapPin className="w-6 h-6" style={{ color: '#A39170' }} />
                        ) : (
                          <Package className="w-6 h-6" style={{ color: '#595D75' }} />
                        )}
                      </div>
                    </div>
                    {/* Contenido */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between mb-1.5">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{selectedRecurso.nombre}</h3>
                        <span 
                          className="inline-block text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2"
                          style={{ 
                            backgroundColor: selectedRecurso.tipo === 'zona' ? '#F1E8D6' : '#E3E4EA',
                            color: selectedRecurso.tipo === 'zona' ? '#A39170' : '#595D75'
                          }}
                        >
                          {selectedRecurso.tipo === 'zona' ? 'Zona' : 'Objeto'}
                        </span>
                      </div>
                      {/* Información de la reserva */}
                      <div className="space-y-1 mt-1">
                        {selectedDate && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <p className="text-sm text-gray-700 font-medium">
                              {selectedDate.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              }).replace(/^\w/, c => c.toUpperCase())}
                            </p>
                          </div>
                        )}
                        {horaInicial && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                              {horas.find(h => h.value === horaInicial)?.label || horaInicial}
                              {horaFinal && ` - ${horas.find(h => h.value === horaFinal)?.label || horaFinal}`}
                            </p>
                          </div>
                        )}
                        {!selectedDate && !horaInicial && (
                          <p className="text-sm text-gray-400 italic">
                            Selecciona el día y hora para tu reserva
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                <Separator className="my-3" />

                {/* Calendario */}
                <div className="space-y-2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      // Calcular la fecha mínima permitida (hoy + 3 días)
                      const minDate = new Date(today)
                      minDate.setDate(today.getDate() + 3)
                      minDate.setHours(0, 0, 0, 0)
                      const checkDate = new Date(date)
                      checkDate.setHours(0, 0, 0, 0)
                      // Deshabilitar fechas pasadas y fechas con menos de 3 días de antelación
                      return checkDate.getTime() < minDate.getTime()
                    }}
                    className="rounded-lg border w-full"
                    classNames={{
                      day_button: cn(
                        'cursor-pointer relative flex items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground transition-200',
                        'group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow]',
                        'group-[[data-selected]:not(.range-middle)]:duration-150',
                        'group-data-disabled:pointer-events-none focus-visible:z-10',
                        'hover:not-in-data-selected:bg-accent group-data-selected:bg-primary',
                        'hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground',
                        'group-data-disabled:text-foreground/30 group-data-disabled:line-through',
                        'group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground',
                        'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'size-12 md:size-14'
                      ),
                      day: 'group size-12 md:size-14 px-0 py-px text-sm',
                      weekday: 'size-12 md:size-14 p-0 text-xs font-medium text-muted-foreground/80',
                    }}
                  />
                </div>

                {/* Horas */}
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <HoraCombobox
                      horas={horas}
                      value={horaInicial}
                      onChange={setHoraInicial}
                      placeholder="Selecciona hora"
                      disabled={!selectedDate}
                      horasOcupadas={horasOcupadas}
                      label="Hora Inicial"
                    />

                    <HoraCombobox
                      horas={horasFinalDisponibles}
                      value={horaFinal}
                      onChange={setHoraFinal}
                      placeholder="Selecciona hora"
                      disabled={!horaInicial || !selectedDate}
                      horasOcupadas={horasOcupadas}
                      label="Hora Final"
                    />
                  </div>
                </div>

                {/* Número de invitados */}
                <div className="mt-4">
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Invitados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setNumeroInvitados(prev => Math.max(1, prev - 1))}
                        disabled={numeroInvitados <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                        {numeroInvitados}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setNumeroInvitados(prev => prev + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con botones */}
              <div className="border-t px-6 py-4 bg-gray-50">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsSheetOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => {
                      setOpenDialogConfirmacion(true)
                    }}
                    disabled={!selectedDate || !horaInicial || !horaFinal}
                    className="flex-1"
                  >
                    Confirmar Reserva
                  </Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Sheet de Edición */}
      <Sheet open={isEditSheetOpen} onOpenChange={(open) => {
        setIsEditSheetOpen(open)
        if (!open) {
          // Limpiar estados al cerrar
          setReservaEditando(null)
          setSelectedRecurso(null)
          setEditDate(undefined)
          setEditHoraInicial('')
          setEditHoraFinal('')
          setEditNumeroInvitados(1)
        }
      }}>
        <SheetContent 
          side="right" 
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0"
          style={{ width: '500px', maxWidth: 'none' }}
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-xl font-semibold">Editar Reserva</SheetTitle>
          </SheetHeader>

          {selectedRecurso && reservaEditando && (
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto px-6 pt-0 pb-4">
                {/* Información del recurso */}
                <Card className="border border-gray-200 bg-white p-3 rounded-2xl">
                  <div className="flex flex-row gap-4">
                    {/* Contenedor izquierdo con círculos concéntricos */}
                    <div 
                      className="flex-shrink-0 w-20 flex items-center justify-center relative rounded-xl"
                      style={{
                        background: selectedRecurso.tipo === 'zona'
                          ? `radial-gradient(circle at center, rgba(163, 145, 112, 0.28) 0%, rgba(163, 145, 112, 0.28) 15%, transparent 15%, transparent 18%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.22) 0%, rgba(163, 145, 112, 0.22) 25%, transparent 25%, transparent 28%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.18) 0%, rgba(163, 145, 112, 0.18) 35%, transparent 35%, transparent 38%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.14) 0%, rgba(163, 145, 112, 0.14) 45%, transparent 45%, transparent 48%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.09) 0%, rgba(163, 145, 112, 0.09) 55%, transparent 55%, transparent 58%),
                             radial-gradient(circle at center, rgba(163, 145, 112, 0.05) 0%, rgba(163, 145, 112, 0.05) 65%, transparent 65%, transparent 68%),
                             #f3f4f6`
                          : `radial-gradient(circle at center, rgba(89, 93, 117, 0.28) 0%, rgba(89, 93, 117, 0.28) 15%, transparent 15%, transparent 18%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.22) 0%, rgba(89, 93, 117, 0.22) 25%, transparent 25%, transparent 28%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.18) 0%, rgba(89, 93, 117, 0.18) 35%, transparent 35%, transparent 38%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.14) 0%, rgba(89, 93, 117, 0.14) 45%, transparent 45%, transparent 48%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.09) 0%, rgba(89, 93, 117, 0.09) 55%, transparent 55%, transparent 58%),
                             radial-gradient(circle at center, rgba(89, 93, 117, 0.05) 0%, rgba(89, 93, 117, 0.05) 65%, transparent 65%, transparent 68%),
                             #f3f4f6`,
                      }}
                    >
                      {/* Contenedor del icono */}
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-md">
                        {selectedRecurso.tipo === 'zona' ? (
                          <MapPin className="w-6 h-6" style={{ color: '#A39170' }} />
                        ) : (
                          <Package className="w-6 h-6" style={{ color: '#595D75' }} />
                        )}
                      </div>
                    </div>
                    {/* Contenido */}
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex items-start justify-between mb-1.5">
                        <h3 className="font-bold text-lg text-gray-900 leading-tight">{selectedRecurso.nombre}</h3>
                        <span 
                          className="inline-block text-xs font-medium px-2 py-1 rounded-full flex-shrink-0 ml-2"
                          style={{ 
                            backgroundColor: selectedRecurso.tipo === 'zona' ? '#F1E8D6' : '#E3E4EA',
                            color: selectedRecurso.tipo === 'zona' ? '#A39170' : '#595D75'
                          }}
                        >
                          {selectedRecurso.tipo === 'zona' ? 'Zona' : 'Objeto'}
                        </span>
                      </div>
                      {/* Información de la reserva */}
                      <div className="space-y-1 mt-1">
                        {editDate && (
                          <div className="flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <p className="text-sm text-gray-700 font-medium">
                              {editDate.toLocaleDateString('es-ES', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              }).replace(/^\w/, c => c.toUpperCase())}
                            </p>
                          </div>
                        )}
                        {editHoraInicial && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-600 flex-shrink-0" />
                            <p className="text-sm text-gray-600">
                              {horas.find(h => h.value === editHoraInicial)?.label || editHoraInicial}
                              {editHoraFinal && ` - ${horas.find(h => h.value === editHoraFinal)?.label || editHoraFinal}`}
                            </p>
                          </div>
                        )}
                        {!editDate && !editHoraInicial && (
                          <p className="text-sm text-gray-400 italic">
                            Selecciona el día y hora para tu reserva
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>

                <Separator className="my-3" />

                {/* Calendario */}
                <div className="space-y-2">
                  <Calendar
                    mode="single"
                    selected={editDate}
                    onSelect={setEditDate}
                    disabled={(date) => {
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      // Calcular la fecha mínima permitida (hoy + 3 días)
                      const minDate = new Date(today)
                      minDate.setDate(today.getDate() + 3)
                      minDate.setHours(0, 0, 0, 0)
                      const checkDate = new Date(date)
                      checkDate.setHours(0, 0, 0, 0)
                      // Deshabilitar fechas pasadas y fechas con menos de 3 días de antelación
                      return checkDate.getTime() < minDate.getTime()
                    }}
                    className="rounded-lg border w-full"
                    classNames={{
                      day_button: cn(
                        'cursor-pointer relative flex items-center justify-center whitespace-nowrap rounded-md p-0 text-foreground transition-200',
                        'group-[[data-selected]:not(.range-middle)]:[transition-property:color,background-color,border-radius,box-shadow]',
                        'group-[[data-selected]:not(.range-middle)]:duration-150',
                        'group-data-disabled:pointer-events-none focus-visible:z-10',
                        'hover:not-in-data-selected:bg-accent group-data-selected:bg-primary',
                        'hover:not-in-data-selected:text-foreground group-data-selected:text-primary-foreground',
                        'group-data-disabled:text-foreground/30 group-data-disabled:line-through',
                        'group-data-outside:text-foreground/30 group-data-selected:group-data-outside:text-primary-foreground',
                        'outline-none focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'size-12 md:size-14'
                      ),
                      day: 'group size-12 md:size-14 px-0 py-px text-sm',
                      weekday: 'size-12 md:size-14 p-0 text-xs font-medium text-muted-foreground/80',
                    }}
                  />
                </div>

                {/* Horas */}
                <div className="mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <HoraCombobox
                      horas={horas}
                      value={editHoraInicial}
                      onChange={setEditHoraInicial}
                      placeholder="Selecciona hora"
                      disabled={!editDate}
                      horasOcupadas={horasOcupadasEdit}
                      label="Hora Inicial"
                    />

                    <HoraCombobox
                      horas={horasFinalDisponiblesEdit}
                      value={editHoraFinal}
                      onChange={setEditHoraFinal}
                      placeholder="Selecciona hora"
                      disabled={!editHoraInicial || !editDate}
                      horasOcupadas={horasOcupadasEdit}
                      label="Hora Final"
                    />
                  </div>
                </div>

                {/* Número de invitados */}
                <div className="mt-4">
                  <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                        <User className="w-5 h-5 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Invitados</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setEditNumeroInvitados(prev => Math.max(1, prev - 1))}
                        disabled={editNumeroInvitados <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                        {editNumeroInvitados}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                        onClick={() => setEditNumeroInvitados(prev => prev + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con botones */}
              <div className="border-t px-6 py-4 bg-gray-50">
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditSheetOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        disabled={!editDate || !editHoraInicial || !editHoraFinal}
                        className="flex-1"
                      >
                        Guardar Cambios
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar Cambios de Reserva</AlertDialogTitle>
                        <AlertDialogDescription>
                          Por favor, revisa los detalles actualizados de tu reserva antes de confirmar.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      
                      {selectedRecurso && editDate && editHoraInicial && editHoraFinal && (
                        <div className="space-y-4 py-4">
                          {/* Información del Recurso */}
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                              {selectedRecurso.tipo === 'zona' ? (
                                <MapPin className="w-5 h-5" style={{ color: '#A39170' }} />
                              ) : (
                                <Package className="w-5 h-5" style={{ color: '#595D75' }} />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{selectedRecurso.nombre}</p>
                              <p className="text-xs text-gray-500 mt-1">{selectedRecurso.descripcion}</p>
                            </div>
                          </div>

                          {/* Fecha */}
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <CalendarIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {editDate.toLocaleDateString('es-ES', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                }).replace(/^\w/, c => c.toUpperCase())}
                              </p>
                            </div>
                          </div>

                          {/* Horas */}
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {horas.find(h => h.value === editHoraInicial)?.label || editHoraInicial}
                                {' - '}
                                {horas.find(h => h.value === editHoraFinal)?.label || editHoraFinal}
                              </p>
                            </div>
                          </div>

                          {/* Número de Invitados */}
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {editNumeroInvitados} {editNumeroInvitados === 1 ? 'invitado' : 'invitados'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            if (reservaEditando && editDate && editHoraInicial && editHoraFinal) {
                              // Actualizar la reserva
                              setReservas(prev => prev.map(r => 
                                r.id === reservaEditando.id 
                                  ? {
                                      ...r,
                                      fechaInicio: editDate,
                                      fechaFin: editDate,
                                      horaInicio: editHoraInicial,
                                      horaFin: editHoraFinal,
                                      numeroInvitados: editNumeroInvitados
                                    }
                                  : r
                              ))
                              setIsEditSheetOpen(false)
                              setReservaEditando(null)
                              // TODO: Aquí iría la llamada a la API para actualizar la reserva
                            }
                          }}
                        >
                          Confirmar Cambios
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Dialog de Confirmación */}
      <Dialog open={openDialogConfirmacion} onOpenChange={setOpenDialogConfirmacion}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Reserva</DialogTitle>
            <DialogDescription>
              Por favor, revisa los detalles de tu reserva antes de confirmar.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRecurso && selectedDate && horaInicial && horaFinal && (
            <div className="space-y-4 py-4">
              {/* Información del Recurso */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                  {selectedRecurso.tipo === 'zona' ? (
                    <MapPin className="w-5 h-5" style={{ color: '#A39170' }} />
                  ) : (
                    <Package className="w-5 h-5" style={{ color: '#595D75' }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{selectedRecurso.nombre}</p>
                  <p className="text-xs text-gray-500 mt-1">{selectedRecurso.descripcion}</p>
                </div>
              </div>

              {/* Fecha */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedDate.toLocaleDateString('es-ES', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }).replace(/^\w/, c => c.toUpperCase())}
                  </p>
                </div>
              </div>

              {/* Horas */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {horas.find(h => h.value === horaInicial)?.label || horaInicial}
                    {' - '}
                    {horas.find(h => h.value === horaFinal)?.label || horaFinal}
                  </p>
                </div>
              </div>

              {/* Número de Invitados */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {numeroInvitados} {numeroInvitados === 1 ? 'invitado' : 'invitados'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialogConfirmacion(false)}
            >
              Cancelar
            </Button>
            <Button 
              onClick={() => {
                // TODO: Implementar lógica de reserva
                setOpenDialogConfirmacion(false)
                setIsSheetOpen(false)
                // Aquí iría la llamada a la API para crear la reserva
              }}
            >
              Confirmar Reserva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  )
}

