'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { ChevronDown, ChevronUp, MapPin, Package, Search, X, Plus, MoreVertical, Pencil, CheckCircle2, XCircle, Wrench } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { AnimatedTabs } from '@/components/animated-tabs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormFieldWithTooltip } from '@/components/forms'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { ButtonArrow } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  ColumnDef,
  ExpandedState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { RecursoResponse } from '@/types/recursos.types'
import { recursoService } from '@/services/recurso.service'
import { mapFormToRequest, mapResponseToUI } from '@/services/recurso.adapter'
import type { RecursoUI } from '@/services/recurso.adapter'
import { useRecurso } from '@/hooks/useRecurso'

export default function RecursosPage() {
  const [recursos, setRecursos] = useState<RecursoUI[]>([])
  const [recursosResponse, setRecursosResponse] = useState<RecursoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = useState<SortingState>([])
  const [expanded, setExpanded] = useState<ExpandedState>({})
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'todas' | 'zonas' | 'objetos'>('todas')
  const [estadoFilter, setEstadoFilter] = useState<'todas' | 'disponible' | 'no-disponible' | 'en-mantenimiento'>('todas')
  const [estadoComboboxOpen, setEstadoComboboxOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [formNombre, setFormNombre] = useState('')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formTipo, setFormTipo] = useState<'zona' | 'objeto' | ''>('')
  const [errors, setErrors] = useState<{ nombre?: string; descripcion?: string; tipo?: string }>({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedRecursoId, setSelectedRecursoId] = useState<string | null>(null)
  const { habilitarRecurso, deshabilitarRecurso } = useRecurso()

  useEffect(() => {
    let mounted = true
    async function loadRecursos() {
      try {
        setLoading(true)
        const list = await recursoService.getRecurso()
        if (!mounted) return
        // El servicio ya devuelve un array normalizado
        console.debug('[recursos] raw response:', list)
        const items = Array.isArray(list) ? list : []

        setRecursosResponse(items)
        setRecursos(items.map(mapResponseToUI))
      } catch (err) {
        console.error('Error cargando recursos:', err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }
    loadRecursos()
    return () => { mounted = false }
  }, [])

  const handleClearSearch = () => setSearchTerm('')

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return recursos.filter((r) => {
      // Filtrar por tipo
      if (filterType === 'zonas' && r.tipoRecursoComun !== 'ZONA') return false
      if (filterType === 'objetos' && r.tipoRecursoComun !== 'OBJETO') return false
      
      // Filtrar por estado
      if (estadoFilter !== 'todas') {
        if (estadoFilter === 'disponible' && r.disponibilidadRecurso !== 'DISPONIBLE') return false
        if (estadoFilter === 'no-disponible' && r.disponibilidadRecurso !== 'NO_DISPONIBLE') return false
        if (estadoFilter === 'en-mantenimiento' && r.disponibilidadRecurso !== 'EN_MANTENIMIENTO') return false
      }
      
      // Filtrar por término de búsqueda
      if (!term) return true
      return (
        r.nombre.toLowerCase().includes(term) ||
        r.descripcion.toLowerCase().includes(term)
      )
    })
  }, [searchTerm, filterType, estadoFilter, recursos])

  const validateForm = () => {
    const nextErrors: { nombre?: string; descripcion?: string; tipo?: string } = {}
    if (!formNombre || formNombre.trim().length === 0 || formNombre.length > 50) {
      nextErrors.nombre = 'Por favor, ingresa un nombre válido para el recurso.'
    }
    if (formDescripcion && formDescripcion.length > 200) {
      nextErrors.descripcion = 'La descripción no puede superar los 200 caracteres.'
    }
    if (!formTipo) {
      nextErrors.tipo = 'Selecciona el tipo de recurso.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const validateNombre = (value: string) => {
    if (!value || value.trim().length === 0 || value.length > 50) {
      return 'Por favor, ingresa un nombre válido para el recurso.'
    }
    return undefined
  }

  const validateDescripcion = (value: string) => {
    if (value && value.length > 200) {
      return 'La descripción no puede superar los 200 caracteres.'
    }
    return undefined
  }

  const handleNuevoRecursoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    if (isEditMode && selectedRecursoId) {
      const idNum = parseInt(selectedRecursoId)
      const existing = recursosResponse.find(r => r.id === idNum)
      const payload = mapFormToRequest({ nombre: formNombre, descripcion: formDescripcion, tipo: formTipo }, existing?.disponibilidadRecurso)

      try {
        const updated = await recursoService.putRecurso(idNum, payload)

        setRecursosResponse((prev) => prev.map((resp) => resp.id === idNum ? updated : resp))

        setRecursos((prev) => prev.map((r) => r.id === selectedRecursoId ? mapResponseToUI(updated) : r))

        setIsSheetOpen(false)
        setFormNombre('')
        setFormDescripcion('')
        setFormTipo('')
        setIsEditMode(false)
        setSelectedRecursoId(null)
      } catch (err) {
        console.error('Error actualizando recurso:', err)
        setErrors((prev) => ({ ...prev, nombre: 'Error al actualizar el recurso. Intenta de nuevo.' }))
      }

    } else {
      // Create new recurso via API
      const payload = mapFormToRequest({ nombre: formNombre, descripcion: formDescripcion, tipo: formTipo })

      try {
        const created = await recursoService.postRecurso(payload)

        setRecursosResponse((prev) => [...prev, created])

        setRecursos((prev) => [
          ...prev,
          mapResponseToUI(created),
        ])

        setIsSheetOpen(false)
        setFormNombre('')
        setFormDescripcion('')
        setFormTipo('')
        setIsEditMode(false)
        setSelectedRecursoId(null)
      } catch (err) {
        console.error('Error creando recurso:', err)
        setErrors((prev) => ({ ...prev, nombre: 'Error al crear el recurso. Intenta de nuevo.' }))
      }
    }
  }

  const columns = useMemo<ColumnDef<RecursoUI>[]>(
    () => [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => {
          return (
            <button
              className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                row.toggleExpanded()
              }}
            >
              {row.getIsExpanded() ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )
        },
        size: 24,
        meta: {
          skeleton: <Skeleton className="h-6 w-6 rounded-md" />,
          expandedContent: (row: RecursoUI) => (
            <div
              className="px-6 py-4 border-l-4"
              style={{ backgroundColor: '#4C6C5B14', borderLeftColor: '#4C6C5B' }}
            >
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Descripción detallada</h4>
                  <p className="text-gray-600 leading-relaxed">{row.descripcion}</p>
                </div>
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: 'nombre',
        id: 'nombre',
        header: ({ column }) => <DataGridColumnHeader title="Recurso" column={column} />,
        cell: ({ row }) => {
          const isZona = row.original.tipo === 'zona'
          return (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isZona ? '#F1E8D6' : '#E3E4EA' }}
              >
                {isZona ? (
                  <MapPin className="w-4 h-4" style={{ color: '#A39170' }} />
                ) : (
                  <Package className="w-4 h-4" style={{ color: '#595D75' }} />
                )}
              </div>
              <div className="space-y-px">
                <div className="font-medium text-gray-900">{row.original.nombre}</div>
                <div className="text-xs text-gray-500">
                  {isZona ? 'Zona común' : 'Objeto'}
                </div>
              </div>
            </div>
          )
        },
        enableSorting: true,
        enableHiding: false,
        size: 220,
        meta: {
          skeleton: (
            <div className="flex items-center gap-1.5">
              <Skeleton className="w-8 h-8 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: 'descripcion',
        id: 'descripcion',
        header: ({ column }) => <DataGridColumnHeader title="Descripción" column={column} />,
        cell: ({ row }) => (
          <span className="line-clamp-1 text-gray-600" title={row.original.descripcion}>
            {row.original.descripcion}
          </span>
        ),
        enableSorting: false,
        size: 480,
        meta: {
          skeleton: <Skeleton className="h-4 w-64" />,
        },
      },
      {
        accessorKey: 'tipo',
        id: 'tipo',
        header: ({ column }) => <DataGridColumnHeader title="Tipo" column={column} />,
        cell: ({ row }) => (
          <Badge 
            variant={row.original.tipo === 'zona' ? 'secondary' : 'outline'} 
            appearance="light"
          >
            {row.original.tipo === 'zona' ? 'Zona' : 'Objeto'}
          </Badge>
        ),
        enableSorting: true,
        size: 120,
        meta: {
          skeleton: <Skeleton className="h-6 w-16" />,
        },
      },
      {
        accessorKey: 'estado',
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
        cell: ({ row }) => {
          const estado = row.original.disponibilidadRecurso
          const getBadgeVariant = () => {
            if (estado === 'DISPONIBLE') return 'success'
            if (estado === 'EN_MANTENIMIENTO') return 'warning'
            return 'destructive'
          }
          return (
            <Badge
              variant={getBadgeVariant()}
              appearance="outline"
            >
              {row.original.estado}
            </Badge>
          )
        },
        enableSorting: true,
        size: 140,
        meta: {
          skeleton: <Skeleton className="h-6 w-24" />,
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button aria-label="acciones" variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    setIsEditMode(true)
                    setSelectedRecursoId(row.original.id)
                    setFormNombre(row.original.nombre)
                    setFormDescripcion(row.original.descripcion)
                    setFormTipo(row.original.tipo)
                    setErrors({})
                    setIsSheetOpen(true)
                  }}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className={row.original.habilitado ? 'text-red-600 focus:text-red-600 focus:bg-red-50' : 'text-green-700 focus:text-green-700 focus:bg-green-50'}
                      onSelect={(e) => e.preventDefault()}
                    >
                      {row.original.habilitado ? (
                        <XCircle className="mr-2 h-4 w-4" />
                      ) : (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      {row.original.habilitado ? 'Deshabilitar' : 'Habilitar'}
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {row.original.habilitado ? `¿Deshabilitar recurso "${row.original.nombre}"?` : `¿Habilitar recurso "${row.original.nombre}"?`}
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {row.original.habilitado
                          ? `El recurso "${row.original.nombre}" quedará no disponible para reservas o uso hasta que lo habilites nuevamente.`
                          : `El recurso "${row.original.nombre}" quedará disponible para su uso.`}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            const id = parseInt(row.original.id)
                            const nuevoEstado = !row.original.habilitado
                            if (nuevoEstado) {
                              await habilitarRecurso(id)
                            } else {
                              await deshabilitarRecurso(id)
                            }
                            setRecursos(prev =>
                              prev.map(r =>
                                r.id === row.original.id ? { 
                                  ...r, 
                                  habilitado: nuevoEstado, 
                                  estado: nuevoEstado ? 'Disponible' : 'No disponible',
                                  disponibilidadRecurso: nuevoEstado ? 'DISPONIBLE' : 'NO_DISPONIBLE'
                                } : r
                              )
                            )
                          } catch (err) {
                            console.error('No se pudo actualizar el estado del recurso, por favor intenta nuevamente.', err)
                          }
                        }}
                        className={row.original.habilitado ? 'bg-red-600 hover:bg-red-700' : 'text-white hover:opacity-90'}
                        style={row.original.habilitado ? undefined : { backgroundColor: '#4C6C5B' }}
                      >
                        Confirmar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                {row.original.disponibilidadRecurso !== 'EN_MANTENIMIENTO' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-amber-700 focus:bg-yellow-50 focus:text-amber-700 hover:bg-yellow-50 hover:text-amber-700"
                        onSelect={(e) => e.preventDefault()}
                      >
                        <Wrench className="mr-2 h-4 w-4" />
                        En Mantenimiento
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Poner recurso "{row.original.nombre}" en mantenimiento?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          El recurso "{row.original.nombre}" quedará en mantenimiento y no estará disponible para reservas o uso hasta que cambies su estado.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            try {
                              const id = parseInt(row.original.id)
                              const existing = recursosResponse.find(r => r.id === id)
                              if (existing) {
                                const payload = mapFormToRequest(
                                  { 
                                    nombre: existing.nombre, 
                                    descripcion: existing.descripcion, 
                                    tipo: existing.tipoRecursoComun === 'ZONA' ? 'zona' : 'objeto' 
                                  }, 
                                  'EN_MANTENIMIENTO'
                                )
                                const updated = await recursoService.putRecurso(id, payload)
                                setRecursosResponse((prev) => prev.map((resp) => resp.id === id ? updated : resp))
                                setRecursos((prev) =>
                                  prev.map(r =>
                                    r.id === row.original.id ? {
                                      ...r,
                                      disponibilidadRecurso: 'EN_MANTENIMIENTO',
                                      estado: 'En Mantenimiento',
                                      habilitado: false
                                    } : r
                                  )
                                )
                              }
                            } catch (err) {
                              console.error('No se pudo poner el recurso en mantenimiento, por favor intenta nuevamente.', err)
                            }
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white"
                        >
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ),
        size: 80,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-8 w-8 rounded-md" />,
        },
      },
    ],
    [setRecursos, habilitarRecurso, deshabilitarRecurso]
  )

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: Math.ceil((filteredData?.length || 0) / pagination.pageSize),
  getRowId: (row: RecursoUI) => row.id,
  getRowCanExpand: (row) => Boolean(row.original.descripcion),
    state: {
      pagination,
      sorting,
      expanded,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
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
                <BreadcrumbLink href="/admin/bienes-comunes">
                  Bienes Comunes
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Recursos</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Recursos</h1>
              <p className="text-gray-500 mt-1">
                Administra zonas y objetos de uso común del condominio.
              </p>
            </div>
          </div>

          {/* Filtros y controles */}
          <AnimatedTabs
            value={filterType}
            onValueChange={(v) => setFilterType(v as 'todas' | 'zonas' | 'objetos')}
            tabs={[
              {
                value: 'todas',
                label: 'Todos',
                content: !loading && filteredData.length === 0 ? (
                  <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-base font-semibold text-gray-700">
                          {searchTerm || estadoFilter !== 'todas' ? 'No se encontraron resultados' : 'No hay recursos registrados'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? `No hay recursos que coincidan con "${searchTerm}"${estadoFilter !== 'todas' ? ` y estado ${estadoFilter === 'disponible' ? 'disponible' : estadoFilter === 'en-mantenimiento' ? 'en mantenimiento' : 'no disponible'}` : ''}`
                            : estadoFilter !== 'todas'
                              ? `No hay recursos con estado ${estadoFilter === 'disponible' ? 'disponible' : estadoFilter === 'en-mantenimiento' ? 'en mantenimiento' : 'no disponible'}${filterType !== 'todas' ? ` de tipo ${filterType === 'zonas' ? 'zona' : 'objeto'}` : ''}`
                              : filterType === 'zonas'
                                ? 'No hay zonas comunes registradas'
                                : filterType === 'objetos'
                                  ? 'No hay objetos registrados'
                                  : 'No hay registros de recursos disponibles en este momento'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DataGrid
                    table={table}
                    recordCount={filteredData?.length || 0}
                    loadingMode="skeleton"
                    isLoading={loading}
                    tableLayout={{ headerBackground: false, rowBorder: true, rowRounded: false }}
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
                      />
                    </div>
                  </DataGrid>
                ),
              },
              {
                value: 'zonas',
                label: 'Zonas',
                content: !loading && filteredData.length === 0 ? (
                  <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-base font-semibold text-gray-700">
                          {searchTerm || estadoFilter !== 'todas' ? 'No se encontraron resultados' : 'No hay recursos registrados'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? `No hay recursos que coincidan con "${searchTerm}"${estadoFilter !== 'todas' ? ` y estado ${estadoFilter === 'disponible' ? 'disponible' : estadoFilter === 'en-mantenimiento' ? 'en mantenimiento' : 'no disponible'}` : ''}`
                            : estadoFilter !== 'todas'
                              ? `No hay recursos con estado ${estadoFilter === 'disponible' ? 'disponible' : estadoFilter === 'en-mantenimiento' ? 'en mantenimiento' : 'no disponible'}${filterType !== 'todas' ? ` de tipo ${filterType === 'zonas' ? 'zona' : 'objeto'}` : ''}`
                              : filterType === 'zonas'
                                ? 'No hay zonas comunes registradas'
                                : filterType === 'objetos'
                                  ? 'No hay objetos registrados'
                                  : 'No hay registros de recursos disponibles en este momento'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DataGrid
                    table={table}
                    recordCount={filteredData?.length || 0}
                    loadingMode="skeleton"
                    isLoading={loading}
                    tableLayout={{ headerBackground: false, rowBorder: true, rowRounded: false }}
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
                      />
                    </div>
                  </DataGrid>
                ),
              },
              {
                value: 'objetos',
                label: 'Objetos',
                content: !loading && filteredData.length === 0 ? (
                  <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-base font-semibold text-gray-700">
                          {searchTerm || estadoFilter !== 'todas' ? 'No se encontraron resultados' : 'No hay recursos registrados'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? `No hay recursos que coincidan con "${searchTerm}"${estadoFilter !== 'todas' ? ` y estado ${estadoFilter === 'disponible' ? 'disponible' : estadoFilter === 'en-mantenimiento' ? 'en mantenimiento' : 'no disponible'}` : ''}`
                            : estadoFilter !== 'todas'
                              ? `No hay recursos con estado ${estadoFilter === 'disponible' ? 'disponible' : estadoFilter === 'en-mantenimiento' ? 'en mantenimiento' : 'no disponible'}${filterType !== 'todas' ? ` de tipo ${filterType === 'zonas' ? 'zona' : 'objeto'}` : ''}`
                              : filterType === 'zonas'
                                ? 'No hay zonas comunes registradas'
                                : filterType === 'objetos'
                                  ? 'No hay objetos registrados'
                                  : 'No hay registros de recursos disponibles en este momento'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DataGrid
                    table={table}
                    recordCount={filteredData?.length || 0}
                    loadingMode="skeleton"
                    isLoading={loading}
                    tableLayout={{ headerBackground: false, rowBorder: true, rowRounded: false }}
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
                      />
                    </div>
                  </DataGrid>
                ),
              },
            ]}
            rightContent={
              <>
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
                            estadoFilter === 'disponible' ? 'bg-green-500' :
                            estadoFilter === 'en-mantenimiento' ? 'bg-yellow-500' :
                            'bg-red-500'
                          )}></span>
                          <span className="truncate">
                            {estadoFilter === 'disponible' ? 'Disponible' :
                             estadoFilter === 'en-mantenimiento' ? 'En Mantenimiento' :
                             'No disponible'}
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
                            value="disponible"
                            onSelect={() => {
                              setEstadoFilter('disponible')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-green-500"></span>
                              <span className="truncate">Disponible</span>
                            </span>
                            {estadoFilter === 'disponible' && <CommandCheck />}
                          </CommandItem>
                          <CommandItem
                            value="no-disponible"
                            onSelect={() => {
                              setEstadoFilter('no-disponible')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-red-500"></span>
                              <span className="truncate">No disponible</span>
                            </span>
                            {estadoFilter === 'no-disponible' && <CommandCheck />}
                          </CommandItem>
                          <CommandItem
                            value="en-mantenimiento"
                            onSelect={() => {
                              setEstadoFilter('en-mantenimiento')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-yellow-500"></span>
                              <span className="truncate">En Mantenimiento</span>
                            </span>
                            {estadoFilter === 'en-mantenimiento' && <CommandCheck />}
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
                    placeholder="Buscar recursos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
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
                <Button className="gap-2" onClick={() => { setIsEditMode(false); setSelectedRecursoId(null); setFormNombre(''); setFormDescripcion(''); setFormTipo(''); setErrors({}); setIsSheetOpen(true) }}>
                  <Plus className="w-4 h-4" />
                  Nuevo recurso
                </Button>
              </>
            }
          />
        </div>
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent 
          side="right" 
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250"
          style={{ width: '500px', maxWidth: 'none' }}
        >
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl font-semibold">{isEditMode ? 'Editar Recurso' : 'Agregar Recurso'}</SheetTitle>
            <SheetDescription className="text-gray-600">
              {isEditMode ? 'Modifica la información del recurso seleccionado.' : 'Agrega un recurso de bienes comunes.'}
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleNuevoRecursoSubmit} className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 px-4 pt-4">
                <FormFieldWithTooltip 
                  label="Nombre" 
                  required 
                  invalid={Boolean(errors.nombre)} 
                  error={errors.nombre}
                >
                  <Input id="nombre" value={formNombre} onChange={(e) => {
                    const val = e.target.value
                    setFormNombre(val)
                    const err = validateNombre(val)
                    setErrors((prev) => ({ ...prev, nombre: err }))
                  }} placeholder="Ej. Salón Comunal" />
                </FormFieldWithTooltip>

                <FormFieldWithTooltip 
                  label="Descripción" 
                  invalid={Boolean(errors.descripcion)} 
                  error={errors.descripcion}
                >
                  <textarea
                    id="descripcion"
                    value={formDescripcion}
                    onChange={(e) => {
                      const val = e.target.value
                      setFormDescripcion(val)
                      const err = validateDescripcion(val)
                      setErrors((prev) => ({ ...prev, descripcion: err }))
                    }}
                    placeholder="Describe el recurso, condiciones de uso, etc."
                    className="w-full min-h-28 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-200"
                  />
                </FormFieldWithTooltip>

                <FormFieldWithTooltip 
                  label="Tipo" 
                  required 
                  invalid={Boolean(errors.tipo)} 
                  error={errors.tipo || 'Selecciona el tipo de recurso.'}
                >
                  <Select value={formTipo} onValueChange={(v) => {
                    setFormTipo(v as 'zona' | 'objeto')
                    setErrors((prev) => ({ ...prev, tipo: undefined }))
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo de recurso" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zona">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#F1E8D6' }}>
                            <MapPin className="w-3.5 h-3.5" style={{ color: '#A39170' }} />
                          </span>
                          <span>Zona</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="objeto">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#E3E4EA' }}>
                            <Package className="w-3.5 h-3.5" style={{ color: '#595D75' }} />
                          </span>
                          <span>Objeto</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormFieldWithTooltip>
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-3 mt-auto px-4 pb-4">
              <SheetClose asChild>
                <Button variant="outline" type="button" className="flex-1">Cancelar</Button>
              </SheetClose>
              <Button type="submit" className="flex-1">{isEditMode ? 'Guardar cambios' : 'Agregar recurso'}</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
