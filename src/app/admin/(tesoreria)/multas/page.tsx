'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
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

export default function MultasPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'POR_COBRAR' | 'CONDONADO'>('POR_COBRAR')
  const searchInputRef = useRef<HTMLInputElement>(null)
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
  const [editTipoPago, setEditTipoPago] = useState<'efectivo' | 'labor-social'>('efectivo')

  const { multasData, loading, error, refreshMultas, nuevaMulta } = useMultas()
  console.log(multasData)

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const handleViewDetail = useCallback((multa: Multa) => {
    setSelectedMulta(multa)
    setIsDetailSheetOpen(true)
  }, [])

  const handleEdit = useCallback((multa: Multa) => {
    setEditingMulta(multa)
    setEditTitulo(multa.motivo)
    setEditDescripcion(multa.observaciones || '')
    setEditValor(multa.monto.toString())
    setEditTipoPago(multa.tipoPago || 'efectivo')
    setIsEditSheetOpen(true)
  }, [])

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Debe enviar el formato correcto a createNuevaMulta
    const ok = await nuevaMulta({
      idCasa: editingMulta?.id,
      titulo: editTitulo,
      motivo: editDescripcion,
      monto: Number(editValor),
      // tipoPago: "DINERO"
    })

    console.log(ok)
    // Aquí irá la llamada a la API para actualizar la multa
    setIsEditSheetOpen(false)
  }

  const handleEditCancel = () => {
    setEditTitulo('')
    setEditDescripcion('')
    setEditValor('')
    setEditTipoPago('efectivo')
    setEditingMulta(null)
    setIsEditSheetOpen(false)
  }

  // Filtrar datos basándose en el término de búsqueda y tipo
  const filteredMultas = useMemo(() => {
    if (!multasData || multasData.length === 0) return []
    const searchLower = searchTerm.toLowerCase()

    return multasData.filter(multa => {
      // Filtrar por estado (siempre aplica)
      if (multa.estadoPago !== filterType) {
        console.log(multa.estadoPago)
        console.log(filterType)
        return false
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        return (
          multa.propietario.toLowerCase().includes(searchLower) ||
          multa.numeroCasa.toLowerCase().includes(searchLower) ||
          multa.motivo.toLowerCase().includes(searchLower) ||
          multa.monto.toString().includes(searchLower)
        )
      }

      return true
    })
  }, [searchTerm, multasData, filterType])

  // Verificar si hay resultados
  const hasResults = filteredMultas.length > 0
  console.log(filteredMultas)

  const columns = useMemo<ColumnDef<Multa>[]>(
    () => [
      {
        accessorKey: 'motivo',
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
                className="font-semibold text-gray-900 hover:text-green-700 transition-all duration-200 cursor-pointer text-left relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-green-700 after:transition-all after:duration-200 hover:after:w-full"
              >
                {row.original.motivo}
              </button>
              <div className="text-sm text-gray-500 truncate">{row.original.observaciones || 'Sin descripción'}</div>
            </div>
          </div>
        ),
        size: 300,
        enableSorting: true,
        enableHiding: false,
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
        accessorKey: 'estado',
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
        cell: ({ row }) => {
          const estado = row.original.estadoPago
          return (
            <Badge
              variant={estado === 'CONDONADO' ? 'success' : 'destructive'}
              appearance="outline"
              size="md"
              className="gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${estado === 'CONDONADO' ? 'bg-green-700' : 'bg-red-700'
                  }`}
              />
              {estado === 'CONDONADO' ? 'CONDONADO' : 'POR_COBRAR'}
            </Badge>
          )
        },
        size: 120,
        enableSorting: true,
      },
      {
        accessorKey: 'tipoPago',
        id: 'tipoPago',
        header: ({ column }) => <DataGridColumnHeader title="Tipo de Pago" column={column} />,
        cell: ({ row }) => {
          const tipoPago = row.original.tipoPago || 'efectivo'
          return (
            <Badge
              variant={tipoPago === 'efectivo' ? 'outline' : 'secondary'}
              appearance="light"
              size="md"
            >
              {tipoPago === 'efectivo' ? 'Efectivo' : 'Labor Social'}
            </Badge>
          )
        },
        size: 80,
        enableSorting: true,
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
                        <strong>{row.original.motivo}</strong> del propietario{' '}
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
                <BreadcrumbLink href="/admin/tesoreria">
                  Tesorería
                </BreadcrumbLink>
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
          <Tabs value={filterType} onValueChange={(v) => setFilterType(v as 'POR_COBRAR' | 'CONDONADO')} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="POR_COBRAR">Pendientes</TabsTrigger>
                <TabsTrigger value="CONDONADO">Pagadas</TabsTrigger>
              </TabsList>
              <div className="flex items-center gap-3">
                <div className="relative w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Buscar multas..."
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
                <Button className="gap-2" onClick={() => setIsFormSheetOpen(true)}>
                  <Plus className="w-4 h-4" />
                  Asignar Multa
                </Button>
              </div>
            </div>

            <TabsContent value="POR_COBRAR">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-12 h-12 mx-auto animate-pulse" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    Cargando multas...
                  </h3>
                  <p className="text-gray-500 text-sm">Por favor espera un momento.</p>
                </div>
              ) : error ? (
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
              ) : hasResults ? (
                <DataGrid
                  table={table}
                  recordCount={filteredMultas?.length || 0}
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
                      ? `No hay multas pendientes que coincidan con "${searchTerm}"`
                      : 'No hay multas pendientes'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="CONDONADO">
              {hasResults ? (
                <DataGrid
                  table={table}
                  recordCount={filteredMultas?.length || 0}
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
                      ? `No hay multas pagadas que coincidan con "${searchTerm}"`
                      : 'No hay multas pagadas'
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
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 p-0 flex flex-col"
          style={{ width: '420px', maxWidth: 'none' }}
        >
          {selectedMulta && (
            <>
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-base font-semibold text-gray-900">Detalles de Multa</h2>
              </div>

              {/* Título y descripción */}
              <div className="px-6 pt-3 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedMulta.estadoPago === 'CONDONADO' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                    <HugeiconsIcon
                      icon={FileCorruptIcon}
                      size={18}
                      className={selectedMulta.estadoPago === 'CONDONADO' ? 'text-green-700' : 'text-red-600'}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedMulta.motivo}</h3>
                </div>
                {selectedMulta.observaciones && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedMulta.observaciones}</p>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-6">
                  {/* Grid 3 columnas: ID, Fecha, Estado */}
                  <div className="grid grid-cols-[auto_auto_auto] gap-6">
                    {/* ID Multa */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">ID Multa</div>
                      <div className="text-sm text-gray-900">#{selectedMulta.id}</div>
                    </div>

                    {/* Fecha */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Fecha:</div>
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {new Date(selectedMulta.fecha).toLocaleDateString('es-CO', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </div>
                    </div>

                    {/* Estado */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Estado:</div>
                      <Badge
                        variant={selectedMulta.estadoPago === 'CONDONADO' ? 'success' : 'destructive'}
                        appearance="outline"
                        size="sm"
                      >
                        {selectedMulta.estadoPago === 'CONDONADO' ? 'CONDONADO' : 'POR_COBRAR'}
                      </Badge>
                    </div>
                  </div>

                  {/* Propietario */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Propietario</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">Nombre:</div>
                        <div className="text-sm text-gray-900">{selectedMulta.propietario}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">Casa:</div>
                        <div className="text-sm text-gray-900">No. {selectedMulta.numeroCasa}</div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles financieros */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">Monto:</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(selectedMulta.monto)}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">Tipo de pago:</div>
                        <div className="text-sm text-gray-900">
                          {selectedMulta.tipoPago === 'efectivo' ? 'Efectivo' : 'Labor Social'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con acciones */}
              <div className="px-6 py-4 border-t border-gray-200">
                <Button
                  onClick={() => {
                    console.log('Editar multa:', selectedMulta.id)
                  }}
                  className="w-full"
                  variant="outline"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar Multa
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Sheet de formulario para asignar multa */}
      <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250"
          style={{ width: '500px', maxWidth: 'none' }}
        >
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl font-semibold">Asignar Multa</SheetTitle>
            <SheetDescription className="text-gray-600">
              Registra una nueva multa para un propietario del condominio.
            </SheetDescription>
          </SheetHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const formNuevaMulta = {
                idCasa: formCasa,
                titulo: formTitulo,
                motivo: formDescripcion,
                monto: Number(formValor),
                }
              console.log('Asignar multa:', formNuevaMulta)
              // Aquí iría la lógica para guardar la multa
              nuevaMulta(formNuevaMulta)
              setIsFormSheetOpen(false)
              // Limpiar formulario
              setFormCasa('')
              setFormTitulo('')
              setFormDescripcion('')
              setFormValor('')
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
                    autoExpand
                    maxHeight={250}
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

            <SheetFooter className="flex flex-row gap-3 mt-auto px-4 pb-4">
              <Button
                variant="outline"
                type="button"
                className="flex-1"
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
                className="flex-1"
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
        <SheetContent side="right" className="sm:max-w-[540px] w-full p-0">
          <form
            onSubmit={handleEditSubmit}
            className="flex flex-col h-full"
          >
            <SheetHeader className="px-6 py-4 border-b">
              <SheetTitle>Editar Multa</SheetTitle>
              <SheetDescription>
                Modifica los detalles de la multa
              </SheetDescription>
            </SheetHeader>

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
                    <span className="text-sm">Casa No. {editingMulta?.numeroCasa} - {editingMulta?.propietario}</span>
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
                    autoExpand
                    maxHeight={250}
                    required
                  />
                </div>

                {/* Tipo de Pago */}
                <div className="space-y-2">
                  <Label htmlFor="edit-tipo-pago" className="text-sm font-medium">
                    Tipo de Pago <span className="text-red-500">*</span>
                  </Label>
                  <Select value={editTipoPago} onValueChange={(value: 'efectivo' | 'labor-social') => setEditTipoPago(value)}>
                    <SelectTrigger id="edit-tipo-pago">
                      <SelectValue placeholder="Selecciona el tipo de pago">
                        {editTipoPago && (
                          <div className="flex items-center gap-2">
                            {editTipoPago === 'efectivo' ? (
                              <Banknote className="h-4 w-4 text-green-600" />
                            ) : (
                              <HandHeart className="h-4 w-4 text-blue-600" />
                            )}
                            <span>{editTipoPago === 'efectivo' ? 'Efectivo' : 'Labor Social'}</span>
                          </div>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="efectivo">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4 text-green-600" />
                          <span>Efectivo</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="labor-social">
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

            <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-4 border-t">
              <Button
                variant="outline"
                type="button"
                className="flex-1"
                onClick={handleEditCancel}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
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
