'use client'

import { useMemo, useState, useCallback } from 'react'
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, Search, X, MoreVertical, Pencil, Trash2, Eye, Banknote, HandHeart } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileCorruptIcon, Home07Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { AnimatedTabs } from '@/components/animated-tabs'
import { FiltersBar } from '@/components/filters-bar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
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
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Multa } from '@/types/cuotas.types'
import { useMultas } from '@/hooks/useMultas'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import axios from 'axios'

export default function MultasPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'POR_COBRAR' | 'CONDONADO' | 'PENDIENTE'>('PENDIENTE')
  const [estadoFilter, setEstadoFilter] = useState<'todas' | 'abonado' | 'pendiente'>('todas')
  const [estadoComboboxOpen, setEstadoComboboxOpen] = useState(false)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [selectedMulta, setSelectedMulta] = useState<Multa | null>(null)
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false)
  const [formCasa, setFormCasa] = useState('')
  const [formTitulo, setFormTitulo] = useState('')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formValor, setFormValor] = useState('')

  // Estados para el sheet de edición de multa
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editingMulta, setEditingMulta] = useState<Multa | null>(null)
  const [editTitulo, setEditTitulo] = useState('')
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editValor, setEditValor] = useState('')
  const [editTipoPago, setEditTipoPago] = useState<'DINERO' | 'LABOR_SOCIAL'>('DINERO')
  const { multasData, loading, error, refreshMultas, nuevaMulta, modificarMulta } = useMultas()

  const handleViewDetail = useCallback((multa: Multa) => {
    setSelectedMulta(multa)
    setIsDetailSheetOpen(true)
  }, [])

  const handleEdit = useCallback((multa: Multa) => {
    setEditingMulta(multa)
    setEditTitulo(multa.titulo)
    setEditDescripcion(multa.motivo || '')
    setEditValor(multa.monto.toString())
    setEditTipoPago(multa.tipoPago || 'DINERO')
    setIsEditSheetOpen(true)
  }, [])

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await modificarMulta(Number(editingMulta?.id), {
        titulo: editTitulo,
        motivo: editDescripcion,
        monto: Number(editValor),
        tipoPago: editTipoPago,
      })

      toast.success('Multa actualizada exitosamente', {
        duration: 5000,
      })

      setIsEditSheetOpen(false)
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message || 'Error al actualizar la multa'
        : 'Error al actualizar la multa. Intenta de nuevo.'

      toast.error(errorMessage, {
        duration: 5000,
      })
    }
  }

  const handleEditCancel = () => {
    setEditTitulo('')
    setEditDescripcion('')
    setEditValor('')
    setEditTipoPago('DINERO')
    setEditingMulta(null)
    setIsEditSheetOpen(false)
  }

  // Filtrar datos basándose en el término de búsqueda y tipo
  const filteredMultas = useMemo(() => {
    if (!multasData || multasData.length === 0) return [];
    const searchLower = searchTerm.toLowerCase();

    return multasData.filter((multa) => {
      // 🔹 Filtrar por estado agrupado
      if (filterType === "PENDIENTE") {
        if (multa.estadoPago !== "PENDIENTE" && multa.estadoPago !== "POR_COBRAR") {
          return false;
        }
        // 🔹 Filtrar por estado específico dentro de pendientes (abonado/pendiente)
        if (estadoFilter !== 'todas') {
          if (estadoFilter === 'abonado' && multa.estadoPago !== 'POR_COBRAR') {
            return false;
          }
          if (estadoFilter === 'pendiente' && multa.estadoPago !== 'PENDIENTE') {
            return false;
          }
        }
      } else if (filterType === "CONDONADO") {
        if (multa.estadoPago !== "CONDONADO") {
          return false;
        }
      }

      // 🔹 Filtrar por término de búsqueda (si hay)
      if (searchTerm) {
        return (
          multa.propietario?.toLowerCase().includes(searchLower) ||
          multa.casa?.toString().toLowerCase().includes(searchLower) ||
          multa.titulo?.toLowerCase().includes(searchLower) ||
          multa.monto?.toString().includes(searchLower)
        );
      }

      return true;
    });
  }, [multasData, filterType, searchTerm, estadoFilter]);


  // Verificar si hay resultados
  const hasResults = filteredMultas.length > 0

  const columns = useMemo<ColumnDef<Multa>[]>(
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
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <HugeiconsIcon
                icon={FileCorruptIcon}
                size={18}
                color="currentColor"
                strokeWidth={1.5}
                className="text-gray-600"
              />
            </div>
            <div className="min-w-0 flex-1">
              <button
                onClick={() => handleViewDetail(row.original)}
                className="group font-semibold text-gray-900 hover:text-green-700 transition-all duration-200 cursor-pointer text-left truncate inline-block max-w-full"
              >
                <span className="relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-green-700 after:transition-all after:duration-200 group-hover:after:w-full">
                  {row.original.titulo}
                </span>
              </button>
              <div className="text-sm text-gray-500 truncate">{row.original.motivo || 'Sin descripción'}</div>
            </div>
          </div>
        ),
        size: 300,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          ),
        },
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
            <div className="min-w-0 flex-1">
              <div className="font-medium text-gray-900 truncate">{row.original.propietario}</div>
              <div className="text-xs text-gray-500">Casa No.{row.original.casa}</div>
            </div>
          </div>
        ),
        size: 180,
        enableSorting: true,
        meta: {
          skeleton: (
            <div className="flex items-center gap-2.5">
              <Skeleton className="w-3.5 h-3.5 rounded" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: 'monto',
        id: 'valor',
        header: ({ column }) => <DataGridColumnHeader title="Valor" column={column} />,
        cell: ({ row }) => {
          const monto = row.original.monto
          return (
            <div className="font-semibold text-gray-900">
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(monto)}
            </div>
          )
        },
        size: 130,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-5 w-24" />,
        },
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
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: 'estado',
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
        cell: ({ row }) => {
          const estado = row.original.estadoPago
          return (
            <Badge
              variant={estado === 'CONDONADO' ? 'success' : estado === 'POR_COBRAR' ? 'warning' : 'destructive'}
              appearance="outline"
              size="md"
              className="gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${estado === 'CONDONADO' ? 'bg-green-700' : estado === 'POR_COBRAR' ? 'bg-yellow-600' : 'bg-red-700'
                  }`}
              />
              {estado === 'CONDONADO'
                ? 'CONDONADO'
                : estado === 'PENDIENTE'
                  ? 'PENDIENTE'
                  : 'ABONADO'}
            </Badge>
          )
        },
        size: 120,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6 w-20 rounded-full" />,
        },
      },
      {
        accessorKey: 'tipoPago',
        id: 'tipoPago',
        header: ({ column }) => <DataGridColumnHeader title="Tipo de Pago" column={column} />,
        cell: ({ row }) => {
          const tipoPago = row.original.tipoPago || 'DINERO'
          return (
            <Badge
              variant={tipoPago === 'DINERO' ? 'outline' : 'secondary'}
              appearance="light"
              size="md"
            >
              {tipoPago === 'DINERO' ? 'Efectivo' : 'Labor Social'}
            </Badge>
          )
        },
        size: 80,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6 w-16 rounded-full" />,
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onClick={() => handleViewDetail(row.original)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalle
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleEdit(row.original)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 focus:bg-red-50"
                      onSelect={(e) => e.preventDefault()}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar multa?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente la multa{' '}
                        <strong>{row.original.titulo}</strong> del propietario{' '}
                        <strong>{row.original.propietario}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          console.log('Eliminar multa:', row.original.id)
                        }}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
    [handleEdit, handleViewDetail]
  )

  const table = useReactTable({
    columns,
    data: filteredMultas,
    pageCount: Math.ceil((filteredMultas?.length || 0) / pagination.pageSize),
    getRowId: (row: Multa) => row.id,
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
                <span className="text-muted-foreground">Tesorería</span>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Multas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        {/* Contenido con padding */}
        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Multas</h1>
            <p className="text-gray-500 mt-1">
              Visualiza, modifica y asigna multas a los propietarios del condominio.
            </p>
          </div>

          {/* Filtros y controles */}
          <AnimatedTabs
            value={filterType}
            onValueChange={(v) => {
              setFilterType(v as 'POR_COBRAR' | 'CONDONADO' | 'PENDIENTE')
              // Resetear el filtro de estado cuando cambia la pestaña
              if (v !== 'PENDIENTE') {
                setEstadoFilter('todas')
              }
            }}
            tabs={[
              {
                value: 'PENDIENTE',
                label: 'Pendientes',
                content: error ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-red-500 mb-2">
                      <X className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Error al cargar multas
                    </h3>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <Button onClick={refreshMultas} className="mt-4">
                      Reintentar
                    </Button>
                  </div>
                ) : (
                  <>
                    <DataGrid
                      table={table}
                      recordCount={loading ? 10 : filteredMultas?.length || 0}
                      isLoading={loading}
                      loadingMode="skeleton"
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
                        />
                      </div>
                    </DataGrid>
                    {!loading && !hasResults && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-gray-400 mb-2">
                          <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No se encontraron resultados
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {searchTerm || estadoFilter !== 'todas'
                            ? `No hay multas pendientes que coincidan con "${searchTerm || ''}"${estadoFilter !== 'todas' ? ` y estado ${estadoFilter === 'abonado' ? 'abonado' : 'pendiente'}` : ''}`
                            : 'No hay multas pendientes'
                          }
                        </p>
                      </div>
                    )}
                  </>
                ),
              },
              {
                value: 'CONDONADO',
                label: 'Pagadas',
                content: error ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-red-500 mb-2">
                      <X className="w-12 h-12 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">
                      Error al cargar multas
                    </h3>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <Button onClick={refreshMultas} className="mt-4">
                      Reintentar
                    </Button>
                  </div>
                ) : (
                  <>
                    <DataGrid
                      table={table}
                      recordCount={loading ? 10 : filteredMultas?.length || 0}
                      isLoading={loading}
                      loadingMode="skeleton"
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
                        />
                      </div>
                    </DataGrid>
                    {!loading && !hasResults && (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="text-gray-400 mb-2">
                          <Search className="w-12 h-12 mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          No se encontraron resultados
                        </h3>
                        <p className="text-gray-500 text-sm">
                          {searchTerm
                            ? `No hay multas pagadas que coincidan con "${searchTerm}"`
                            : 'No hay multas pagadas'
                          }
                        </p>
                      </div>
                    )}
                  </>
                ),
              },
            ]}
            rightContent={
              <>
                <FiltersBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  searchPlaceholder="Buscar multas..."
                  showEstadoFilter={filterType === 'PENDIENTE'}
                  estadoFilter={estadoFilter}
                  onEstadoFilterChange={setEstadoFilter}
                  estadoComboboxOpen={estadoComboboxOpen}
                  onEstadoComboboxOpenChange={setEstadoComboboxOpen}
                />
                <Button className="gap-2" onClick={() => setIsFormSheetOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Asignar Multa
                </Button>
              </>
            }
          />
        </div>
      </div>

      {/* Sheet de detalle */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '480px', maxWidth: 'none' }}
        >
          {selectedMulta && (
            <>
              {/* Header con icono */}
              <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedMulta.estadoPago === 'CONDONADO' ? 'bg-green-50' : 'bg-red-50'}`}>
                    <HugeiconsIcon
                      icon={FileCorruptIcon}
                      size={24}
                      className={selectedMulta.estadoPago === 'CONDONADO' ? 'text-green-700' : 'text-red-600'}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                      Detalles de Multa
                    </SheetTitle>
                    <SheetDescription className="text-sm text-gray-500">
                      Multa registrada el {new Date(selectedMulta.fecha).toLocaleDateString('es-CO', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </SheetDescription>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto">
                <div className="px-6 py-6 space-y-6">
                  {/* Título y descripción */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Título</div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedMulta.titulo}</h3>
                    {selectedMulta.motivo && (
                      <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedMulta.motivo}</p>
                    )}
                  </div>

                  {/* Detalles en grid */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles</div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* ID Multa */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">ID Multa</div>
                        <div className="text-sm font-medium text-gray-900">#{selectedMulta.id}</div>
                      </div>

                      {/* Estado */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Estado</div>
                        <Badge
                          variant={selectedMulta.estadoPago === 'CONDONADO' ? 'success' : selectedMulta.estadoPago === 'POR_COBRAR' ? 'warning' : 'destructive'}
                          appearance="outline"
                          size="sm"
                        >
                          {selectedMulta.estadoPago === 'CONDONADO'
                            ? 'CONDONADO'
                            : selectedMulta.estadoPago === 'PENDIENTE'
                              ? 'PENDIENTE'
                              : 'ABONADO'}
                        </Badge>
                      </div>

                      {/* Fecha */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Fecha</div>
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(selectedMulta.fecha).toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                      </div>

                      {/* Tipo de Pago */}
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Tipo de Pago</div>
                        <div className="text-sm font-medium text-gray-900">
                          {selectedMulta.tipoPago === 'DINERO' ? 'Efectivo' : 'Labor Social'}
                        </div>
                      </div>
                    </div>

                    {/* Propietario */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Propietario</div>
                        <div className="text-sm font-medium text-gray-900">{selectedMulta.propietario}</div>
                        <div className="text-xs text-gray-500">Casa No. {selectedMulta.casa}</div>
                      </div>
                    </div>

                    {/* Monto */}
                    <div className="pt-2 border-t border-gray-100">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">Monto</div>
                        <div className="text-lg font-bold text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(selectedMulta.monto)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con acciones */}
              <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                <Button
                  onClick={() => setIsDetailSheetOpen(false)}
                  className="flex-1 h-10 font-medium"
                  variant="outline"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setIsDetailSheetOpen(false)
                    handleEdit(selectedMulta)
                  }}
                  className="flex-1 h-10 font-medium"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Sheet de formulario para asignar multa */}
      <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '520px', maxWidth: 'none' }}
        >
          {/* Header con icono */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                <HugeiconsIcon icon={FileCorruptIcon} size={24} className="text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  Asignar Multa
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  Registra una nueva multa para un propietario del condominio.
                </SheetDescription>
              </div>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault()
              try {
                const formNuevaMulta = {
                  idCasa: formCasa,
                  titulo: formTitulo,
                  motivo: formDescripcion,
                  monto: Number(formValor),
                }

                await nuevaMulta(formNuevaMulta)

                toast.success('Multa asignada exitosamente', {
                  duration: 5000,
                })

                setIsFormSheetOpen(false)
                // Limpiar formulario
                setFormCasa('')
                setFormTitulo('')
                setFormDescripcion('')
                setFormValor('')
              } catch (err) {
                const errorMessage = axios.isAxiosError(err)
                  ? (err.response?.data as { message?: string })?.message || err.message || 'Error al asignar la multa'
                  : 'Error al asignar la multa. Intenta de nuevo.'

                toast.error(errorMessage, {
                  duration: 5000,
                })
              }
            }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 px-4 pt-4">
                {/* Select de Casa */}
                <div className="space-y-2">
                  <Label htmlFor="casa" className="text-sm font-medium">
                    Casa <span className="text-red-500">*</span>
                  </Label>
                  <Select value={formCasa} onValueChange={setFormCasa}>
                    <SelectTrigger id="casa">
                      <SelectValue placeholder="Selecciona una casa">
                        {formCasa && (
                          <div className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={Home07Icon}
                              size={16}
                              className="text-gray-500"
                            />
                            <span>Casa No. {formCasa}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 22 }, (_, i) => i + 1).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          <div className="flex items-center gap-2">
                            <HugeiconsIcon
                              icon={Home07Icon}
                              size={16}
                              className="text-gray-500"
                            />
                            <span>Casa No. {num}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-sm font-medium">
                    Título de la multa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titulo"
                    value={formTitulo}
                    onChange={(e) => setFormTitulo(e.target.value)}
                    placeholder="Ej. Ruido excesivo en horario nocturno"
                    maxLength={100}
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="descripcion" className="text-sm font-medium">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="descripcion"
                    value={formDescripcion}
                    onChange={(e) => setFormDescripcion(e.target.value)}
                    placeholder="Describe los detalles de la infracción..."
                    required
                  />
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <Label htmlFor="valor" className="text-sm font-medium">
                    Valor (COP) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="valor"
                    type="number"
                    value={formValor}
                    onChange={(e) => setFormValor(e.target.value)}
                    placeholder="Ej. 50000"
                    min="0"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
              <Button
                variant="outline"
                type="button"
                className="flex-1 h-10 font-medium"
                onClick={() => {
                  setIsFormSheetOpen(false)
                  // Limpiar formulario
                  setFormCasa('')
                  setFormTitulo('')
                  setFormDescripcion('')
                  setFormValor('')
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 font-medium"
                disabled={!formCasa || !formTitulo || !formDescripcion || !formValor}
              >
                Asignar Multa
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Sheet para Editar Multa */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '520px', maxWidth: 'none' }}
        >
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col h-full"
          >
            {/* Header con icono */}
            <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-red-50">
                  <HugeiconsIcon icon={FileCorruptIcon} size={24} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                    Editar Multa
                  </SheetTitle>
                  <SheetDescription className="text-sm text-gray-500">
                    Modifica los detalles de la multa
                  </SheetDescription>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 px-6 py-6">
                {/* Casa (Solo lectura) */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Casa
                  </Label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-md">
                    <HugeiconsIcon
                      icon={Home07Icon}
                      size={16}
                      className="text-gray-500"
                    />
                    <span className="text-sm">Casa No. {editingMulta?.casa} - {editingMulta?.propietario}</span>
                  </div>
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="edit-titulo" className="text-sm font-medium">
                    Título de la multa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-titulo"
                    value={editTitulo}
                    onChange={(e) => setEditTitulo(e.target.value)}
                    placeholder="Ej. Mascota sin correa en área común"
                    maxLength={100}
                    required
                  />
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor="edit-descripcion" className="text-sm font-medium">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="edit-descripcion"
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    placeholder="Describe los detalles de la infracción..."
                    required
                  />
                </div>

                {/* Tipo de Pago */}
                <div className="space-y-2">
                  <Label htmlFor="edit-tipo-pago" className="text-sm font-medium">
                    Tipo de Pago <span className="text-red-500">*</span>
                  </Label>
                  <Select value={editTipoPago} onValueChange={(value: 'DINERO' | 'LABOR_SOCIAL') => setEditTipoPago(value)}>
                    <SelectTrigger id="edit-tipo-pago">
                      <SelectValue placeholder="Selecciona el tipo de pago">
                        {editTipoPago && (
                          <div className="flex items-center gap-2">
                            {editTipoPago === 'DINERO' ? (
                              <Banknote className="h-4 w-4 text-green-600" />
                            ) : (
                              <HandHeart className="h-4 w-4 text-blue-600" />
                            )}
                            <span>{editTipoPago === 'DINERO' ? 'Efectivo' : 'Labor Social'}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DINERO">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-green-600" />
                          <span>Efectivo</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="LABOR_SOCIAL">
                        <div className="flex items-center gap-2">
                          <HandHeart className="h-4 w-4 text-blue-600" />
                          <span>Labor Social</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Valor */}
                <div className="space-y-2">
                  <Label htmlFor="edit-valor" className="text-sm font-medium">
                    Valor (COP) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-valor"
                    type="number"
                    value={editValor}
                    onChange={(e) => setEditValor(e.target.value)}
                    placeholder="Ej. 50000"
                    min="0"
                    required
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
            </div>

            <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
              <Button
                variant="outline"
                type="button"
                className="flex-1 h-10 font-medium"
                onClick={handleEditCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 font-medium"
                disabled={!editTitulo || !editDescripcion || !editValor || !editTipoPago}
              >
                Guardar Cambios
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
