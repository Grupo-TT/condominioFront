'use client'

import { useMemo, useState, useRef, useId } from 'react'
import { Search, X, Eye, MoreVertical } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { HugeiconsIcon } from '@hugeicons/react'
import { FileCorruptIcon } from '@hugeicons/core-free-icons'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { cn } from '@/lib/utils'
import { MultaPropietario } from '@/types/casa.types'

interface MultasProps {
  multas: MultaPropietario[]
}

export function MultasTab({
  multas,
}: MultasProps) {
  const añoSelectId = useId()
  const añoActual = new Date().getFullYear()
  const añosDisponibles = Array.from({ length: 4 }, (_, i) => añoActual - i)
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [estadoFilter, setEstadoFilter] = useState<'todas' | 'PENDIENTE' | 'POR_COBRAR' | 'CONDONADO'>('todas')
  const [estadoComboboxOpen, setEstadoComboboxOpen] = useState(false)
  const [añoSeleccionado, setAñoSeleccionado] = useState(añoActual.toString())
  const searchInputRef = useRef<HTMLInputElement | null>(null)
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [selectedMulta, setSelectedMulta] = useState<MultaPropietario | null>(null)

  const formatEstado = (e: string) => e === "POR_COBRAR" ? "Abonado" : e.toLowerCase().replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase());
  const formatEstadoFilter = (e: string) => e === "POR_COBRAR" ? "Abonadas" : e === "CONDONADO" ? "Condonadas" : e === "PENDIENTE" ? "Pendientes" : "Todas";

  // Filtrar multas
  const multasFiltradas = useMemo(() => {
    let filtradas = multas

    // Filtrar por año
    filtradas = filtradas.filter(m => m.año === parseInt(añoSeleccionado))

    // Filtrar por estado
    if (estadoFilter !== 'todas') {
      filtradas = filtradas.filter(m => m.estadoPago === estadoFilter)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtradas = filtradas.filter(m =>
        m.titulo.toLowerCase().includes(searchLower) ||
        m.motivo.toLowerCase().includes(searchLower)
      )
    }

    return filtradas
  }, [searchTerm, estadoFilter, añoSeleccionado, multas])

  const handleClearSearch = () => {
    setSearchTerm('')
    searchInputRef.current?.focus()
  }

  const handleViewDetail = (multa: MultaPropietario) => {
    setSelectedMulta(multa)
    setIsDetailSheetOpen(true)
  }

  // Columnas para tabla de multas
  const columns: ColumnDef<MultaPropietario>[] = useMemo(() => [
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
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
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
        const fecha = new Date(row.original.fechaGenerada)
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
        const estado = formatEstado(row.original.estadoPago);
        return (
          <Badge
            variant={estado === 'Condonado' ? 'success' : estado === 'Abonado' ? 'warning' : 'destructive'}
            appearance="outline"
            size="md"
            className="gap-1.5"
          >
            <span
              className={`w-2 h-2 rounded-full ${estado === 'Condonado' ? 'bg-green-700' : estado === 'Abonado' ? 'bg-yellow-600' : 'bg-red-700'
                }`}
            />
            {estado}
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
      size: 120,
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      size: 80,
      enableSorting: false,
    },
  ], [])

  const table = useReactTable({
    data: multasFiltradas,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  })

  const hasResults = multasFiltradas.length > 0

  return (
    <div className="pb-6 space-y-4">
      {/* Filtros y controles */}
      <div className="flex items-center justify-between gap-3">
        {/* Searchbar y filtro por estado a la izquierda */}
        <div className="flex items-center gap-3">
          <div className="relative w-96">
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
                      estadoFilter === 'PENDIENTE' ? 'bg-red-500' :
                      estadoFilter === 'POR_COBRAR' ? 'bg-yellow-600' :
                      'bg-green-700'
                    )}></span>
                    <span className="truncate">
                    {formatEstadoFilter(estadoFilter)}
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
                      value="PENDIENTE"
                      onSelect={() => {
                        setEstadoFilter('PENDIENTE')
                        setEstadoComboboxOpen(false)
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="ms-1 size-1.5 rounded-full bg-red-500"></span>
                        <span className="truncate">Pendientes</span>
                      </span>
                      {estadoFilter === 'PENDIENTE' && <CommandCheck />}
                    </CommandItem>
                    <CommandItem
                      value="POR_COBRAR"
                      onSelect={() => {
                        setEstadoFilter('POR_COBRAR')
                        setEstadoComboboxOpen(false)
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="ms-1 size-1.5 rounded-full bg-yellow-600"></span>
                        <span className="truncate">Abonadas</span>
                      </span>
                      {estadoFilter === 'POR_COBRAR' && <CommandCheck />}
                    </CommandItem>
                    <CommandItem
                      value="CONDONADO"
                      onSelect={() => {
                        setEstadoFilter('CONDONADO')
                        setEstadoComboboxOpen(false)
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="ms-1 size-1.5 rounded-full bg-green-700"></span>
                        <span className="truncate">Condonadas</span>
                      </span>
                      {estadoFilter === 'CONDONADO' && <CommandCheck />}
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Selector de año a la derecha */}
        <Select value={añoSeleccionado} onValueChange={setAñoSeleccionado}>
          <SelectTrigger id={añoSelectId} className="w-auto min-w-[120px] h-10 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md">
            <span>
              Año: <SelectValue placeholder="Selecciona un año" />
            </span>
          </SelectTrigger>
          <SelectContent>
            {añosDisponibles.map((año) => (
              <SelectItem key={año} value={año.toString()}>
                {año}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabla de multas */}
      {hasResults ? (
        <DataGrid
          table={table}
          recordCount={multasFiltradas.length}
          isLoading={false}
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
              sizes={[5, 10, 25, 50]}
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
              ? `No hay multas que coincidan con "${searchTerm}"`
              : 'No hay multas registradas'
            }
          </p>
        </div>
      )}

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
              <SheetHeader className="px-6 py-4 border-b border-gray-200">
                <SheetTitle className="text-base font-semibold text-gray-900">Detalles de Multa</SheetTitle>
              </SheetHeader>

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
                  <h3 className="text-lg font-bold text-gray-900">{selectedMulta.titulo}</h3>
                </div>
                {selectedMulta.motivo && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedMulta.motivo}</p>
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
                        {new Date(selectedMulta.fechaGenerada).toLocaleDateString('es-CO', {
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
                        variant={selectedMulta.estadoPago === 'CONDONADO' ? 'success' : selectedMulta.estadoPago === 'POR_COBRAR' ? 'warning' : 'destructive'}
                        appearance="outline"
                        size="sm"
                      >
                        {selectedMulta.estadoPago === 'CONDONADO'
                          ? 'Condonado'
                          : selectedMulta.estadoPago === 'PENDIENTE'
                            ? 'Pendiente'
                            : 'Abonado'}
                      </Badge>
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
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }).format(selectedMulta.monto)}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">Tipo de pago:</div>
                        <div className="text-sm text-gray-900">
                          {selectedMulta.tipoPago === 'DINERO' ? 'Efectivo' : 'Labor Social'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
