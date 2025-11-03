'use client'

import { useMemo, useState, useCallback, useEffect } from 'react'
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
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
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
import { SquareMinus, SquarePlus, Search, X } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { MoneyReceiveFlow01Icon, Home01Icon } from '@hugeicons/core-free-icons'
import { CuotaCasa, Obligacion } from '@/types/cuotas.types'
import { pagoSchema, PagoFormData } from '@/lib/validations/cuotas.validation'
import { FormFieldWithTooltip } from '@/components/forms'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, ButtonArrow } from '@/components/ui/button'
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
import { useCuotas } from '@/hooks/useCuotas'


// Componente para la sub-tabla de obligaciones
function ObligacionesSubTable({
  obligaciones,
  casa,
  onObligacionClick
}: {
  obligaciones: Obligacion[]
  casa: CuotaCasa
  onObligacionClick: (casa: CuotaCasa, obligacion: Obligacion) => void
}) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  })

  const columns = useMemo<ColumnDef<Obligacion>[]>(
    () => [
      {
        accessorKey: 'motivo',
        header: ({ column }) => <DataGridColumnHeader title="Obligación" column={column} />,
        cell: (info) => info.getValue() as string,
        enableSorting: true,
        size: 300,
      },
      {
        accessorKey: 'valorTotal',
        header: ({ column }) => <DataGridColumnHeader title="Valor Total" column={column} />,
        cell: (info) => {
          const value = info.getValue() as number
          return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(value)
        },
        enableSorting: true,
        size: 150,
      },
      {
        accessorKey: 'saldoPendiente',
        header: ({ column }) => <DataGridColumnHeader title="Saldo Pendiente" column={column} />,
        cell: (info) => {
          const value = info.getValue() as number
          return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(value)
        },
        enableSorting: true,
        size: 150,
      },
      {
        accessorKey: 'montoPagado',
        header: ({ column }) => <DataGridColumnHeader title="Abonado" column={column} />,
        cell: (info) => {
          const value = info.getValue() as number
          return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
          }).format(value)
        },
        enableSorting: true,
        size: 150,
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 items-center justify-center border-primary bg-primary/10 text-primary hover:bg-primary/20"
            onClick={() => onObligacionClick(casa, row.original)}
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={MoneyReceiveFlow01Icon} size={20} style={{ width: '20px', height: '20px', paddingBottom: '2px', color: '#4C6C5B' }} />
              <span style={{ paddingTop: '1px', paddingBottom: '0px' }}>Registrar</span>
            </div>
          </Button>
        ),
        size: 120,
        enableSorting: false,
      },
    ],
    [casa, onObligacionClick]
  )

  const table = useReactTable({
    data: obligaciones,
    columns,
    pageCount: Math.ceil(obligaciones.length / pagination.pageSize),
    state: {
      sorting,
      pagination,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row: Obligacion) => row.id,
  })

  return (
    <div
      className="bg-muted/30 p-4 [&_thead]:bg-gray-100 [&_thead_th]:text-gray-700 [&_thead_th]:font-medium [&_table]:rounded-lg [&_table]:overflow-hidden"
      style={{
        animation: 'slideDown 0.2s ease-out',
        transformOrigin: 'top'
      }}
    >
      <style jsx>{`
        @keyframes slideDown {
          0% {
            opacity: 0;
            transform: translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
      <div>
        <DataGrid
          table={table}
          recordCount={obligaciones.length}
          tableLayout={{
            cellBorder: true,
            rowBorder: true,
            headerBackground: true,
            headerBorder: true,
          }}
        >
          <div className="w-full space-y-2.5">
            <DataGridContainer border={false}>
              <ScrollArea>
                <DataGridTable />
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </DataGridContainer>
            <DataGridPagination className="pb-1.5" />
          </div>
        </DataGrid>
      </div>
    </div>
  )
}

export default function CuotasPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [expandedRows, setExpandedRows] = useState<ExpandedState>({})
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedCasa, setSelectedCasa] = useState<CuotaCasa | null>(null)
  const [selectedObligacion, setSelectedObligacion] = useState<Obligacion | null>(null)
  const [showAllErrors, setShowAllErrors] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'todas' | 'al-dia' | 'pendientes'>('todas')
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const { casas, fetchCasas, fetchEstadoCuenta, handleRegistrarPago } = useCuotas()
  // Función para limpiar búsqueda
  const handleClearSearch = () => {
    setSearchTerm('')
  }

  useEffect(() => {
    if (selectedCasa) {
      fetchEstadoCuenta(Number(selectedCasa.numeroCasa))
    }
  }, [selectedCasa, fetchEstadoCuenta])

  // Filtrar datos basándose en el término de búsqueda y tipo
  const filteredCasas = useMemo(() => {
    if (!searchTerm && filterType === 'todas') {
      return casas
    }

    const searchLower = searchTerm.toLowerCase()

    return casas.filter(casa => {
      // Filtrar por tipo
      if (filterType === 'al-dia' && casa.saldoPendiente > 0) {
        return false
      }
      if (filterType === 'pendientes' && casa.saldoPendiente === 0) {
        return false
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        return (
          casa.propietario.nombreCompleto.toLowerCase().includes(searchLower) ||
          casa.numeroCasa.toString().toLowerCase().includes(searchLower) ||
          casa.saldoPendiente.toString().includes(searchLower)
        )
      }

      return true
    })
  }, [casas, searchTerm, filterType])

  // Verificar si hay resultados
  const hasResults = filteredCasas.length > 0

  // Formulario con validaciones
  const form = useForm<PagoFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(pagoSchema) as any,
    mode: "onChange",
    defaultValues: {
      obligacionId: '',
      monto: 0,
    }
  })

  // Función para abrir el sheet desde una casa
  const handleCasaClick = useCallback((casa: CuotaCasa) => {
    setSelectedCasa(casa)
    setSelectedObligacion(null) // No preseleccionar obligación
    form.reset({
      obligacionId: '',
      monto: 0,
    })
    setShowAllErrors(false)
    setIsSheetOpen(true)
  }, [form])

  // Función para abrir el sheet desde una obligación específica
  const handleObligacionClick = useCallback((casa: CuotaCasa, obligacion: Obligacion) => {
    setSelectedCasa(casa)
    setSelectedObligacion(obligacion) // Preseleccionar la obligación
    form.reset({
      obligacionId: obligacion.id,
      monto: obligacion.saldoPendiente,
    })
    setShowAllErrors(false)
    setIsSheetOpen(true)
  }, [form])

  const handleFormSubmit = async (data: PagoFormData) => {

    // Validación adicional: verificar que el monto no supere el saldo pendiente
    const obligacion = selectedCasa?.obligacionesPendientes.find(o => o.id === data.obligacionId)
    if (obligacion && data.monto > obligacion.saldoPendiente) {
      form.setError('monto', {
        type: 'manual',
        message: 'El valor ingresado supera la deuda actual.'
      })
      return
    }

    if (!selectedCasa) {
      console.error("No hay casa seleccionada");
      return;
    }

    try {

      await handleRegistrarPago({
        soporte: selectedCasa.numeroCasa.toString(),
        idObligacion: Number(data.obligacionId),
        montoAPagar: data.monto,
      });

      setIsSheetOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error al registrar pago", error);
      alert("Error al registrar el pago. Por favor, inténtalo de nuevo.");
    }
  }

  // Función para cancelar
  const handleCancelar = () => {
    setIsSheetOpen(false)
    setSelectedCasa(null)
    setSelectedObligacion(null)
    form.reset()
    console.log("Registro de pago cancelado.")
    setShowAllErrors(false)
  }

  useEffect(() => {
    fetchCasas();
  }, [fetchCasas]);

  const columns = useMemo<ColumnDef<CuotaCasa>[]>(
    () => [
      {
        id: 'expand',
        header: () => null,
        cell: ({ row }) => {
          return row.getCanExpand() ? (
            <Button onClick={row.getToggleExpandedHandler()} mode="icon" size="sm" variant="ghost">
              {row.getIsExpanded() ? <SquareMinus /> : <SquarePlus />}
            </Button>
          ) : null
        },
        size: 25,
        enableResizing: false,
        meta: {
          expandedContent: (row: CuotaCasa) => <ObligacionesSubTable obligaciones={row.obligacionesPendientes} casa={row} onObligacionClick={handleObligacionClick} />,
        },
      },
      {
        accessorKey: 'numeroCasa',
        id: 'numeroCasa',
        header: ({ column }) => <DataGridColumnHeader title="Número de Casa" column={column} />,
        cell: ({ row }) => (
          <div>
            <div className="font-semibold text-gray-900">Casa No. {row.original.numeroCasa}</div>
            <div className="text-sm text-gray-500">{row.original.propietario.nombreCompleto}</div>
          </div>
        ),
        size: 250,
        enableSorting: true,
        enableHiding: false,
      },
      {
        accessorKey: 'saldoPendiente',
        id: 'saldoPendiente',
        header: ({ column }) => <DataGridColumnHeader title="Saldo Pendiente" column={column} />,
        cell: ({ row }) => {
          const saldo = row.original.saldoPendiente
          return (
            <div className={`font-semibold ${saldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(saldo)}
            </div>
          )
        },
        size: 150,
        enableSorting: true,
      },
      {
        accessorKey: 'obligacionesPendientes',  
        id: 'obligacionesPendientes',
        header: ({ column }) => <DataGridColumnHeader title="Pagos Pendientes" column={column} />,
        cell: ({ row }) => {
          const cantidad = row.original.obligacionesPendientes.length
          return (
            <Badge
              variant={cantidad === 0 ? 'success' : cantidad <= 2 ? 'warning' : 'destructive'}
              appearance="outline"
              size="md"
            >
              {cantidad} {cantidad === 1 ? 'pago' : 'pagos'}
            </Badge>
          )
        },
        size: 140,
        enableSorting: true,
      },
      {
        accessorKey: 'ultimoPago',
        id: 'ultimoPago',
        header: ({ column }) => <DataGridColumnHeader title="Último Pago" column={column} />,
        cell: ({ row }) => {
          const fecha = new Date(row.original.ultimoPago)
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
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button
            size="sm"
            variant="primary"
            className="gap-2 items-center justify-center"
            onClick={() => handleCasaClick(row.original)}
          >
            <div className="flex items-center gap-2">
              <HugeiconsIcon icon={MoneyReceiveFlow01Icon} size={20} style={{ width: '20px', height: '20px', paddingBottom: '2px' }} />
              <span style={{ paddingTop: '2px', paddingBottom: '0px' }}>Registrar</span>
            </div>
          </Button>
        ),
        size: 120,
        enableSorting: false,
      },
    ],
    [handleCasaClick, handleObligacionClick]
  )

  const table = useReactTable({
    columns,
    data: filteredCasas,
    pageCount: Math.ceil((filteredCasas?.length || 0) / pagination.pageSize),
    getRowId: (row: CuotaCasa) => row.numeroCasa.toString(),
    getRowCanExpand: (row) => Boolean(row.original.obligacionesPendientes && row.original.obligacionesPendientes.length > 0),
    state: {
      pagination,
      sorting,
      expanded: expandedRows,
    },
    columnResizeMode: 'onChange',
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onExpandedChange: setExpandedRows,
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
                <BreadcrumbPage>Cuotas</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Cuotas</h1>
              <p className="text-gray-500 mt-1">
                Administra los pagos de administración y otras obligaciones financieras.
              </p>
            </div>
          </div>

          {/* Filtros y controles */}
          <Tabs value={filterType} onValueChange={(value) => setFilterType(value as 'todas' | 'al-dia' | 'pendientes')} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="al-dia">Al Día</TabsTrigger>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <div className="relative w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Buscar casas..."
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
              </div>
            </div>

            <TabsContent value="todas">
              {hasResults ? (
                /* Tabla */
                <DataGrid
                  table={table}
                  recordCount={filteredCasas?.length || 0}
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
                /* Sin resultados */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? `No hay casas que coincidan con "${searchTerm}"`
                      : 'No hay casas registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="al-dia">
              {hasResults ? (
                /* Tabla */
                <DataGrid
                  table={table}
                  recordCount={filteredCasas?.length || 0}
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
                /* Sin resultados */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? `No hay casas al día que coincidan con "${searchTerm}"`
                      : 'No hay casas al día registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pendientes">
              {hasResults ? (
                /* Tabla */
                <DataGrid
                  table={table}
                  recordCount={filteredCasas?.length || 0}
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
                /* Sin resultados */
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="text-gray-400 mb-2">
                    <Search className="w-12 h-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron resultados
                  </h3>
                  <p className="text-gray-500 text-sm">
                    {searchTerm
                      ? `No hay casas con pagos pendientes que coincidan con "${searchTerm}"`
                      : 'No hay casas con pagos pendientes'
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sheet para registrar pagos */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250"
          style={{ width: '500px', maxWidth: 'none' }}
        >
          <TooltipProvider>
            <SheetHeader className="border-b pb-4">
              <SheetTitle className="text-xl font-semibold">Registrar Pago</SheetTitle>
              <SheetDescription className="text-gray-600">
                Registra un nuevo pago para la casa seleccionada.
              </SheetDescription>
            </SheetHeader>

            <form
              id="pago-form"
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="flex flex-col h-full"
            >
              <div className="flex-1 overflow-y-auto">
                <div className="space-y-6 px-4">
                  {/* Información de la casa */}
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Casa seleccionada</Label>
                    <div className="relative bg-white border border-gray-200 rounded-xl p-6 shadow-sm overflow-hidden">
                      {/* Background pattern */}
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/10 rounded-full translate-y-12 -translate-x-12"></div>

                      {/* Content */}
                      <div className="relative z-10">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <HugeiconsIcon icon={Home01Icon} className="w-6 h-6 text-white" />
                          </div>
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900">Casa No. {selectedCasa?.numeroCasa}</h3>
                            <p className="text-sm text-gray-600 font-medium">{selectedCasa?.propietario.nombreCompleto}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selector de obligación */}
                  <div className="space-y-2">
                    <Label htmlFor="obligacion" className="text-sm font-medium text-gray-700">
                      Obligación a pagar
                    </Label>
                    <Controller
                      name="obligacionId"
                      control={form.control}
                      render={({ field }) => {
                        const obligacionSeleccionada = field.value && selectedCasa?.obligacionesPendientes
                          ? selectedCasa.obligacionesPendientes.find(o => String(o.id) === String(field.value))
                          : null

                        return (
                          <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                mode="input"
                                placeholder={!field.value}
                                aria-expanded={comboboxOpen}
                                className="w-full h-16 justify-between"
                              >
                                {obligacionSeleccionada ? (
                                  <div className="flex flex-col items-start text-left w-full pr-8">
                                    <span className="font-medium text-gray-900 leading-tight">{obligacionSeleccionada.motivo}</span>
                                    <span className="text-sm text-gray-500 mt-1">
                                      {new Intl.NumberFormat('es-CO', {
                                        style: 'currency',
                                        currency: 'COP',
                                      }).format(obligacionSeleccionada.saldoPendiente)}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-muted-foreground">Selecciona una obligación pendiente</span>
                                )}
                                <ButtonArrow />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                              <Command>
                                <CommandInput placeholder="Buscar obligación..." />
                                <CommandList>
                                  <ScrollArea viewportClassName="max-h-[300px] [&>div]:block!">
                                    <CommandEmpty>No se encontró la obligación.</CommandEmpty>
                                    <CommandGroup>
                                      {selectedCasa?.obligacionesPendientes.map((obligacion) => {
                                        const isSelected = String(field.value) === String(obligacion.id)
                                        return (
                                          <CommandItem
                                            key={obligacion.id}
                                            value={`${obligacion.motivo} ${new Intl.NumberFormat('es-CO', {
                                              style: 'currency',
                                              currency: 'COP',
                                            }).format(obligacion.saldoPendiente)}`}
                                            onSelect={() => {
                                              field.onChange(obligacion.id)
                                              setSelectedObligacion(obligacion)
                                              form.setValue('monto', obligacion.saldoPendiente)
                                              setComboboxOpen(false)
                                            }}
                                            className="py-3"
                                          >
                                            <div className="flex flex-col items-start flex-1 min-w-0 pr-8">
                                              <span className="font-medium text-gray-900">{obligacion.motivo}</span>
                                              <span className="text-sm text-gray-500 mt-1">
                                                {new Intl.NumberFormat('es-CO', {
                                                  style: 'currency',
                                                  currency: 'COP',
                                                }).format(obligacion.saldoPendiente)}
                                              </span>
                                            </div>
                                            {isSelected && <CommandCheck className="ms-auto" />}
                                          </CommandItem>
                                        )
                                      })}
                                    </CommandGroup>
                                  </ScrollArea>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )
                      }}
                    />
                  </div>

                  {/* Monto a pagar */}
                  <Controller
                    name="monto"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <div className="space-y-2">
                        <Label htmlFor="monto" className="text-sm font-medium text-gray-700">
                          Monto a pagar
                          <span className="text-red-500 ml-1">*</span>
                        </Label>
                        <FormFieldWithTooltip
                          label=""
                          invalid={fieldState.invalid}
                          error={showAllErrors ? fieldState.error?.message : undefined}
                          className="-mt-3"
                        >
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                              $
                            </span>
                            <Input
                              id="monto"
                              type="number"
                              placeholder="0"
                              value={field.value?.toString() || ''}
                              onChange={(e) => {
                                const value = e.target.value
                                field.onChange(value ? parseFloat(value) : 0)
                              }}
                              className={`w-full h-12 pl-8 text-lg font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] ${fieldState.invalid ? 'border-red-500 focus:border-red-500' : ''
                                }`}
                            />
                          </div>
                        </FormFieldWithTooltip>
                      </div>
                    )}
                  />

                  {selectedObligacion && (
                    <div className="text-sm text-gray-500">
                      Saldo pendiente: {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(selectedObligacion.saldoPendiente)}
                    </div>
                  )}
                </div>
              </div>
            </form>

            <SheetFooter className="flex flex-row gap-3 mt-auto px-4 pb-4">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  onClick={handleCancelar}
                  className="flex-1"
                  type="button"
                >
                  Cancelar
                </Button>
              </SheetClose>
              <Button
                form='pago-form'
                type="submit"
                onClick={() => {
                  setShowAllErrors(true);
                }}
                className="flex-1"
              >
                Registrar Pago
              </Button>
            </SheetFooter>
          </TooltipProvider>
        </SheetContent>
      </Sheet>
    </>
  )
}
