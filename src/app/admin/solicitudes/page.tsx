'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { MoreVertical, Eye, Check, X as XIcon, Search, X } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Wrench01Icon, Alert02Icon, NotificationCircleIcon, IdeaIcon, Home07Icon } from '@hugeicons/core-free-icons'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Solicitud } from '@/types/solicitud.types'
import { solicitudesData } from '@/data/solicitudes.mock'
import { TabSliderIndicator } from '@/components/ui/tab-slider-indicator'
import { cn } from '@/lib/utils'

export default function SolicitudesPage() {
  useDocumentTitle('Solicitudes PQRS | Flor Digital');
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'todas' | 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia'>('todas')
  const [estadoFilter, setEstadoFilter] = useState<'todas' | 'pendiente' | 'aprobada' | 'rechazada' | 'revisada'>('todas')
  const [estadoComboboxOpen, setEstadoComboboxOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [selectedSolicitud, setSelectedSolicitud] = useState<Solicitud | null>(null)
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>(solicitudesData)

  // Estados para los diálogos de confirmación
  const [showAprobarDialog, setShowAprobarDialog] = useState(false)
  const [showRechazarDialog, setShowRechazarDialog] = useState(false)
  const [showRevisadaDialog, setShowRevisadaDialog] = useState(false)
  const [solicitudToAction, setSolicitudToAction] = useState<Solicitud | null>(null)

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const handleViewDetail = useCallback((solicitud: Solicitud) => {
    setSelectedSolicitud(solicitud)
    setIsDetailSheetOpen(true)
  }, [])

  // Función auxiliar para actualizar una solicitud
  const updateSolicitud = useCallback((id: string, estado: 'aprobada' | 'rechazada' | 'revisada') => {
    setSolicitudes(prev => prev.map(s =>
      s.id === id ? { ...s, estado } : s
    ))
    // Si la solicitud está abierta en el sheet, actualizarla también
    if (selectedSolicitud?.id === id) {
      setSelectedSolicitud({ ...selectedSolicitud, estado })
    }
  }, [selectedSolicitud])

  // Funciones para abrir los diálogos de confirmación
  const handleAprobar = useCallback(() => {
    if (selectedSolicitud) {
      setSolicitudToAction(selectedSolicitud)
      setShowAprobarDialog(true)
    }
  }, [selectedSolicitud])

  const handleDesaprobar = useCallback(() => {
    if (selectedSolicitud) {
      setSolicitudToAction(selectedSolicitud)
      setShowRechazarDialog(true)
    }
  }, [selectedSolicitud])

  const handleMarcarRevisada = useCallback(() => {
    if (selectedSolicitud) {
      setSolicitudToAction(selectedSolicitud)
      setShowRevisadaDialog(true)
    }
  }, [selectedSolicitud])

  // Funciones para trabajar directamente con una solicitud (desde el menú de acciones)
  const handleAprobarSolicitud = useCallback((solicitud: Solicitud) => {
    setSolicitudToAction(solicitud)
    setShowAprobarDialog(true)
  }, [])

  const handleRechazarSolicitud = useCallback((solicitud: Solicitud) => {
    setSolicitudToAction(solicitud)
    setShowRechazarDialog(true)
  }, [])

  const handleMarcarRevisadaSolicitud = useCallback((solicitud: Solicitud) => {
    setSolicitudToAction(solicitud)
    setShowRevisadaDialog(true)
  }, [])

  // Funciones de confirmación que ejecutan la acción
  const confirmAprobar = useCallback(() => {
    if (solicitudToAction) {
      console.log('Aprobar solicitud:', solicitudToAction.id)
      // Aquí iría la llamada a la API para aprobar la solicitud
      updateSolicitud(solicitudToAction.id, 'aprobada')
      setShowAprobarDialog(false)
      setSolicitudToAction(null)
    }
  }, [solicitudToAction, updateSolicitud])

  const confirmRechazar = useCallback(() => {
    if (solicitudToAction) {
      console.log('Rechazar solicitud:', solicitudToAction.id)
      // Aquí iría la llamada a la API para rechazar la solicitud
      updateSolicitud(solicitudToAction.id, 'rechazada')
      setShowRechazarDialog(false)
      setSolicitudToAction(null)
    }
  }, [solicitudToAction, updateSolicitud])

  const confirmRevisada = useCallback(() => {
    if (solicitudToAction) {
      console.log('Marcar como revisada solicitud:', solicitudToAction.id)
      // Aquí iría la llamada a la API para marcar como revisada
      updateSolicitud(solicitudToAction.id, 'revisada')
      setShowRevisadaDialog(false)
      setSolicitudToAction(null)
    }
  }, [solicitudToAction, updateSolicitud])

  // Filtrar datos basándose en el término de búsqueda, tipo y estado
  const filteredSolicitudes = useMemo(() => {
    const searchLower = searchTerm.toLowerCase()

    return solicitudes.filter(solicitud => {
      // Filtrar por tipo (siempre aplica)
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
          solicitud.propietario.toLowerCase().includes(searchLower) ||
          solicitud.numeroCasa.toLowerCase().includes(searchLower) ||
          solicitud.titulo.toLowerCase().includes(searchLower) ||
          solicitud.tipo.toLowerCase().includes(searchLower)
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

  const columns = useMemo<ColumnDef<Solicitud>[]>(
    () => [
      {
        accessorKey: 'titulo',
        id: 'titulo',
        header: ({ column }) => (
          <div className="pl-[52px]">
            <DataGridColumnHeader title="Título" column={column} />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: getTipoColor(row.original.tipo).bg
              }}
            >
              <HugeiconsIcon
                icon={getTipoIcono(row.original.tipo)}
                size={18}
                style={{ color: getTipoColor(row.original.tipo).text }}
                strokeWidth={1.5}
              />
            </div>
            <div className="min-w-0 flex-1">
              <button
                onClick={() => handleViewDetail(row.original)}
                className="font-semibold text-gray-900 hover:text-green-700 transition-all duration-200 cursor-pointer text-left relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-green-700 after:transition-all after:duration-200 hover:after:w-full"
              >
                {row.original.titulo}
              </button>
              <div className="text-sm text-gray-500 truncate">
                {row.original.descripcion || 'Sin descripción'}
              </div>
            </div>
          </div>
        ),
        size: 300,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'tipo',
        id: 'tipo',
        header: ({ column }) => <DataGridColumnHeader title="Tipo" column={column} />,
        cell: ({ row }) => {
          const tipo = row.original.tipo
          const tipoNombre = getTipoNombre(tipo)

          // Colores distintivos para cada tipo (mismos que los iconos de mascotas)
          const tipoColors: Record<Solicitud['tipo'], { bg: string; text: string; border: string }> = {
            'reparacion-locativa': {
              bg: '#E3E4EA', // Azul grisáceo claro (gato)
              text: '#595D75', // Azul grisáceo oscuro (gato)
              border: '#595D75'
            },
            'queja': {
              bg: '#F1E8D6', // Beige/Dorado claro (perro)
              text: '#A39170', // Dorado/Marrón (perro)
              border: '#A39170'
            },
            'peticion': {
              bg: '#E6EFEA', // Verde claro (otro)
              text: '#4C6C5A', // Verde oscuro (otro)
              border: '#4C6C5A'
            },
            'sugerencia': {
              bg: '#E6EFEA', // Verde claro (otro) - reutilizado
              text: '#4C6C5A', // Verde oscuro (otro)
              border: '#4C6C5A'
            }
          }

          const colors = tipoColors[tipo]

          return (
            <Badge
              className="border"
              style={{
                backgroundColor: colors.bg,
                color: colors.text,
                borderColor: colors.border,
              }}
              size="md"
            >
              {tipoNombre}
            </Badge>
          )
        },
        size: 160,
        enableSorting: true,
      },
      {
        accessorKey: 'fecha',
        id: 'fecha',
        header: ({ column }) => <DataGridColumnHeader title="Fecha" column={column} />,
        cell: ({ row }) => {
          const fecha = new Date(row.original.fecha)
          return (
            <div className="text-sm text-gray-600">
              {fecha.toLocaleDateString('es-CO', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </div>
          )
        },
        size: 130,
        enableSorting: true,
      },
      {
        accessorKey: 'propietario',
        id: 'propietario',
        header: ({ column }) => <DataGridColumnHeader title="Propietario / Casa" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2.5">
            <HugeiconsIcon
              icon={Home07Icon}
              size={14}
              className="text-gray-400"
            />
            <div>
              <div className="font-medium text-gray-900">{row.original.propietario}</div>
              <div className="text-xs text-gray-500">Casa No.{row.original.numeroCasa}</div>
            </div>
          </div>
        ),
        size: 180,
        enableSorting: true,
      },
      {
        accessorKey: 'estado',
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
        cell: ({ row }) => {
          const estado = row.original.estado

          // Mostrar el estado tal cual viene del backend
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
          } else {
            // pendiente
            badgeVariant = 'warning'
            dotColor = 'bg-yellow-500'
            estadoTexto = 'Pendiente'
          }

          return (
            <Badge
              variant={badgeVariant}
              appearance="outline"
              size="md"
              className={badgeClassName}
            >
              <span className={`w-2 h-2 rounded-full ${dotColor}`} />
              {estadoTexto}
            </Badge>
          )
        },
        size: 120,
        enableSorting: true,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          const solicitud = row.original
          const tipo = solicitud.tipo
          const estado = solicitud.estado
          const isReparacionLocativa = tipo === 'reparacion-locativa'
          const isQuejaPeticionSugerencia = tipo === 'queja' || tipo === 'peticion' || tipo === 'sugerencia'

          // Botones solo aparecen cuando estado es 'pendiente'
          const mostrarAprobarRechazar = estado === 'pendiente' && isReparacionLocativa
          const mostrarRevisada = estado === 'pendiente' && isQuejaPeticionSugerencia

          return (
            <div className="flex justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleViewDetail(solicitud)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalle
                  </DropdownMenuItem>
                  {mostrarAprobarRechazar && (
                    <>
                      <DropdownMenuItem
                        onClick={() => handleAprobarSolicitud(solicitud)}
                        className="hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700"
                      >
                        <Check className="mr-2 h-4 w-4" />
                        Aprobar
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRechazarSolicitud(solicitud)}
                        className="hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                      >
                        <XIcon className="mr-2 h-4 w-4" />
                        Rechazar
                      </DropdownMenuItem>
                    </>
                  )}
                  {mostrarRevisada && (
                    <DropdownMenuItem
                      onClick={() => handleMarcarRevisadaSolicitud(solicitud)}
                      className="hover:bg-green-50 hover:text-green-700 focus:bg-green-50 focus:text-green-700"
                    >
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como revisada
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )
        },
        size: 80,
        enableSorting: false,
      },
    ],
    [handleViewDetail, handleAprobarSolicitud, handleRechazarSolicitud, handleMarcarRevisadaSolicitud, getTipoIcono, getTipoColor]
  )

  const table = useReactTable({
    columns,
    data: filteredSolicitudes,
    pageCount: Math.ceil((filteredSolicitudes?.length || 0) / pagination.pageSize),
    getRowId: (row: Solicitud) => row.id,
    state: {
      pagination,
      sorting,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

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
                <BreadcrumbLink href="/admin/dashboard">
                  Dashboard Admin
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Solicitudes PQRS</h1>
              <p className="text-gray-500 mt-1">
                Administra y da seguimiento a las peticiones, quejas, sugerencias y solicitudes de reparación enviadas por los propietarios.
              </p>
            </div>
          </div>

          {/* Filtros y controles */}
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as 'todas' | 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia')} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList className="relative [&_[data-state=active]]:bg-transparent [&_[data-state=active]]:shadow-none [&_[role=tab]]:relative [&_[role=tab]]:z-10">
                <TabSliderIndicator activeTab={filterType} />
                <TabsTrigger value="todas" data-tab-value="todas">Todas</TabsTrigger>
                <TabsTrigger value="reparacion-locativa" data-tab-value="reparacion-locativa">Reparación Locativa</TabsTrigger>
                <TabsTrigger value="queja" data-tab-value="queja">Queja</TabsTrigger>
                <TabsTrigger value="peticion" data-tab-value="peticion">Petición</TabsTrigger>
                <TabsTrigger value="sugerencia" data-tab-value="sugerencia">Sugerencia</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-3">
                <Popover open={estadoComboboxOpen} onOpenChange={setEstadoComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      mode="input"
                      placeholder={estadoFilter === 'todas'}
                      className="w-[180px] h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {estadoFilter !== 'todas' ? (
                        <span className="flex items-center gap-2.5">
                          <span className={cn(
                            'ms-0.5 size-1.5 rounded-full',
                            estadoFilter === 'pendiente' ? 'bg-yellow-500' :
                              estadoFilter === 'aprobada' ? 'bg-green-500' :
                                estadoFilter === 'rechazada' ? 'bg-red-500' :
                                  'bg-blue-500'
                          )}></span>
                          <span className="truncate">
                            {estadoFilter === 'pendiente' ? 'Pendientes' :
                              estadoFilter === 'aprobada' ? 'Aprobadas' :
                                estadoFilter === 'rechazada' ? 'Rechazadas' :
                                  'Revisadas'}
                          </span>
                        </span>
                      ) : (
                        <span>Filtrar por estado</span>
                      )}
                      <ButtonArrow />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[180px] p-0">
                    <Command>
                      <CommandInput placeholder="Buscar estado..." />
                      <CommandList>
                        <CommandEmpty>No se encontró estado.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="todas"
                            onSelect={() => {
                              setEstadoFilter('todas')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-gray-400"></span>
                              <span className="truncate">Todas</span>
                            </span>
                            {estadoFilter === 'todas' && <CommandCheck />}
                          </CommandItem>
                          <CommandItem
                            value="pendiente"
                            onSelect={() => {
                              setEstadoFilter('pendiente')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-yellow-500"></span>
                              <span className="truncate">Pendientes</span>
                            </span>
                            {estadoFilter === 'pendiente' && <CommandCheck />}
                          </CommandItem>
                          <CommandItem
                            value="aprobada"
                            onSelect={() => {
                              setEstadoFilter('aprobada')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-green-500"></span>
                              <span className="truncate">Aprobadas</span>
                            </span>
                            {estadoFilter === 'aprobada' && <CommandCheck />}
                          </CommandItem>
                          <CommandItem
                            value="rechazada"
                            onSelect={() => {
                              setEstadoFilter('rechazada')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-red-500"></span>
                              <span className="truncate">Rechazadas</span>
                            </span>
                            {estadoFilter === 'rechazada' && <CommandCheck />}
                          </CommandItem>
                          <CommandItem
                            value="revisada"
                            onSelect={() => {
                              setEstadoFilter('revisada')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-blue-500"></span>
                              <span className="truncate">Revisadas</span>
                            </span>
                            {estadoFilter === 'revisada' && <CommandCheck />}
                          </CommandItem>
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <div className="relative w-96">
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
              </div>
            </div>

            <TabsContent value="todas">
              {hasResults ? (
                <DataGrid
                  table={table}
                  recordCount={filteredSolicitudes?.length || 0}
                  tableLayout={{
                    headerBackground: false,
                    rowBorder: true,
                    rowRounded: false,
                  }}
                >
                  <div className="w-full space-y-2.5">
                    <DataGridContainer border={false}>
                      <ScrollArea>
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </DataGridContainer>
                    <DataGridPagination
                      rowsPerPageLabel="Filas por página"
                      info="{from} - {to} de {count}"
                      previousPageLabel="Ir a la página anterior"
                      nextPageLabel="Ir a la página siguiente"
                      sizes={[5, 8, 10, 25, 50, 100]}
                    />
                  </div>
                </DataGrid>
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
                      : 'No hay solicitudes registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="reparacion-locativa">
              {hasResults ? (
                <DataGrid
                  table={table}
                  recordCount={filteredSolicitudes?.length || 0}
                  tableLayout={{
                    headerBackground: false,
                    rowBorder: true,
                    rowRounded: false,
                  }}
                >
                  <div className="w-full space-y-2.5">
                    <DataGridContainer border={false}>
                      <ScrollArea>
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </DataGridContainer>
                    <DataGridPagination
                      rowsPerPageLabel="Filas por página"
                      info="{from} - {to} de {count}"
                      previousPageLabel="Ir a la página anterior"
                      nextPageLabel="Ir a la página siguiente"
                      sizes={[5, 8, 10, 25, 50, 100]}
                    />
                  </div>
                </DataGrid>
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
                      ? `No hay solicitudes de reparación locativa que coincidan con "${searchTerm}"`
                      : 'No hay solicitudes de reparación locativa'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="queja">
              {hasResults ? (
                <DataGrid
                  table={table}
                  recordCount={filteredSolicitudes?.length || 0}
                  tableLayout={{
                    headerBackground: false,
                    rowBorder: true,
                    rowRounded: false,
                  }}
                >
                  <div className="w-full space-y-2.5">
                    <DataGridContainer border={false}>
                      <ScrollArea>
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </DataGridContainer>
                    <DataGridPagination
                      rowsPerPageLabel="Filas por página"
                      info="{from} - {to} de {count}"
                      previousPageLabel="Ir a la página anterior"
                      nextPageLabel="Ir a la página siguiente"
                      sizes={[5, 8, 10, 25, 50, 100]}
                    />
                  </div>
                </DataGrid>
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
                      ? `No hay quejas que coincidan con "${searchTerm}"`
                      : 'No hay quejas registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="peticion">
              {hasResults ? (
                <DataGrid
                  table={table}
                  recordCount={filteredSolicitudes?.length || 0}
                  tableLayout={{
                    headerBackground: false,
                    rowBorder: true,
                    rowRounded: false,
                  }}
                >
                  <div className="w-full space-y-2.5">
                    <DataGridContainer border={false}>
                      <ScrollArea>
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </DataGridContainer>
                    <DataGridPagination
                      rowsPerPageLabel="Filas por página"
                      info="{from} - {to} de {count}"
                      previousPageLabel="Ir a la página anterior"
                      nextPageLabel="Ir a la página siguiente"
                      sizes={[5, 8, 10, 25, 50, 100]}
                    />
                  </div>
                </DataGrid>
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
                      ? `No hay peticiones que coincidan con "${searchTerm}"`
                      : 'No hay peticiones registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sugerencia">
              {hasResults ? (
                <DataGrid
                  table={table}
                  recordCount={filteredSolicitudes?.length || 0}
                  tableLayout={{
                    headerBackground: false,
                    rowBorder: true,
                    rowRounded: false,
                  }}
                >
                  <div className="w-full space-y-2.5">
                    <DataGridContainer border={false}>
                      <ScrollArea>
                        <DataGridTable />
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>
                    </DataGridContainer>
                    <DataGridPagination
                      rowsPerPageLabel="Filas por página"
                      info="{from} - {to} de {count}"
                      previousPageLabel="Ir a la página anterior"
                      nextPageLabel="Ir a la página siguiente"
                      sizes={[5, 8, 10, 25, 50, 100]}
                    />
                  </div>
                </DataGrid>
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
                      ? `No hay sugerencias que coincidan con "${searchTerm}"`
                      : 'No hay sugerencias registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sheet de detalle */}
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
                    style={{
                      backgroundColor: selectedSolicitud.tipo === 'reparacion-locativa'
                        ? '#E3E4EA'
                        : selectedSolicitud.tipo === 'queja'
                          ? '#F1E8D6'
                          : '#E6EFEA'
                    }}
                  >
                    <HugeiconsIcon
                      icon={getTipoIcono(selectedSolicitud.tipo)}
                      size={24}
                      style={{
                        color: selectedSolicitud.tipo === 'reparacion-locativa'
                          ? '#595D75'
                          : selectedSolicitud.tipo === 'queja'
                            ? '#A39170'
                            : '#4C6C5A'
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                      Detalles de Solicitud
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-500">
                      {getTipoNombre(selectedSolicitud.tipo)} de {selectedSolicitud.propietario} (Casa No. {selectedSolicitud.numeroCasa})
                    </SheetDescription>
                  </div>
                </div>
              </div>

              {/* Título y descripción */}
              <div className="px-6 pt-4 pb-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedSolicitud.titulo}</h3>
                {selectedSolicitud.descripcion && (
                  <div className="max-h-60 overflow-y-auto">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedSolicitud.descripcion}</p>
                  </div>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto px-6 pt-2 pb-4">
                <div className="space-y-4">
                  {/* Grid 4 columnas: ID, Fecha, Tipo, Estado */}
                  <div className="grid grid-cols-[auto_auto_auto_auto] gap-4">
                    {/* ID Solicitud */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">ID Solicitud</div>
                      <div className="text-sm text-gray-900">#{selectedSolicitud.id}</div>
                    </div>

                    {/* Fecha */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Fecha:</div>
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {new Date(selectedSolicitud.fecha).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    {/* Tipo */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tipo:</div>
                      <div className="flex items-center h-5">
                        <Badge
                          className="border"
                          style={{
                            backgroundColor: selectedSolicitud.tipo === 'reparacion-locativa'
                              ? '#E3E4EA'
                              : selectedSolicitud.tipo === 'queja'
                                ? '#F1E8D6'
                                : '#E6EFEA',
                            color: selectedSolicitud.tipo === 'reparacion-locativa'
                              ? '#595D75'
                              : selectedSolicitud.tipo === 'queja'
                                ? '#A39170'
                                : '#4C6C5A',
                            borderColor: selectedSolicitud.tipo === 'reparacion-locativa'
                              ? '#595D75'
                              : selectedSolicitud.tipo === 'queja'
                                ? '#A39170'
                                : '#4C6C5A'
                          }}
                          size="sm"
                        >
                          {getTipoNombre(selectedSolicitud.tipo)}
                        </Badge>
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Estado:</div>
                      <div className="flex items-center h-5">
                        {(() => {
                          const estado = selectedSolicitud.estado
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
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Información específica de reparaciones locativas */}
                  {selectedSolicitud.tipo === 'reparacion-locativa' && (
                    <>
                      {/* Tipo de obra y fechas */}
                      {(selectedSolicitud.tipoObra || selectedSolicitud.fechaInicio || selectedSolicitud.fechaFinalizacion) && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="grid grid-cols-3 gap-4">
                            {selectedSolicitud.tipoObra && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Tipo de obra:</div>
                                <div className="text-sm text-gray-900">{selectedSolicitud.tipoObra}</div>
                              </div>
                            )}
                            {selectedSolicitud.fechaInicio && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Fecha de inicio:</div>
                                <div className="text-sm text-gray-900 whitespace-nowrap">
                                  {new Date(selectedSolicitud.fechaInicio).toLocaleDateString('es-CO', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                            )}
                            {selectedSolicitud.fechaFinalizacion && (
                              <div>
                                <div className="text-xs text-gray-500 mb-1">Fecha de finalización:</div>
                                <div className="text-sm text-gray-900 whitespace-nowrap">
                                  {new Date(selectedSolicitud.fechaFinalizacion).toLocaleDateString('es-CO', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric',
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Tabla de trabajadores */}
                      {selectedSolicitud.trabajadores && selectedSolicitud.trabajadores.length > 0 && (
                        <div className="pt-3 border-t border-gray-200">
                          <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Trabajadores</div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="border-b border-gray-200">
                                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-3">Nombre</th>
                                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-3">Documento</th>
                                  <th className="text-left text-xs font-medium text-gray-500 py-2 px-3">ARL</th>
                                </tr>
                              </thead>
                              <tbody>
                                {selectedSolicitud.trabajadores.map((trabajador, index) => (
                                  <tr key={index} className="border-b border-gray-100 last:border-b-0">
                                    <td className="text-sm text-gray-900 py-2 px-3">{trabajador.nombre}</td>
                                    <td className="text-sm text-gray-900 py-2 px-3">{trabajador.documento}</td>
                                    <td className="text-sm text-gray-900 py-2 px-3">{trabajador.arl}</td>
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
              </div>

              {/* Footer con botones de acción */}
              {selectedSolicitud && (() => {
                const tipo = selectedSolicitud.tipo
                const estado = selectedSolicitud.estado
                const isReparacionLocativa = tipo === 'reparacion-locativa'
                const isQuejaPeticionSugerencia = tipo === 'queja' || tipo === 'peticion' || tipo === 'sugerencia'

                // Botones solo aparecen cuando estado es 'pendiente'
                const mostrarAprobarRechazar = estado === 'pendiente' && isReparacionLocativa
                const mostrarRevisada = estado === 'pendiente' && isQuejaPeticionSugerencia

                if (!mostrarAprobarRechazar && !mostrarRevisada) {
                  return null
                }

                return (
                  <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-4 border-t border-gray-200">
                    {mostrarAprobarRechazar && (
                      <>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={handleDesaprobar}
                        >
                          <XIcon className="w-4 h-4 mr-2" />
                          Rechazar
                        </Button>
                        <Button
                          className="flex-1"
                          onClick={handleAprobar}
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Aprobar
                        </Button>
                      </>
                    )}
                    {mostrarRevisada && (
                      <Button
                        className="flex-1"
                        onClick={handleMarcarRevisada}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Marcar como revisada
                      </Button>
                    )}
                  </SheetFooter>
                )
              })()}
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Diálogos de confirmación */}
      <AlertDialog
        open={showAprobarDialog}
        onOpenChange={(open) => {
          setShowAprobarDialog(open)
          if (!open) {
            setSolicitudToAction(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Aprobar solicitud?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas aprobar la solicitud &quot;{solicitudToAction?.titulo}&quot;?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmAprobar} className="bg-primary hover:bg-primary/90">
              Aprobar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showRechazarDialog}
        onOpenChange={(open) => {
          setShowRechazarDialog(open)
          if (!open) {
            setSolicitudToAction(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Rechazar solicitud?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas rechazar la solicitud &quot;{solicitudToAction?.titulo}&quot;?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRechazar} className="bg-red-600 hover:bg-red-700">
              Rechazar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={showRevisadaDialog}
        onOpenChange={(open) => {
          setShowRevisadaDialog(open)
          if (!open) {
            setSolicitudToAction(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Marcar como revisada?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas marcar la solicitud &quot;{solicitudToAction?.titulo}&quot; como revisada?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmRevisada} className="bg-blue-600 hover:bg-blue-700">
              Marcar como revisada
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
