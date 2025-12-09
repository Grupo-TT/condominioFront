'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import { MoreVertical, Search, X, Plus, Calendar as CalendarIcon, Pencil, Trash2, Eye, Info } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Wrench01Icon, Alert02Icon, NotificationCircleIcon, IdeaIcon, Delete02Icon } from '@hugeicons/core-free-icons'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetTitle,
} from '@/components/ui/sheet'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Command,
    CommandCheck,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { TabSliderIndicator } from '@/components/ui/tab-slider-indicator'
import { DatePicker } from '@/components/ui/date-picker'
import { Solicitud, Trabajador } from '@/types/solicitud.types'


// Mock data for owner solicitudes (subset of admin mock data - only this owner's solicitudes)
const misSolicitudesData: Solicitud[] = [
    {
        id: '1',
        casaId: '1',
        numeroCasa: '15',
        propietario: 'Jose Pérez Hurtado',
        titulo: 'Solicitud de reparación en tubería principal',
        tipo: 'reparacion-locativa',
        fecha: '2024-02-10',
        estado: 'pendiente',
        descripcion: 'Se ha detectado una fuga de agua significativa en la tubería principal del segundo piso, específicamente en el área del baño principal.',
        tipoObra: 'Hidráulica',
        fechaInicio: '2024-02-15',
        fechaFinalizacion: '2024-02-20',
        trabajadores: [
            { nombre: 'Juan Carlos Pérez', documento: '1023456789', arl: 'SURA' },
            { nombre: 'Roberto Martínez', documento: '1034567890', arl: 'POSITIVA' }
        ]
    },
    {
        id: '4',
        casaId: '1',
        numeroCasa: '15',
        propietario: 'Jose Pérez Hurtado',
        titulo: 'Sugerencia para mejoras en áreas comunes',
        tipo: 'sugerencia',
        fecha: '2024-02-20',
        estado: 'pendiente',
        descripcion: 'Propuesta para mejorar la iluminación y el mantenimiento de las áreas verdes del conjunto residencial.'
    },
    {
        id: '8',
        casaId: '1',
        numeroCasa: '15',
        propietario: 'Jose Pérez Hurtado',
        titulo: 'Queja por ruido excesivo del vecino',
        tipo: 'queja',
        fecha: '2024-01-28',
        estado: 'revisada',
        descripcion: 'Reporto que el vecino de la casa 16 genera ruidos excesivos durante horas de la noche, afectando el descanso de mi familia.'
    },
    {
        id: '10',
        casaId: '1',
        numeroCasa: '15',
        propietario: 'Jose Pérez Hurtado',
        titulo: 'Petición para instalación de parqueadero de bicicletas',
        tipo: 'peticion',
        fecha: '2024-01-10',
        estado: 'aprobada',
        descripcion: 'Solicito la instalación de un parqueadero de bicicletas cerca de la entrada principal del conjunto para fomentar el uso de transporte ecológico.'
    },
    {
        id: '12',
        casaId: '1',
        numeroCasa: '15',
        propietario: 'Jose Pérez Hurtado',
        titulo: 'Reparación de ventana dañada',
        tipo: 'reparacion-locativa',
        fecha: '2024-01-05',
        estado: 'rechazada',
        descripcion: 'Solicito la reparación de la ventana del tercer piso que presenta daños por humedad.',
        tipoObra: 'Obra blanca'
    }
]

