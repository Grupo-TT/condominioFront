'use client'

import { useMemo, useState, useRef, useId } from 'react'
import { Search, X } from 'lucide-react'
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
import { InvoiceIcon } from '@hugeicons/core-free-icons'
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
import { ObligacionPendiente } from '@/types/casa.types'

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

interface ObligacionesProps {
  obligaciones: ObligacionPendiente[]
}

export function ObligacionesTab({
  obligaciones,
}: ObligacionesProps) {
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

  const formatEstado = (e: string) => e === "POR_COBRAR" ? "Abonado" : e.toLowerCase().replace(/_/g, " ").replace(/^\w/, c => c.toUpperCase());
  const formatEstadoFilter = (e: string) => e === "POR_COBRAR" ? "Abonadas" : e === "CONDONADO" ? "Condonadas" : e === "PENDIENTE" ? "Pendientes" : "Todas";

  // Filtrar obligaciones
  const obligacionesFiltradas = useMemo(() => {
    let filtradas = obligaciones

    // Filtrar por año
    filtradas = filtradas.filter(o => o.año === parseInt(añoSeleccionado))

    // Filtrar por estado
    if (estadoFilter !== 'todas') {
      filtradas = filtradas.filter(o => o.estadoPago === estadoFilter)
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtradas = filtradas.filter(o =>
        o.titulo.toLowerCase().includes(searchLower)
      )
    }

    return filtradas
  }, [searchTerm, estadoFilter, añoSeleccionado, obligaciones])

  const handleClearSearch = () => {
    setSearchTerm('')
    searchInputRef.current?.focus()
  }

  // Columnas para tabla de obligaciones pendientes
  const columns: ColumnDef<ObligacionPendiente>[] = useMemo(() => [
    {
      accessorKey: 'titulo',
      id: 'titulo',
      header: ({ column }) => (
        <div className="pl-[52px]">
          <DataGridColumnHeader title="Obligación" column={column} />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{
              backgroundColor: '#F1E8D6'
            }}
          >
            <HugeiconsIcon 
              icon={InvoiceIcon} 
              size={19} 
              style={{ color: '#A39170' }}
              strokeWidth={1.5}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900">
              {row.original.titulo}
            </div>
          </div>
        </div>
      ),
      size: 300,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'valorTotal',
      id: 'valorTotal',
      header: ({ column }) => <DataGridColumnHeader title="Valor Total" column={column} />,
      cell: ({ row }) => (
        <div className="font-semibold text-gray-900">
          {formatCurrency(row.original.valorTotal)}
        </div>
      ),
      enableSorting: true,
      size: 150,
    },
    {
      accessorKey: 'saldoPendiente',
      id: 'saldoPendiente',
      header: ({ column }) => <DataGridColumnHeader title="Saldo Pendiente" column={column} />,
      cell: ({ row }) => (
        <div className="font-semibold text-red-600">
          {formatCurrency(row.original.valorPendiente)}
        </div>
      ),
      enableSorting: true,
      size: 150,
    },
    {
      accessorKey: 'abonado',
      id: 'abonado',
      header: ({ column }) => <DataGridColumnHeader title="Abonado" column={column} />,
      cell: ({ row }) => (
        <div className="font-semibold text-green-600">
          {formatCurrency(row.original.montoPagado)}
        </div>
      ),
      enableSorting: true,
      size: 150,
    },
    {
      accessorKey: 'estado',
      id: 'estado',
      header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
      cell: ({ row }) => {
        let badgeVariant: 'success' | 'destructive' | 'warning' = 'warning'
        let dotColor = 'bg-yellow-500'
        const estado = formatEstado(row.original.estadoPago);
        if (estado === 'Condonado') {
          badgeVariant = 'success'
          dotColor = 'bg-green-500'
        } else if (estado === 'Abonado') {
          badgeVariant = 'warning'
          dotColor = 'bg-yellow-500'
        } else {
          badgeVariant = 'destructive'
          dotColor = 'bg-red-500'
        }
        
        return (
          <Badge
            variant={badgeVariant}
            appearance="outline"
            size="md"
            className="gap-1.5"
          >
            <span className={`w-2 h-2 rounded-full ${dotColor}`} />
            {estado}
          </Badge>
        )
      },
      enableSorting: true,
      size: 120,
    },
  ], [])

  const table = useReactTable({
    data: obligacionesFiltradas,
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

  const hasResults = obligacionesFiltradas.length > 0

  return (
    <div className="space-y-4 pb-6">
      {/* Filtros y controles */}
      <div className="flex items-center justify-between gap-3">
        {/* Searchbar y filtro por estado a la izquierda */}
        <div className="flex items-center gap-3">
          <div className="relative w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              placeholder="Buscar obligaciones..."
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
                      estadoFilter === 'POR_COBRAR' ? 'bg-yellow-500' :
                      'bg-green-500'
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
                      value="Pendiente"
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
                      value="Abonado"
                      onSelect={() => {
                        setEstadoFilter('POR_COBRAR')
                        setEstadoComboboxOpen(false)
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="ms-1 size-1.5 rounded-full bg-yellow-500"></span>
                        <span className="truncate">Abonadas</span>
                      </span>
                      {estadoFilter === 'POR_COBRAR' && <CommandCheck />}
                    </CommandItem>
                    <CommandItem
                      value="Pagada"
                      onSelect={() => {
                        setEstadoFilter('CONDONADO')
                        setEstadoComboboxOpen(false)
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="ms-1 size-1.5 rounded-full bg-green-500"></span>
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

      {/* Tabla de obligaciones pendientes */}
      {hasResults ? (
        <DataGrid
          table={table}
          recordCount={obligacionesFiltradas.length}
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
              ? `No hay obligaciones que coincidan con "${searchTerm}"`
              : 'No hay obligaciones registradas'
            }
          </p>
        </div>
      )}
    </div>
  )
}