export default function SolicitudesPropietarioPage() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'todas' | 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia'>('todas')
    const [estadoFilter, setEstadoFilter] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada' | 'revisada'>('todas')
    const [tipoComboboxOpen, setTipoComboboxOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Sheet states
    const [isCreateSheetOpen, setIsCreateSheetOpen] = useState(false)
    const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
    const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
    const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)

    // Delete dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [solicitudToDelete, setSolicitudToDelete] = useState<Solicitud | null>(null)

    // Form states
    const [formTipo, setFormTipo] = useState<Solicitud['tipo']>('peticion')
    const [formTitulo, setFormTitulo] = useState('')
    const [formDescripcion, setFormDescripcion] = useState('')

    // Reparación locativa form states
    const [formTipoObra, setFormTipoObra] = useState<Solicitud['tipoObra']>('Obra blanca')
    const [formTipoObraOtra, setFormTipoObraOtra] = useState('')
    const [formFechaInicio, setFormFechaInicio] = useState<Date | undefined>(undefined)
    const [formFechaFinalizacion, setFormFechaFinalizacion] = useState<Date | undefined>(undefined)
    const [formTrabajadores, setFormTrabajadores] = useState<Trabajador[]>([])
    const [newTrabajadorNombre, setNewTrabajadorNombre] = useState('')
    const [newTrabajadorDocumento, setNewTrabajadorDocumento] = useState('')
    const [newTrabajadorArl, setNewTrabajadorArl] = useState('')

    // Data state
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>(misSolicitudesData)

    const handleClearSearch = useCallback(() => {
        setSearchTerm('')
        if (searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [])

    const handleOpenCreate = useCallback(() => {
        setFormTipo('peticion')
        setFormTitulo('')
        setFormDescripcion('')
        // Reset reparación locativa fields
        setFormTipoObra('Obra blanca')
        setFormTipoObraOtra('')
        setFormFechaInicio(undefined)
        setFormFechaFinalizacion(undefined)
        setFormTrabajadores([])
        setNewTrabajadorNombre('')
        setNewTrabajadorDocumento('')
        setNewTrabajadorArl('')
        setIsCreateSheetOpen(true)
    }, [])

    const handleViewDetail = useCallback((solicitud: Solicitud) => {
        setSelectedSolicitud(solicitud)
        setIsDetailSheetOpen(true)
    }, [])

    const handleOpenEdit = useCallback((solicitud: Solicitud) => {
        setSelectedSolicitud(solicitud)
        setFormTipo(solicitud.tipo)
        setFormTitulo(solicitud.titulo)
        setFormDescripcion(solicitud.descripcion || '')
        // Set reparación locativa fields
        const tipoObra = solicitud.tipoObra || 'Obra blanca'
        const tiposConocidos = ['Eléctrica', 'Hidráulica', 'Alturas (superior a 1.50m)', 'Obra blanca', 'Obra gris']
        if (tiposConocidos.includes(tipoObra)) {
            setFormTipoObra(tipoObra as Solicitud['tipoObra'])
            setFormTipoObraOtra('')
        } else {
            setFormTipoObra('Otra')
            setFormTipoObraOtra(tipoObra)
        }
        setFormFechaInicio(solicitud.fechaInicio ? new Date(solicitud.fechaInicio) : undefined)
        setFormFechaFinalizacion(solicitud.fechaFinalizacion ? new Date(solicitud.fechaFinalizacion) : undefined)
        setFormTrabajadores(solicitud.trabajadores || [])
        setNewTrabajadorNombre('')
        setNewTrabajadorDocumento('')
        setNewTrabajadorArl('')
        setIsEditSheetOpen(true)
    }, [])

    const handleDelete = useCallback((solicitud: Solicitud) => {
        setSolicitudToDelete(solicitud)
        setShowDeleteDialog(true)
    }, [])

    const confirmDelete = useCallback(() => {
        if (solicitudToDelete) {
            setSolicitudes(prev => prev.filter(s => s.id !== solicitudToDelete.id))
            setShowDeleteDialog(false)
            setSolicitudToDelete(null)
        }
    }, [solicitudToDelete])

    // Trabajador management functions
    const handleAddTrabajador = useCallback(() => {
        if (newTrabajadorNombre.trim() && newTrabajadorDocumento.trim() && newTrabajadorArl.trim()) {
            setFormTrabajadores(prev => [...prev, {
                nombre: newTrabajadorNombre.trim(),
                documento: newTrabajadorDocumento.trim(),
                arl: newTrabajadorArl.trim()
            }])
            setNewTrabajadorNombre('')
            setNewTrabajadorDocumento('')
            setNewTrabajadorArl('')
        }
    }, [newTrabajadorNombre, newTrabajadorDocumento, newTrabajadorArl])

    const handleRemoveTrabajador = useCallback((index: number) => {
        setFormTrabajadores(prev => prev.filter((_, i) => i !== index))
    }, [])

    const handleCreateSubmit = useCallback(() => {
        const newSolicitud: Solicitud = {
            id: String(Date.now()),
            casaId: '1',
            numeroCasa: '15',
            propietario: 'Jose Pérez Hurtado',
            titulo: formTitulo,
            tipo: formTipo,
            fecha: new Date().toISOString().split('T')[0],
            estado: 'pendiente',
            descripcion: formDescripcion,
            // Campos de reparación locativa (solo si es ese tipo)
            ...(formTipo === 'reparacion-locativa' && {
                tipoObra: formTipoObra === 'Otra' ? formTipoObraOtra : formTipoObra,
                fechaInicio: formFechaInicio?.toISOString().split('T')[0],
                fechaFinalizacion: formFechaFinalizacion?.toISOString().split('T')[0],
                trabajadores: formTrabajadores
            })
        }
        setSolicitudes(prev => [newSolicitud, ...prev])
        setIsCreateSheetOpen(false)
    }, [formTitulo, formTipo, formDescripcion, formTipoObra, formTipoObraOtra, formFechaInicio, formFechaFinalizacion, formTrabajadores])

    const handleEditSubmit = useCallback(() => {
        if (selectedSolicitud) {
            setSolicitudes(prev => prev.map(s =>
                s.id === selectedSolicitud.id
                    ? {
                        ...s,
                        titulo: formTitulo,
                        tipo: formTipo,
                        descripcion: formDescripcion,
                        // Campos de reparación locativa (solo si es ese tipo)
                        ...(formTipo === 'reparacion-locativa' ? {
                            tipoObra: formTipoObra === 'Otra' ? formTipoObraOtra : formTipoObra,
                            fechaInicio: formFechaInicio?.toISOString().split('T')[0],
                            fechaFinalizacion: formFechaFinalizacion?.toISOString().split('T')[0],
                            trabajadores: formTrabajadores
                        } : {
                            tipoObra: undefined,
                            fechaInicio: undefined,
                            fechaFinalizacion: undefined,
                            trabajadores: undefined
                        })
                    }
                    : s
            ))
            setIsEditSheetOpen(false)
            setSelectedSolicitud(null)
        }
    }, [selectedSolicitud, formTitulo, formTipo, formDescripcion, formTipoObra, formTipoObraOtra, formFechaInicio, formFechaFinalizacion, formTrabajadores])

    // Filtrar datos basándose en el término de búsqueda, tipo y estado
    const filteredSolicitudes = useMemo(() => {
        const searchLower = searchTerm.toLowerCase()

        return solicitudes.filter(solicitud => {
            // Filtrar por tipo
            if (filterType !== 'todas' && solicitud.tipo !== filterType) {
                return false
            }

            // Filtrar por estado
            if (estadoFilter !== 'todas' && solicitud.estado !== estadoFilter) {
                return false
            }

            // Filtrar por término de búsqueda
            if (searchTerm) {
                return (
                    solicitud.titulo.toLowerCase().includes(searchLower) ||
                    (solicitud.descripcion && solicitud.descripcion.toLowerCase().includes(searchLower))
                )
            }

            return true
        })
    }, [searchTerm, filterType, estadoFilter, solicitudes])

    // Verificar si hay resultados
    const hasResults = filteredSolicitudes.length > 0

    // Función para obtener el nombre del tipo
    const getTipoNombre = (tipo: Solicitud['tipo']) => {
        const tipos: Record<Solicitud['tipo'], string> = {
            'reparacion-locativa': 'Reparación Locativa',
            'queja': 'Queja',
            'peticion': 'Petición',
            'sugerencia': 'Sugerencia',
        }
        return tipos[tipo] || tipo
    }

    // Función para obtener la definición de cada tipo
    const getTipoDefinicion = useCallback((tipo: Solicitud['tipo']) => {
        const definiciones: Record<Solicitud['tipo'], string> = {
            'peticion': 'Solicitudes formales para pedir información, ayuda o algún servicio por parte de la administración.',
            'queja': 'Comunica inconformidades o molestias relacionadas con servicios, normas o comportamientos dentro del condominio que requieran intervención de la administración.',
            'sugerencia': 'Propuestas o ideas para mejorar procesos, servicios, espacios o la convivencia en el condominio.',
            'reparacion-locativa': 'Notificación para informar a la administración que se realizarán trabajos o arreglos en la vivienda que involucran terceros (obreros/contratistas).',
        }
        return definiciones[tipo]
    }, [])

    const getTipoIcono = useCallback((tipo: Solicitud['tipo']) => {
        const iconos: Record<Solicitud['tipo'], typeof Wrench01Icon> = {
            'reparacion-locativa': Wrench01Icon,
            'queja': Alert02Icon,
            'peticion': NotificationCircleIcon,
            'sugerencia': IdeaIcon,
        }
        return iconos[tipo]
    }, [])

    const getTipoColor = useCallback((tipo: Solicitud['tipo']) => {
        const tipoColors: Record<Solicitud['tipo'], { bg: string; text: string; border: string }> = {
            'reparacion-locativa': {
                bg: '#E3E4EA',
                text: '#595D75',
                border: '#595D75'
            },
            'queja': {
                bg: '#F1E8D6',
                text: '#A39170',
                border: '#A39170'
            },
            'peticion': {
                bg: '#E6EFEA',
                text: '#4C6C5A',
                border: '#4C6C5A'
            },
            'sugerencia': {
                bg: '#E6EFEA',
                text: '#4C6C5A',
                border: '#4C6C5A'
            }
        }
        return tipoColors[tipo]
    }, [])

    const getEstadoBadge = (estado: Solicitud['estado']) => {
        let badgeVariant: 'success' | 'destructive' | 'warning' = 'warning'
        let dotColor = 'bg-yellow-500'
        let estadoTexto = 'Pendiente'
        let badgeClassName = 'gap-1.5'

        if (estado === 'aprobada') {
            badgeVariant = 'success'
            dotColor = 'bg-green-500'
            estadoTexto = 'Aprobada'
        } else if (estado === 'rechazada') {
            badgeVariant = 'destructive'
            dotColor = 'bg-red-500'
            estadoTexto = 'Rechazada'
        } else if (estado === 'revisada') {
            badgeVariant = 'warning'
            dotColor = 'bg-blue-500'
            estadoTexto = 'Revisada'
            badgeClassName = 'gap-1.5 text-blue-700 bg-blue-50 border-blue-200'
        }

        return (
            <Badge
                variant={badgeVariant}
                appearance="outline"
                size="sm"
                className={badgeClassName}
            >
                <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                {estadoTexto}
            </Badge>
        )
    }

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
                                <BreadcrumbPage>Solicitudes</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </header>
            <div className="flex flex-1 flex-col">
                {/* Contenido con padding */}
                <div className="flex flex-1 flex-col gap-6 p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Mis Solicitudes</h1>
                            <p className="text-gray-500 mt-1">
                                Envía y gestiona tus peticiones, quejas, sugerencias y solicitudes de reparación locativa al condominio.
                            </p>
                        </div>
                    </div>

                    {/* Filtros y controles */}
                    <Tabs value={estadoFilter} onValueChange={(v) => setEstadoFilter(v as typeof estadoFilter)} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <TabsList className="relative [&_[data-state=active]]:bg-transparent [&_[data-state=active]]:shadow-none [&_[role=tab]]:relative [&_[role=tab]]:z-10">
                                <TabSliderIndicator activeTab={estadoFilter} />
                                <TabsTrigger value="todas" data-tab-value="todas">Todas</TabsTrigger>
                                <TabsTrigger value="pendiente" data-tab-value="pendiente">Pendientes</TabsTrigger>
                                <TabsTrigger value="aprobada" data-tab-value="aprobada">Aprobadas</TabsTrigger>
                                <TabsTrigger value="rechazada" data-tab-value="rechazada">Rechazadas</TabsTrigger>
                                <TabsTrigger value="revisada" data-tab-value="revisada">Revisadas</TabsTrigger>
                            </TabsList>
                            <div className="flex items-center gap-3">
                                <Popover open={tipoComboboxOpen} onOpenChange={setTipoComboboxOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            mode="input"
                                            placeholder={filterType === 'todas'}
                                            className="w-[200px] h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                                        >
                                            {filterType !== 'todas' ? (
                                                <span className="flex items-center gap-2.5">
                                                    <HugeiconsIcon
                                                        icon={getTipoIcono(filterType)}
                                                        size={14}
                                                        style={{ color: getTipoColor(filterType).text }}
                                                    />
                                                    <span className="truncate">
                                                        {getTipoNombre(filterType)}
                                                    </span>
                                                </span>
                                            ) : (
                                                <span>Filtrar por tipo</span>
                                            )}
                                            <ButtonArrow />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar tipo..." />
                                            <CommandList>
                                                <CommandEmpty>No se encontró tipo.</CommandEmpty>
                                                <CommandGroup>
                                                    <CommandItem
                                                        value="todas"
                                                        onSelect={() => {
                                                            setFilterType('todas')
                                                            setTipoComboboxOpen(false)
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2.5">
                                                            <span className="ms-1 size-1.5 rounded-full bg-gray-400"></span>
                                                            <span className="truncate">Todas</span>
                                                        </span>
                                                        {filterType === 'todas' && <CommandCheck />}
                                                    </CommandItem>
                                                    <CommandItem
                                                        value="reparacion-locativa"
                                                        onSelect={() => {
                                                            setFilterType('reparacion-locativa')
                                                            setTipoComboboxOpen(false)
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2.5">
                                                            <HugeiconsIcon icon={Wrench01Icon} size={14} style={{ color: '#595D75' }} />
                                                            <span className="truncate">Reparación Locativa</span>
                                                        </span>
                                                        {filterType === 'reparacion-locativa' && <CommandCheck />}
                                                    </CommandItem>
                                                    <CommandItem
                                                        value="queja"
                                                        onSelect={() => {
                                                            setFilterType('queja')
                                                            setTipoComboboxOpen(false)
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2.5">
                                                            <HugeiconsIcon icon={Alert02Icon} size={14} style={{ color: '#A39170' }} />
                                                            <span className="truncate">Queja</span>
                                                        </span>
                                                        {filterType === 'queja' && <CommandCheck />}
                                                    </CommandItem>
                                                    <CommandItem
                                                        value="peticion"
                                                        onSelect={() => {
                                                            setFilterType('peticion')
                                                            setTipoComboboxOpen(false)
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2.5">
                                                            <HugeiconsIcon icon={NotificationCircleIcon} size={14} style={{ color: '#4C6C5A' }} />
                                                            <span className="truncate">Petición</span>
                                                        </span>
                                                        {filterType === 'peticion' && <CommandCheck />}
                                                    </CommandItem>
                                                    <CommandItem
                                                        value="sugerencia"
                                                        onSelect={() => {
                                                            setFilterType('sugerencia')
                                                            setTipoComboboxOpen(false)
                                                        }}
                                                    >
                                                        <span className="flex items-center gap-2.5">
                                                            <HugeiconsIcon icon={IdeaIcon} size={14} style={{ color: '#4C6C5A' }} />
                                                            <span className="truncate">Sugerencia</span>
                                                        </span>
                                                        {filterType === 'sugerencia' && <CommandCheck />}
                                                    </CommandItem>
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <div className="relative w-80">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <Input
                                        placeholder="Buscar solicitudes..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10 pr-10 h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                                        ref={searchInputRef}
                                    />
                                    {searchTerm !== '' && (
                                        <Button
                                            onClick={handleClearSearch}
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-full"
                                        >
                                            <X size={16} className="text-gray-500" />
                                        </Button>
                                    )}
                                </div>
                                <Button onClick={handleOpenCreate}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Nueva Solicitud
                                </Button>
                            </div>
                        </div>

                        {/* Cards Grid */}
                        {['todas', 'pendiente', 'aprobada', 'rechazada', 'revisada'].map((tabValue) => (
                            <TabsContent key={tabValue} value={tabValue}>
                                {hasResults ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {filteredSolicitudes.map((solicitud) => (
                                            <Card
                                                key={solicitud.id}
                                                className="border transition-all duration-300 hover:shadow-md py-0 h-full flex flex-col"
                                                style={{
                                                    backgroundColor: getTipoColor(solicitud.tipo).bg,
                                                    borderColor: `${getTipoColor(solicitud.tipo).border}40`
                                                }}
                                            >
                                                <CardContent className="p-4 flex flex-col h-full">
                                                    {/* Header con icono y tipo badge en esquina derecha */}
                                                    <div className="flex items-start justify-between mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white shadow-sm"
                                                            >
                                                                <HugeiconsIcon
                                                                    icon={getTipoIcono(solicitud.tipo)}
                                                                    size={18}
                                                                    style={{ color: getTipoColor(solicitud.tipo).text }}
                                                                    strokeWidth={1.5}
                                                                />
                                                            </div>
                                                            <div className="min-w-0 flex-1">
                                                                <button
                                                                    onClick={() => handleViewDetail(solicitud)}
                                                                    className="font-semibold text-sm leading-tight line-clamp-1 text-gray-800 hover:text-green-700 transition-all duration-200 cursor-pointer text-left relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-green-700 after:transition-all after:duration-200 hover:after:w-full"
                                                                >
                                                                    {solicitud.titulo}
                                                                </button>
                                                                <span className="text-xs text-gray-500">
                                                                    ID: #{solicitud.id}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {/* Tipo badge en esquina derecha superior */}
                                                        <Badge
                                                            className="border flex-shrink-0 bg-white"
                                                            style={{
                                                                color: getTipoColor(solicitud.tipo).text,
                                                                borderColor: getTipoColor(solicitud.tipo).border,
                                                            }}
                                                            size="sm"
                                                        >
                                                            {getTipoNombre(solicitud.tipo)}
                                                        </Badge>
                                                    </div>

                                                    {/* Descripción en contenedor claro */}
                                                    <div className="bg-white/90 rounded-lg p-3 mb-3 flex-1">
                                                        <p
                                                            className="text-sm leading-relaxed line-clamp-2"
                                                            style={{ color: getTipoColor(solicitud.tipo).text }}
                                                        >
                                                            {solicitud.descripcion || 'Sin descripción'}
                                                        </p>
                                                    </div>

                                                    {/* Footer con fecha, estado y menú */}
                                                    <div
                                                        className="pt-2 border-t flex items-center justify-between mt-auto"
                                                        style={{ borderColor: `${getTipoColor(solicitud.tipo).border}40` }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="flex items-center gap-2 text-[13px] opacity-70"
                                                                style={{ color: getTipoColor(solicitud.tipo).text }}
                                                            >
                                                                <CalendarIcon className="w-3.5 h-3.5" />
                                                                <span>
                                                                    {new Date(solicitud.fecha).toLocaleDateString('es-CO', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    })}
                                                                </span>
                                                            </div>
                                                            {getEstadoBadge(solicitud.estado)}
                                                        </div>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="w-40">
                                                                <DropdownMenuItem onClick={() => handleViewDetail(solicitud)}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Ver detalle
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleOpenEdit(solicitud)}
                                                                    disabled={solicitud.estado !== 'pendiente'}
                                                                >
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleDelete(solicitud)}
                                                                    className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                                >
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Eliminar
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="text-gray-400 mb-2">
                                            <Search className="w-12 h-12 mx-auto" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                                            No se encontraron resultados
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                            {searchTerm
                                                ? `No hay solicitudes que coincidan con "${searchTerm}"`
                                                : 'No tienes solicitudes registradas'
                                            }
                                        </p>
                                        <Button onClick={handleOpenCreate} className="mt-4">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Crear tu primera solicitud
                                        </Button>
                                    </div>
                                )}
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>

            {/* Sheet para crear solicitud */}
            <Sheet open={isCreateSheetOpen} onOpenChange={setIsCreateSheetOpen}>
                <SheetContent
                    side="right"
                    className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
                    style={{ width: '500px', maxWidth: 'none' }}
                >
                    {/* Header con icono */}
                    <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
                        <div className="flex items-start gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: getTipoColor(formTipo).bg }}
                            >
                                <HugeiconsIcon
                                    icon={getTipoIcono(formTipo)}
                                    size={24}
                                    style={{ color: getTipoColor(formTipo).text }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                                    Nueva Solicitud
                                </SheetTitle>
                                <SheetDescription className="text-sm text-gray-500">
                                    Crea una nueva solicitud para la administración.
                                </SheetDescription>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del formulario */}
                    <div className="flex-1 overflow-y-auto px-6 pb-4">
                        <div className="space-y-6">
                            {/* Sección 1: Categorización */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">Categorización</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Selecciona el tipo de solicitud que deseas realizar</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tipo" className="font-normal">Tipo de solicitud</Label>
                                    <Select value={formTipo} onValueChange={(v) => setFormTipo(v as Solicitud['tipo'])}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="peticion">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={NotificationCircleIcon} size={14} style={{ color: '#4C6C5A' }} />
                                                    Petición
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="queja">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={Alert02Icon} size={14} style={{ color: '#A39170' }} />
                                                    Queja
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="sugerencia">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={IdeaIcon} size={14} style={{ color: '#4C6C5A' }} />
                                                    Sugerencia
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="reparacion-locativa">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={Wrench01Icon} size={14} style={{ color: '#595D75' }} />
                                                    Reparación Locativa
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* Info box con definición del tipo seleccionado */}
                                    <div
                                        className="flex items-start gap-2 p-3 rounded-lg mt-2"
                                        style={{ backgroundColor: getTipoColor(formTipo).bg }}
                                    >
                                        <Info
                                            className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-700"
                                        />
                                        <p className="text-sm leading-relaxed text-gray-700">
                                            {getTipoDefinicion(formTipo)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Separador */}
                            <Separator />

                            {/* Sección 2: Detalles de la Solicitud */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">Detalles de la Solicitud</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Proporciona un título descriptivo y detalla tu solicitud</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="titulo" className="font-normal">Título</Label>
                                    <Input
                                        id="titulo"
                                        placeholder="Ingresa un título descriptivo"
                                        value={formTitulo}
                                        onChange={(e) => setFormTitulo(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="descripcion" className="font-normal">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        placeholder="Describe tu solicitud en detalle..."
                                        value={formDescripcion}
                                        onChange={(e) => setFormDescripcion(e.target.value)}
                                        className="min-h-[150px]"
                                    />
                                </div>
                            </div>

                            {/* Sección 3: Información de Reparación Locativa (condicional) */}
                            {formTipo === 'reparacion-locativa' && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-900">Información de la Obra</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">Detalles sobre los trabajos a realizar</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="tipoObra" className="font-normal">Tipo de obra</Label>
                                                <Select value={formTipoObra} onValueChange={(v) => setFormTipoObra(v as Solicitud['tipoObra'])}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona el tipo de obra" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Eléctrica">Eléctrica</SelectItem>
                                                        <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                                                        <SelectItem value="Alturas (superior a 1.50m)">Alturas (superior a 1.50m)</SelectItem>
                                                        <SelectItem value="Obra blanca">Obra blanca</SelectItem>
                                                        <SelectItem value="Obra gris">Obra gris</SelectItem>
                                                        <SelectItem value="Otra">Otra</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {formTipoObra === 'Otra' && (
                                                    <Input
                                                        placeholder="Especifica el tipo de obra"
                                                        value={formTipoObraOtra}
                                                        onChange={(e) => setFormTipoObraOtra(e.target.value)}
                                                        className="mt-2"
                                                    />
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="fechaInicio" className="font-normal">Fecha de inicio</Label>
                                                    <DatePicker
                                                        id="fechaInicio"
                                                        value={formFechaInicio}
                                                        onSelect={setFormFechaInicio}
                                                        placeholder="Selecciona fecha"
                                                        minDate={new Date()}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="fechaFinalizacion" className="font-normal">Fecha de finalización</Label>
                                                    <DatePicker
                                                        id="fechaFinalizacion"
                                                        value={formFechaFinalizacion}
                                                        onSelect={setFormFechaFinalizacion}
                                                        placeholder="Selecciona fecha"
                                                        minDate={formFechaInicio}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-900">Trabajadores</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">Añade los trabajadores que participarán en la obra</p>
                                        </div>

                                        {/* Lista de trabajadores */}
                                        {formTrabajadores.length > 0 && (
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 border-b">
                                                        <tr>
                                                            <th className="text-left px-3 py-2 font-medium text-gray-600">Nombre</th>
                                                            <th className="text-left px-3 py-2 font-medium text-gray-600">Documento</th>
                                                            <th className="text-left px-3 py-2 font-medium text-gray-600">ARL</th>
                                                            <th className="w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formTrabajadores.map((trabajador, index) => (
                                                            <tr key={index} className="border-b last:border-b-0">
                                                                <td className="px-3 py-2 text-gray-900">{trabajador.nombre}</td>
                                                                <td className="px-3 py-2 text-gray-600">{trabajador.documento}</td>
                                                                <td className="px-3 py-2 text-gray-600">{trabajador.arl}</td>
                                                                <td className="px-2 py-2">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                                onClick={() => handleRemoveTrabajador(index)}
                                                                            >
                                                                                <HugeiconsIcon icon={Delete02Icon} size={16} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Eliminar trabajador</TooltipContent>
                                                                    </Tooltip>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Formulario para añadir trabajador */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm font-medium text-gray-700">Añadir trabajador</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input
                                                    placeholder="Nombre completo"
                                                    value={newTrabajadorNombre}
                                                    onChange={(e) => setNewTrabajadorNombre(e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Documento"
                                                    value={newTrabajadorDocumento}
                                                    onChange={(e) => setNewTrabajadorDocumento(e.target.value)}
                                                />
                                                <Input
                                                    placeholder="ARL"
                                                    value={newTrabajadorArl}
                                                    onChange={(e) => setNewTrabajadorArl(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddTrabajador}
                                                disabled={!newTrabajadorNombre.trim() || !newTrabajadorDocumento.trim() || !newTrabajadorArl.trim()}
                                                className="w-full"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Añadir Trabajador
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <Button variant="outline" className="flex-1" onClick={() => setIsCreateSheetOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleCreateSubmit}
                            disabled={!formTitulo.trim()}
                        >
                            Crear Solicitud
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Sheet para editar solicitud */}
            <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
                <SheetContent
                    side="right"
                    className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
                    style={{ width: '500px', maxWidth: 'none' }}
                >
                    {/* Header con icono */}
                    <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
                        <div className="flex items-start gap-4">
                            <div
                                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                style={{ backgroundColor: getTipoColor(formTipo).bg }}
                            >
                                <HugeiconsIcon
                                    icon={getTipoIcono(formTipo)}
                                    size={24}
                                    style={{ color: getTipoColor(formTipo).text }}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                                    Editar Solicitud
                                </SheetTitle>
                                <SheetDescription className="text-sm text-gray-500">
                                    Modifica los datos de tu solicitud
                                </SheetDescription>
                            </div>
                        </div>
                    </div>

                    {/* Contenido del formulario */}
                    <div className="flex-1 overflow-y-auto px-6 pb-4">
                        <div className="space-y-6">
                            {/* Sección 1: Categorización */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">Categorización</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Selecciona el tipo de solicitud que deseas realizar</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-tipo" className="font-normal">Tipo de solicitud</Label>
                                    <Select value={formTipo} onValueChange={(v) => setFormTipo(v as Solicitud['tipo'])}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un tipo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="peticion">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={NotificationCircleIcon} size={14} style={{ color: '#4C6C5A' }} />
                                                    Petición
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="queja">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={Alert02Icon} size={14} style={{ color: '#A39170' }} />
                                                    Queja
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="sugerencia">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={IdeaIcon} size={14} style={{ color: '#4C6C5A' }} />
                                                    Sugerencia
                                                </span>
                                            </SelectItem>
                                            <SelectItem value="reparacion-locativa">
                                                <span className="flex items-center gap-2">
                                                    <HugeiconsIcon icon={Wrench01Icon} size={14} style={{ color: '#595D75' }} />
                                                    Reparación Locativa
                                                </span>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* Info box con definición del tipo seleccionado */}
                                    <div
                                        className="flex items-start gap-2 p-3 rounded-lg mt-2"
                                        style={{ backgroundColor: getTipoColor(formTipo).bg }}
                                    >
                                        <Info
                                            className="w-4 h-4 flex-shrink-0 mt-0.5 text-gray-700"
                                        />
                                        <p className="text-sm leading-relaxed text-gray-700">
                                            {getTipoDefinicion(formTipo)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Separador */}
                            <Separator />

                            {/* Sección 2: Detalles de la Solicitud */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-base font-semibold text-gray-900">Detalles de la Solicitud</h4>
                                    <p className="text-sm text-gray-500 mt-0.5">Proporciona un título descriptivo y detalla tu solicitud</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit-titulo" className="font-normal">Título</Label>
                                    <Input
                                        id="edit-titulo"
                                        placeholder="Ingresa un título descriptivo"
                                        value={formTitulo}
                                        onChange={(e) => setFormTitulo(e.target.value)}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="edit-descripcion" className="font-normal">Descripción</Label>
                                    <Textarea
                                        id="edit-descripcion"
                                        placeholder="Describe tu solicitud en detalle..."
                                        value={formDescripcion}
                                        onChange={(e) => setFormDescripcion(e.target.value)}
                                        className="min-h-[150px]"
                                    />
                                </div>
                            </div>

                            {/* Sección 3: Información de Reparación Locativa (condicional) */}
                            {formTipo === 'reparacion-locativa' && (
                                <>
                                    <Separator />
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-900">Información de la Obra</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">Detalles sobre los trabajos a realizar</p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="edit-tipoObra" className="font-normal">Tipo de obra</Label>
                                                <Select value={formTipoObra} onValueChange={(v) => setFormTipoObra(v as Solicitud['tipoObra'])}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Selecciona el tipo de obra" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Eléctrica">Eléctrica</SelectItem>
                                                        <SelectItem value="Hidráulica">Hidráulica</SelectItem>
                                                        <SelectItem value="Alturas (superior a 1.50m)">Alturas (superior a 1.50m)</SelectItem>
                                                        <SelectItem value="Obra blanca">Obra blanca</SelectItem>
                                                        <SelectItem value="Obra gris">Obra gris</SelectItem>
                                                        <SelectItem value="Otra">Otra</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {formTipoObra === 'Otra' && (
                                                    <Input
                                                        placeholder="Especifica el tipo de obra"
                                                        value={formTipoObraOtra}
                                                        onChange={(e) => setFormTipoObraOtra(e.target.value)}
                                                        className="mt-2"
                                                    />
                                                )}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-fechaInicio" className="font-normal">Fecha de inicio</Label>
                                                    <DatePicker
                                                        id="edit-fechaInicio"
                                                        value={formFechaInicio}
                                                        onSelect={setFormFechaInicio}
                                                        placeholder="Selecciona fecha"
                                                        minDate={new Date()}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="edit-fechaFinalizacion" className="font-normal">Fecha de finalización</Label>
                                                    <DatePicker
                                                        id="edit-fechaFinalizacion"
                                                        value={formFechaFinalizacion}
                                                        onSelect={setFormFechaFinalizacion}
                                                        placeholder="Selecciona fecha"
                                                        minDate={formFechaInicio}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-base font-semibold text-gray-900">Trabajadores</h4>
                                            <p className="text-sm text-gray-500 mt-0.5">Añade los trabajadores que participarán en la obra</p>
                                        </div>

                                        {/* Lista de trabajadores */}
                                        {formTrabajadores.length > 0 && (
                                            <div className="border rounded-lg overflow-hidden">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-gray-50 border-b">
                                                        <tr>
                                                            <th className="text-left px-3 py-2 font-medium text-gray-600">Nombre</th>
                                                            <th className="text-left px-3 py-2 font-medium text-gray-600">Documento</th>
                                                            <th className="text-left px-3 py-2 font-medium text-gray-600">ARL</th>
                                                            <th className="w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formTrabajadores.map((trabajador, index) => (
                                                            <tr key={index} className="border-b last:border-b-0">
                                                                <td className="px-3 py-2 text-gray-900">{trabajador.nombre}</td>
                                                                <td className="px-3 py-2 text-gray-600">{trabajador.documento}</td>
                                                                <td className="px-3 py-2 text-gray-600">{trabajador.arl}</td>
                                                                <td className="px-2 py-2">
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Button
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                                onClick={() => handleRemoveTrabajador(index)}
                                                                            >
                                                                                <HugeiconsIcon icon={Delete02Icon} size={16} />
                                                                            </Button>
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>Eliminar trabajador</TooltipContent>
                                                                    </Tooltip>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        )}

                                        {/* Formulario para añadir trabajador */}
                                        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm font-medium text-gray-700">Añadir trabajador</p>
                                            <div className="grid grid-cols-3 gap-2">
                                                <Input
                                                    placeholder="Nombre completo"
                                                    value={newTrabajadorNombre}
                                                    onChange={(e) => setNewTrabajadorNombre(e.target.value)}
                                                />
                                                <Input
                                                    placeholder="Documento"
                                                    value={newTrabajadorDocumento}
                                                    onChange={(e) => setNewTrabajadorDocumento(e.target.value)}
                                                />
                                                <Input
                                                    placeholder="ARL"
                                                    value={newTrabajadorArl}
                                                    onChange={(e) => setNewTrabajadorArl(e.target.value)}
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={handleAddTrabajador}
                                                disabled={!newTrabajadorNombre.trim() || !newTrabajadorDocumento.trim() || !newTrabajadorArl.trim()}
                                                className="w-full"
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Añadir Trabajador
                                            </Button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <Button variant="outline" className="flex-1" onClick={() => setIsEditSheetOpen(false)}>
                            Cancelar
                        </Button>
                        <Button
                            className="flex-1"
                            onClick={handleEditSubmit}
                            disabled={!formTitulo.trim()}
                        >
                            Guardar Cambios
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>

            {/* Sheet para ver detalle de solicitud */}
            <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
                <SheetContent
                    side="right"
                    className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
                    style={{ width: '600px', maxWidth: 'none' }}
                >
                    {selectedSolicitud && (
                        <>
                            {/* Header con icono */}
                            <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: getTipoColor(selectedSolicitud.tipo).bg }}
                                    >
                                        <HugeiconsIcon
                                            icon={getTipoIcono(selectedSolicitud.tipo)}
                                            size={24}
                                            style={{ color: getTipoColor(selectedSolicitud.tipo).text }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                                            Detalles de Solicitud
                                        </SheetTitle>
                                        <SheetDescription className="text-sm text-gray-500">
                                            {getTipoNombre(selectedSolicitud.tipo)} • ID #{selectedSolicitud.id}
                                        </SheetDescription>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido scrolleable */}
                            <div className="flex-1 overflow-y-auto">
                                {/* Título y descripción */}
                                <div className="px-6 pt-4 pb-4 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedSolicitud.titulo}</h3>
                                    {selectedSolicitud.descripcion && (
                                        <div className="max-h-60 overflow-y-auto">
                                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedSolicitud.descripcion}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Grid de información */}
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">ID de Solicitud</p>
                                            <p className="text-sm font-medium text-gray-900">#{selectedSolicitud.id}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Fecha de creación</p>
                                            <p className="text-sm font-medium text-gray-900">
                                                {new Date(selectedSolicitud.fecha).toLocaleDateString('es-CO', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Tipo</p>
                                            <Badge
                                                className="border mt-1"
                                                style={{
                                                    backgroundColor: getTipoColor(selectedSolicitud.tipo).bg,
                                                    color: getTipoColor(selectedSolicitud.tipo).text,
                                                    borderColor: getTipoColor(selectedSolicitud.tipo).border,
                                                }}
                                                size="sm"
                                            >
                                                {getTipoNombre(selectedSolicitud.tipo)}
                                            </Badge>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <p className="text-xs text-gray-500 mb-1">Estado</p>
                                            <div className="mt-1">{getEstadoBadge(selectedSolicitud.estado)}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información específica para reparación locativa */}
                                {selectedSolicitud.tipo === 'reparacion-locativa' && (
                                    <>
                                        {/* Tipo de obra y fechas */}
                                        {(selectedSolicitud.tipoObra || selectedSolicitud.fechaInicio || selectedSolicitud.fechaFinalizacion) && (
                                            <div className="px-6 py-4 border-b border-gray-200">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Información de la Obra</h4>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {selectedSolicitud.tipoObra && (
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-500 mb-1">Tipo de obra</p>
                                                            <p className="text-sm font-medium text-gray-900">{selectedSolicitud.tipoObra}</p>
                                                        </div>
                                                    )}
                                                    {selectedSolicitud.fechaInicio && (
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-500 mb-1">Fecha inicio</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {new Date(selectedSolicitud.fechaInicio).toLocaleDateString('es-CO', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {selectedSolicitud.fechaFinalizacion && (
                                                        <div className="bg-gray-50 rounded-lg p-3">
                                                            <p className="text-xs text-gray-500 mb-1">Fecha fin</p>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {new Date(selectedSolicitud.fechaFinalizacion).toLocaleDateString('es-CO', {
                                                                    day: 'numeric',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Tabla de trabajadores */}
                                        {selectedSolicitud.trabajadores && selectedSolicitud.trabajadores.length > 0 && (
                                            <div className="px-6 py-4">
                                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                                    Trabajadores ({selectedSolicitud.trabajadores.length})
                                                </h4>
                                                <div className="border rounded-lg overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-50 border-b">
                                                            <tr>
                                                                <th className="text-left px-4 py-2 font-medium text-gray-600">Nombre</th>
                                                                <th className="text-left px-4 py-2 font-medium text-gray-600">Documento</th>
                                                                <th className="text-left px-4 py-2 font-medium text-gray-600">ARL</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {selectedSolicitud.trabajadores.map((trabajador, index) => (
                                                                <tr key={index} className="border-b last:border-b-0">
                                                                    <td className="px-4 py-2 text-gray-900">{trabajador.nombre}</td>
                                                                    <td className="px-4 py-2 text-gray-600">{trabajador.documento}</td>
                                                                    <td className="px-4 py-2 text-gray-600">{trabajador.arl}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-4 border-t border-gray-200 bg-gray-50">
                                <Button variant="outline" className="flex-1" onClick={() => setIsDetailSheetOpen(false)}>
                                    Cerrar
                                </Button>
                                {selectedSolicitud.estado === 'pendiente' && (
                                    <Button
                                        className="flex-1"
                                        onClick={() => {
                                            setIsDetailSheetOpen(false)
                                            handleOpenEdit(selectedSolicitud)
                                        }}
                                    >
                                        <Pencil className="w-4 h-4 mr-2" />
                                        Editar
                                    </Button>
                                )}
                            </SheetFooter>
                        </>
                    )}
                </SheetContent>
            </Sheet>

            {/* Diálogo de confirmación para eliminar */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar solicitud?</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas eliminar la solicitud <span className="font-semibold">&quot;{solicitudToDelete?.titulo}&quot;</span>?
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
