'use client'

import { useMemo, useState, useCallback } from 'react'
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, Search, X, MoreVertical, Pencil, Trash2, Eye, ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, FileText, DollarSign, User } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { MoneyReceiveFlow01Icon, MoneySendFlow01Icon, TradeUpIcon, TradeDownIcon, BalanceScaleIcon, MoneyBag02Icon, MoneyReceiveSquareIcon, MoneySendSquareIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { PeriodoCombobox } from '@/components/periodo-combobox'
import { cn } from '@/lib/utils'
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
import { ButtonArrow } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { DatePicker } from '@/components/ui/date-picker'
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
import { Skeleton } from '@/components/ui/skeleton'
import { Movimiento } from '@/types/cuotas.types'
import { useMovimientosMes } from '@/hooks/useMovimientos'
import { editarMovimiento, eliminarMovimiento, registrarMovimiento } from '@/lib/services/cuotas.service'
import { toast } from 'sonner'

const categoriaLabels: Record<string, string> = {
  ADMINISTRACION_CUOTAS: "Administración / Cuotas",
  SERVICIOS_PUBLICOS: "Servicios Públicos",
  ASEO_JARDINERIA: "Aseo y Jardinería",
  MANTENIMIENTO_REPARACIONES: "Mantenimiento y Reparaciones",
  PISCINA: "Piscina",
  SEGURIDAD_ACCESO: "Seguridad / Acceso",
  EVENTOS_DECORACION: "Eventos / Decoración",
  PERSONAL_MANO_OBRA: "Personal / Mano de Obra",
  MULTAS: "Multas",
  OTROS: "Otros",
}

export default function MovimientosPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType] = useState<'todas' | 'entradas' | 'salidas'>('todas')
  const [filterCategoria, setFilterCategoria] = useState<string>('todas')
  const [categoriaComboboxOpen, setCategoriaComboboxOpen] = useState(false)
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState<Date>(new Date())
  const { movimientos, loading: loadingMovimientos, metricas } = useMovimientosMes(periodoSeleccionado)
  const isLoading = loadingMovimientos
  const [isDetailSheetOpen, setIsDetailSheetOpen] = useState(false)
  const [selectedMovimiento, setSelectedMovimiento] = useState<Movimiento | null>(null)
  const [isFormSheetOpen, setIsFormSheetOpen] = useState(false)
  const [registrarMenuOpen, setRegistrarMenuOpen] = useState(false)
  const [formFecha, setFormFecha] = useState<Date | undefined>(new Date())
  const [formTipo, setFormTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA')
  const [formDescripcion, setFormDescripcion] = useState('')
  const [formMonto, setFormMonto] = useState('')
  const [formCategoria, setFormCategoria] = useState('')
  const [formResponsable, setFormResponsable] = useState('')
  const [formCategoriaComboboxOpen, setFormCategoriaComboboxOpen] = useState(false)



  // Estados para el sheet de edición
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editingMovimiento, setEditingMovimiento] = useState<Movimiento | null>(null)
  const [editFecha, setEditFecha] = useState<Date | undefined>(undefined)
  const [editTipo, setEditTipo] = useState<'ENTRADA' | 'SALIDA'>('ENTRADA')
  const [editDescripcion, setEditDescripcion] = useState('')
  const [editMonto, setEditMonto] = useState('')
  const [editCategoria, setEditCategoria] = useState('')
  const [editResponsable, setEditResponsable] = useState('')
  const [editCategoriaComboboxOpen, setEditCategoriaComboboxOpen] = useState(false)

  const handleViewDetail = useCallback((movimiento: Movimiento) => {
    setSelectedMovimiento(movimiento)
    setIsDetailSheetOpen(true)
  }, [])

  const handleEdit = useCallback((movimiento: Movimiento) => {
    setEditingMovimiento(movimiento)
    // Fix: Create date using local components to avoid timezone shift
    const dateStr = movimiento.fecha as string;
    const [year, month, day] = dateStr.includes('T')
      ? dateStr.split('T')[0].split('-').map(Number)
      : dateStr.split('-').map(Number);
    setEditFecha(new Date(year, month - 1, day));

    setEditTipo(movimiento.tipo)
    setEditDescripcion(movimiento.descripcion || movimiento.concepto || '')
    setEditMonto(movimiento.monto.toString())
    setEditCategoria(movimiento.categoria || '')
    setEditResponsable(movimiento.responsable || '')
    setIsEditSheetOpen(true)
  }, [])

  const handleEditCancel = () => {
    setEditFecha(undefined)
    setEditTipo('ENTRADA')
    setEditDescripcion('')
    setEditMonto('')
    setEditCategoria('')
    setEditResponsable('')
    setEditingMovimiento(null)
    setIsEditSheetOpen(false)
  }

  // Filtrar datos basándose en el término de búsqueda y tipo
  const filteredMovimientos = useMemo(() => {
    const searchLower = searchTerm.toLowerCase()

    return movimientos.filter((movimiento) => {
      // Filtrar por tipo
      if (filterType === 'entradas' && movimiento.tipo !== 'ENTRADA') {
        return false
      }
      if (filterType === 'salidas' && movimiento.tipo !== 'SALIDA') {
        return false
      }

      // Filtrar por categoría
      if (filterCategoria !== 'todas' && movimiento.categoria !== filterCategoria) {
        return false
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        return (
          movimiento.concepto?.toLowerCase().includes(searchLower) ||
          movimiento.descripcion?.toLowerCase().includes(searchLower) ||
          movimiento.categoria?.toLowerCase().includes(searchLower) ||
          movimiento.responsable?.toLowerCase().includes(searchLower) ||
          movimiento.monto?.toString().includes(searchLower)
        )
      }

      return true
    })
  }, [searchTerm, filterType, filterCategoria, movimientos])

  // Verificar si hay resultados
  const hasResults = filteredMovimientos.length > 0

  // Funciones para navegar entre períodos
  const handleMesAnterior = () => {
    const nuevoPeriodo = new Date(periodoSeleccionado)
    nuevoPeriodo.setMonth(nuevoPeriodo.getMonth() - 1)
    setPeriodoSeleccionado(nuevoPeriodo)
  }

  const handleMesSiguiente = () => {
    const nuevoPeriodo = new Date(periodoSeleccionado)
    nuevoPeriodo.setMonth(nuevoPeriodo.getMonth() + 1)
    setPeriodoSeleccionado(nuevoPeriodo)
  }

  const [isHoyPressed, setIsHoyPressed] = useState(false)

  const handleMesActual = () => {
    setIsHoyPressed(true)
    setPeriodoSeleccionado(new Date())
    // Resetear el estado de animación después de un breve delay
    setTimeout(() => {
      setIsHoyPressed(false)
    }, 150)
  }

  // Verificar si estamos en el mes actual
  const esMesActual = useMemo(() => {
    const ahora = new Date()
    return (
      periodoSeleccionado.getMonth() === ahora.getMonth() &&
      periodoSeleccionado.getFullYear() === ahora.getFullYear()
    )
  }, [periodoSeleccionado])

  // Formatear el período para mostrar en las tarjetas
  const periodoTextoCapitalizado = useMemo(() => {
    const periodoTexto = periodoSeleccionado.toLocaleDateString('es-CO', {
      month: 'long',
      year: 'numeric',
    })
    return periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)
  }, [periodoSeleccionado])

  const categoriasOptions = [
    { value: "todas", label: "Todas las categorías" },
    ...Object.entries(categoriaLabels).map(([value, label]) => ({
      value,
      label,
    })),
  ];

  // Función para obtener los colores de la categoría
  const getCategoriaColors = (categoria: string | undefined) => {
    if (!categoria) {
      return {
        bg: '#F3F4F6', // Gris claro
        text: '#6B7280', // Gris medio
        border: '#D1D5DB', // Gris borde
      }
    }

    const categoriaColors: Record<string, { bg: string; text: string; border: string }> = {
      'ADMINISTRACION_CUOTAS': {
        bg: '#F5F6FA', // Versión muy clara de #ADB2D4
        text: '#659287', // Verde azulado apagado
        border: '#ADB2D4', // Lavanda/periwinkle azul claro
      },
      'SERVICIOS_PUBLICOS': {
        bg: '#F5E6D8', // Versión muy clara de #E2B59A
        text: '#957C62', // Verde oliva apagado/marrón grisáceo
        border: '#E2B59A', // Beige/durazno claro
      },
      'ASEO_JARDINERIA': {
        bg: '#F0F4EC', // Versión muy clara de #B1C29E
        text: '#659287', // Verde azulado apagado
        border: '#B1C29E', // Verde salvia apagado
      },
      'MANTENIMIENTO_REPARACIONES': {
        bg: '#F5E8E0', // Versión muy clara de #B77466
        text: '#957C62', // Verde oliva apagado/marrón grisáceo
        border: '#B77466', // Rojo terracota
      },
      'PISCINA': {
        bg: '#E8F2EF', // Versión muy clara de #659287
        text: '#659287', // Verde azulado apagado
        border: '#659287', // Verde azulado apagado/teal
      },
      'SEGURIDAD_ACCESO': {
        bg: '#F5F0E8', // Versión muy clara de #DEAA79
        text: '#957C62', // Verde oliva apagado/marrón grisáceo
        border: '#DEAA79', // Marrón arenoso claro
      },
      'EVENTOS_DECORACION': {
        bg: '#FFF9E6', // Versión muy clara de #FFE6A9
        text: '#957C62', // Verde oliva apagado/marrón grisáceo
        border: '#FFE6A9', // Amarillo muy pálido/crema
      },
      'PERSONAL_MANO_OBRA': {
        bg: '#F5F0F7', // Versión muy clara de #D4C5E8
        text: '#957C62', // Verde oliva apagado/marrón grisáceo
        border: '#D4C5E8', // Lila suave apagado
      },
      'MULTAS': {
        bg: '#F0F5F6', // Versión muy clara de #C7D9DD
        text: '#659287', // Verde azulado apagado
        border: '#C7D9DD', // Azul-verde muy claro/teal pálido
      },
      'OTROS': {
        bg: '#EEEEEE', // Gris muy claro
        text: '#777C6D', // Verde oliva apagado
        border: '#CBCBCB', // Gris medio
      },
    }

    return categoriaColors[categoria] || categoriaColors['Otros']
  }

  const columns = useMemo<ColumnDef<Movimiento>[]>(
    () => [
      {
        accessorKey: 'fecha',
        id: 'fecha',
        header: ({ column }) => <DataGridColumnHeader title="Fecha" column={column} />,
        cell: ({ row }) => {
          // Fix: Parse YYYY-MM-DD manually to prevent UTC timezone shift
          const dateStr = row.original.fecha as string;
          // Ensure we're dealing with a string date in YYYY-MM-DD format
          const [year, month, day] = dateStr.includes('T')
            ? dateStr.split('T')[0].split('-').map(Number)
            : dateStr.split('-').map(Number);

          const fecha = new Date(year, month - 1, day);

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
        size: 120,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: 'categoria',
        id: 'categoria',
        header: ({ column }) => <DataGridColumnHeader title="Categoría" column={column} />,
        cell: ({ row }) => {
          const categoria =
            categoriaLabels[row.original.categoria ?? ''] || 'Sin categoría';
          const colors = getCategoriaColors(row.original.categoria)

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
              {categoria}
            </Badge>
          )
        },
        size: 170,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6 w-24 rounded-full" />,
        },
      },
      {
        accessorKey: 'descripcion',
        id: 'descripcion',
        header: ({ column }) => <DataGridColumnHeader title="Descripción" column={column} />,
        cell: ({ row }) => (
          <div className="text-sm text-gray-900">
            {row.original.descripcion || row.original.concepto || 'Sin descripción'}
          </div>
        ),
        size: 310,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-4 w-32" />,
        },
      },
      {
        accessorKey: 'tipo',
        id: 'tipo',
        header: ({ column }) => <DataGridColumnHeader title="Tipo" column={column} />,
        cell: ({ row }) => {
          const tipo = row.original.tipo
          return (
            <Badge
              variant={tipo === 'ENTRADA' ? 'success' : 'destructive'}
              appearance="outline"
              size="md"
              className="gap-1.5"
            >
              {tipo === 'ENTRADA' ? (
                <ArrowUpCircle className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownCircle className="w-3.5 h-3.5" />
              )}
              {tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}
            </Badge>
          )
        },
        size: 100,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6 w-20 rounded-full" />,
        },
      },
      {
        accessorKey: 'monto',
        id: 'monto',
        header: ({ column }) => <DataGridColumnHeader title="Monto" column={column} />,
        cell: ({ row }) => {
          const monto = row.original.monto
          const tipo = row.original.tipo
          return (
            <div className={`font-semibold ${tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-700'}`}>
              {tipo === 'ENTRADA' ? '+' : '-'}{' '}
              {new Intl.NumberFormat('es-CO', {
                style: 'currency',
                currency: 'COP',
              }).format(monto)}
            </div>
          )
        },
        size: 140,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-5 w-24" />,
        },
      },
      {
        accessorKey: 'responsable',
        id: 'responsable',
        header: ({ column }) => <DataGridColumnHeader title="Responsable" column={column} />,
        cell: ({ row }) => (
          <div className={`text-sm text-gray-600 truncate ${!row.original.responsable ? 'opacity-50' : ''}`}>
            {row.original.responsable || 'Sin responsable'}
          </div>
        ),
        size: 160,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-4 w-24" />,
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
                      <AlertDialogTitle>¿Eliminar movimiento?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el movimiento{' '}
                        <strong>{row.original.concepto}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async () => {
                          try {
                            await eliminarMovimiento(row.original.id);

                            toast.success("Movimiento eliminado correctamente");

                          } catch (error) {
                            console.error("Error al eliminar:", error);
                            toast.error("No se pudo eliminar el movimiento");
                          }
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
    data: filteredMovimientos,
    pageCount: Math.ceil((filteredMovimientos?.length || 0) / pagination.pageSize),
    getRowId: (row: Movimiento) => row.id,
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
                <BreadcrumbPage>Movimientos</BreadcrumbPage>
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
            <h1 className="text-2xl font-bold text-gray-900">Gestión de Movimientos</h1>
          </div>

          {/* Tarjetas de estadísticas del mes */}
          <div className="-mt-2 -mb-2">
            <div className="grid gap-4 md:grid-cols-4">
              {isLoading ? (
                <>
                  {/* Skeleton para las 4 tarjetas */}
                  {[1, 2, 3, 4].map((index) => (
                    <div key={index} className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center gap-2 mb-4">
                        <Skeleton className="w-5 h-5 rounded" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <Skeleton className="h-9 w-40 mb-1" />
                      <Skeleton className="h-3 w-48 mt-2" />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {/* Tarjeta de Ingresos */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <HugeiconsIcon icon={TradeUpIcon} className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm font-medium text-gray-600">Ingresos del mes</p>
                    </div>
                    <div className="text-3xl font-bold mb-1 text-gray-900">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(metricas?.ingresos ?? 0)}
                    </div>
                    <p className="text-xs text-gray-500">
                      Total de entradas en {periodoTextoCapitalizado.toLowerCase()}
                    </p>
                  </div>

                  {/* Tarjeta de Egresos */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <HugeiconsIcon icon={TradeDownIcon} className="w-5 h-5 text-rose-500" />
                      <p className="text-sm font-medium text-gray-600">Egresos del mes</p>
                    </div>
                    <div className="text-3xl font-bold mb-1 text-gray-900">
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(metricas?.egresos ?? 0)}
                    </div>
                    <p className="text-xs text-gray-500">
                      Total de salidas en {periodoTextoCapitalizado.toLowerCase()}
                    </p>
                  </div>

                  {/* Tarjeta de Balance */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <HugeiconsIcon icon={BalanceScaleIcon} className="w-5 h-5" style={{ color: '#081534' }} />
                      <p className="text-sm font-medium text-gray-600">Balance del mes</p>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${(metricas?.balance ?? 0) >= 0 ? 'text-gray-900' : 'text-rose-600'
                      }`}>
                      {(metricas?.balance ?? 0) < 0 ? '-' : ''}
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(Math.abs((metricas?.balance ?? 0)))}
                    </div>
                    <p className="text-xs text-gray-500">
                      {(metricas?.balance ?? 0) >= 0 ? 'Balance positivo' : 'Balance negativo'}
                    </p>
                  </div>

                  {/* Tarjeta de Saldo Actual */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors">
                    <div className="flex items-center gap-2 mb-4">
                      <HugeiconsIcon icon={MoneyBag02Icon} className="w-5 h-5" style={{ color: '#081534' }} />
                      <p className="text-sm font-medium text-gray-600">Saldo actual</p>
                    </div>
                    <div className={`text-3xl font-bold mb-1 ${(metricas?.saldoActual ?? 0) >= 0 ? 'text-gray-900' : 'text-rose-600'
                      }`}>
                      {(metricas?.saldoActual ?? 0) < 0 ? '-' : ''}
                      {new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(Math.abs((metricas?.saldoActual ?? 0)))}
                    </div>
                    <p className="text-xs text-gray-500">
                      Saldo acumulado hasta {periodoTextoCapitalizado.toLowerCase()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Filtros y controles */}
          <div className="space-y-4">
            {/* Barra de controles: período a la izquierda, búsqueda y botón a la derecha */}
            <div className="flex items-center justify-between gap-4">
              {/* Controles de período a la izquierda */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleMesAnterior}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <PeriodoCombobox
                  value={periodoSeleccionado}
                  onChange={setPeriodoSeleccionado}
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={handleMesSiguiente}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant={esMesActual ? ("primary" as const) : ("outline" as const)}
                  className={cn(
                    "h-9 px-3 text-sm transition-transform duration-150 ease-out active:scale-95",
                    esMesActual && "bg-primary text-primary-foreground",
                    isHoyPressed && "scale-90"
                  )}
                  onClick={handleMesActual}
                >
                  Hoy
                </Button>
              </div>

              {/* Búsqueda y botón a la derecha */}
              <div className="flex items-center gap-3">
                {/* Filtro de categoría */}
                <Popover open={categoriaComboboxOpen} onOpenChange={setCategoriaComboboxOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      mode="input"
                      placeholder={filterCategoria === 'todas'}
                      className="w-[240px] h-10 text-sm font-normal justify-between bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md overflow-hidden"
                    >
                      {filterCategoria !== 'todas' ? (
                        <span className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                          <span
                            className="ms-0.5 size-1.5 rounded-full shrink-0"
                            style={{
                              backgroundColor: getCategoriaColors(filterCategoria).border,
                            }}
                          ></span>
                          <span className="truncate text-sm min-w-0 overflow-hidden">
                            {categoriasOptions.find((opt) => opt.value === filterCategoria)?.label || filterCategoria}
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500 truncate">Filtrar por categoría</span>
                      )}
                      <ButtonArrow className="shrink-0 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-(--radix-popover-trigger-width) p-0"
                    onWheel={(e) => e.stopPropagation()}
                  >
                    <Command>
                      <CommandInput placeholder="Buscar categoría..." />
                      <CommandList>
                        <ScrollArea viewportClassName="max-h-[300px]">
                          <CommandEmpty>No se encontró categoría.</CommandEmpty>
                          <CommandGroup>
                            {categoriasOptions.map((option) => (
                              <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={() => {
                                  setFilterCategoria(option.value)
                                  setCategoriaComboboxOpen(false)
                                }}
                                className="flex items-center gap-2.5 min-w-0 max-w-full"
                              >
                                <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-8 max-w-full overflow-hidden">
                                  {option.value !== 'todas' && (
                                    <span
                                      className="size-1.5 rounded-full shrink-0"
                                      style={{
                                        backgroundColor: getCategoriaColors(option.value).border,
                                      }}
                                    ></span>
                                  )}
                                  <span className="truncate min-w-0 block max-w-[calc(100%-2rem)]">{option.label}</span>
                                </div>
                                {filterCategoria === option.value && <CommandCheck className="shrink-0 ml-auto" />}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                          <ScrollBar />
                        </ScrollArea>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {/* Search bar personalizado más amplio */}
                <div className="relative w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    placeholder="Buscar movimientos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-10 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                  />
                  {searchTerm !== '' && (
                    <Button
                      onClick={() => setSearchTerm('')}
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-full"
                    >
                      <X size={16} className="text-gray-500" />
                    </Button>
                  )}
                </div>

                <Popover open={registrarMenuOpen} onOpenChange={setRegistrarMenuOpen}>
                  <PopoverTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Registrar Movimiento
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3" align="end">
                    <div className="flex gap-3">
                      {/* Botón Entrada */}
                      <button
                        onClick={() => {
                          setFormTipo('ENTRADA')
                          setIsFormSheetOpen(true)
                          setRegistrarMenuOpen(false)
                        }}
                        className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border border-gray-200 hover:border-green-500 hover:bg-green-50 transition-colors min-w-[100px]"
                      >
                        <HugeiconsIcon icon={MoneyReceiveSquareIcon} className="w-7 h-7 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Entrada</span>
                      </button>

                      {/* Botón Salida */}
                      <button
                        onClick={() => {
                          setFormTipo('SALIDA')
                          setIsFormSheetOpen(true)
                          setRegistrarMenuOpen(false)
                        }}
                        className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-lg border border-gray-200 hover:border-red-500 hover:bg-red-50 transition-colors min-w-[100px]"
                      >
                        <HugeiconsIcon icon={MoneySendSquareIcon} className="w-7 h-7 text-gray-700" />
                        <span className="text-sm font-medium text-gray-900">Salida</span>
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Tabla de datos */}
            <DataGrid
              table={table}
              recordCount={filteredMovimientos?.length || 0}
              isLoading={isLoading}
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
                  sizes={[5, 8, 10, 25, 50, 100]}
                />
              </div>
            </DataGrid>
            {!hasResults && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="text-gray-400 mb-2">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No se encontraron resultados
                </h3>
                <p className="text-gray-500 text-sm">
                  {searchTerm
                    ? `No hay ${filterType === 'entradas'
                      ? 'entradas'
                      : filterType === 'salidas'
                        ? 'salidas'
                        : 'movimientos'
                    } que coincidan con "${searchTerm}"`
                    : `No hay ${filterType === 'entradas'
                      ? 'entradas'
                      : filterType === 'salidas'
                        ? 'salidas'
                        : 'movimientos'
                    } registrados`}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sheet de detalle */}
      <Sheet open={isDetailSheetOpen} onOpenChange={setIsDetailSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 p-0 flex flex-col"
          style={{ width: '420px', maxWidth: 'none' }}
        >
          {selectedMovimiento && (
            <>
              {/* Header */}
              <SheetHeader className="px-6 py-4 border-b border-gray-200">
                <SheetTitle className="text-base font-semibold text-gray-900">Detalles de Movimiento</SheetTitle>
              </SheetHeader>

              {/* Título y descripción */}
              <div className="px-6 pt-3 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${selectedMovimiento.tipo === 'ENTRADA' ? 'bg-green-50' : 'bg-red-50'
                    }`}>
                    <HugeiconsIcon
                      icon={selectedMovimiento.tipo === 'ENTRADA' ? MoneyReceiveFlow01Icon : MoneySendFlow01Icon}
                      size={18}
                      className={selectedMovimiento.tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-700'}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{selectedMovimiento.concepto}</h3>
                </div>
                {selectedMovimiento.descripcion && (
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {selectedMovimiento.descripcion}
                  </p>
                )}
              </div>

              {/* Contenido */}
              <div className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-6">
                  {/* Grid 3 columnas: ID, Fecha, Tipo */}
                  <div className="grid grid-cols-[auto_auto_auto] gap-6">
                    {/* ID Movimiento */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">ID Movimiento</div>
                      <div className="text-sm text-gray-900">#{selectedMovimiento.id}</div>
                    </div>

                    {/* Fecha */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Fecha:</div>
                      <div className="text-sm text-gray-900 whitespace-nowrap">
                        {(() => {
                          const dateStr = selectedMovimiento.fecha as string;
                          const [year, month, day] = dateStr.includes('T')
                            ? dateStr.split('T')[0].split('-').map(Number)
                            : dateStr.split('-').map(Number);

                          const fecha = new Date(year, month - 1, day);

                          return fecha.toLocaleDateString('es-CO', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          });
                        })()}
                      </div>
                    </div>

                    {/* Tipo */}
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tipo:</div>
                      <Badge
                        variant={selectedMovimiento.tipo === 'ENTRADA' ? 'success' : 'destructive'}
                        appearance="outline"
                        size="sm"
                      >
                        {selectedMovimiento.tipo === 'ENTRADA' ? 'Entrada' : 'Salida'}
                      </Badge>
                    </div>
                  </div>

                  {/* Detalles financieros */}
                  <div className="pt-4 border-t border-gray-200">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="text-xs text-gray-500">Monto:</div>
                        <div className={`text-sm font-semibold ${selectedMovimiento.tipo === 'ENTRADA' ? 'text-green-700' : 'text-red-700'
                          }`}>
                          {selectedMovimiento.tipo === 'ENTRADA' ? '+' : '-'}{' '}
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(selectedMovimiento.monto)}
                        </div>
                      </div>
                      {selectedMovimiento.categoria && (
                        <div className="flex justify-between">
                          <div className="text-xs text-gray-500">Categoría:</div>
                          <div className="text-sm text-gray-900">
                            {categoriaLabels[selectedMovimiento.categoria ?? ''] ??
                              selectedMovimiento.categoria ??
                              'Sin categoría'}
                          </div>
                        </div>
                      )}
                      {selectedMovimiento.responsable && (
                        <div className="flex justify-between">
                          <div className="text-xs text-gray-500">Responsable:</div>
                          <div className="text-sm text-gray-900">{selectedMovimiento.responsable}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer con acciones */}
              <div className="px-6 py-4 border-t border-gray-200">
                <Button
                  onClick={() => handleEdit(selectedMovimiento)}
                  className="w-full"
                  variant="outline"
                >
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar Movimiento
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Sheet de formulario para registrar movimiento */}
      <Sheet open={isFormSheetOpen} onOpenChange={setIsFormSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '565px', maxWidth: 'none' }}
        >
          <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${formTipo === 'ENTRADA' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                <HugeiconsIcon
                  icon={formTipo === 'ENTRADA' ? MoneyReceiveSquareIcon : MoneySendSquareIcon}
                  size={24}
                  className={formTipo === 'ENTRADA' ? 'text-green-700' : 'text-red-700'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  {formTipo === 'ENTRADA' ? 'Registrar Entrada' : 'Registrar Salida'}
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  {formTipo === 'ENTRADA'
                    ? 'Registra una nueva entrada de dinero del condominio.'
                    : 'Registra una nueva salida de dinero del condominio.'}
                </SheetDescription>
              </div>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const payload = {
                fecha: (() => {
                  if (!formFecha) return "";
                  const year = formFecha.getFullYear();
                  const month = String(formFecha.getMonth() + 1).padStart(2, '0');
                  const day = String(formFecha.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                })(),
                tipo: formTipo,
                descripcion: formDescripcion,
                monto: Number(formMonto),
                categoria: formCategoria,
                responsable: formResponsable,
              };

              try {
                await registrarMovimiento(payload);

                toast.success("Movimiento registrado correctamente");
                setIsFormSheetOpen(false);

                // Resetear formulario
                setFormFecha(new Date());
                setFormTipo("ENTRADA");
                setFormDescripcion("");
                setFormMonto("");
                setFormCategoria("");
                setFormResponsable("");
              } catch {
                toast.error("No se pudo registrar el movimiento");
              }
            }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-8">
                {/* Sección: Información Básica */}
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    {/* Fecha */}
                    <div className="space-y-2">
                      <Label htmlFor="fecha" className="text-sm font-medium text-gray-700">
                        Fecha <span className="text-red-500">*</span>
                      </Label>
                      <DatePicker
                        id="fecha"
                        value={formFecha}
                        onSelect={setFormFecha}
                        placeholder="Selecciona una fecha"
                        className="h-10"
                      />
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                      <Label htmlFor="categoria" className="text-sm font-medium text-gray-700">
                        Categoría <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={formCategoriaComboboxOpen} onOpenChange={setFormCategoriaComboboxOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            mode="input"
                            placeholder={!formCategoria}
                            className="w-full h-10 text-sm font-normal justify-between bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-300 overflow-hidden"
                          >
                            {formCategoria ? (
                              <span className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                                <span
                                  className="ms-0.5 size-1.5 rounded-full shrink-0"
                                  style={{
                                    backgroundColor: getCategoriaColors(formCategoria).border,
                                  }}
                                ></span>
                                <span className="truncate text-sm min-w-0 overflow-hidden">
                                  {categoriasOptions.find((opt) => opt.value === formCategoria)?.label || formCategoria}
                                </span>
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500 truncate">Selecciona una categoría</span>
                            )}
                            <ButtonArrow className="shrink-0 ml-2" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-(--radix-popover-trigger-width) p-0"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <Command>
                            <CommandInput placeholder="Buscar categoría..." />
                            <CommandList>
                              <ScrollArea viewportClassName="max-h-[300px]">
                                <CommandEmpty>No se encontró categoría.</CommandEmpty>
                                <CommandGroup>
                                  {categoriasOptions.filter(opt => opt.value !== 'todas').map((option) => (
                                    <CommandItem
                                      key={option.value}
                                      value={option.value}
                                      onSelect={() => {
                                        setFormCategoria(option.value)
                                        setFormCategoriaComboboxOpen(false)
                                      }}
                                      className="flex items-center gap-2.5 min-w-0 max-w-full"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-8 max-w-full overflow-hidden">
                                        <span
                                          className="size-1.5 rounded-full shrink-0"
                                          style={{
                                            backgroundColor: getCategoriaColors(option.value).border,
                                          }}
                                        ></span>
                                        <span className="truncate min-w-0 block max-w-[calc(100%-2rem)]">{option.label}</span>
                                      </div>
                                      {formCategoria === option.value && <CommandCheck className="shrink-0 ml-auto" />}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <ScrollBar />
                              </ScrollArea>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Sección: Detalles del Movimiento */}
                <div className="space-y-5">
                  <div className="space-y-5">
                    {/* Descripción */}
                    <div className="space-y-2">
                      <Label htmlFor="descripcion" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Descripción <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="descripcion"
                        value={formDescripcion}
                        onChange={(e) => setFormDescripcion(e.target.value)}
                        placeholder="Describe los detalles del movimiento..."
                        required
                        className="min-h-[100px] border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>

                    {/* Monto */}
                    <div className="space-y-2">
                      <Label htmlFor="monto" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        Monto (COP) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative group">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium transition-colors ${formMonto ? 'text-gray-700' : ''
                          }`}>
                          $
                        </div>
                        <Input
                          id="monto"
                          type="number"
                          value={formMonto}
                          onChange={(e) => setFormMonto(e.target.value)}
                          placeholder="0"
                          min="0"
                          required
                          className="w-full h-14 pl-10 pr-4 text-xl font-semibold border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] bg-gray-50/50 hover:bg-white"
                        />
                      </div>
                    </div>

                    {/* Responsable */}
                    <div className="space-y-2">
                      <Label htmlFor="responsable" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-400" />
                        Responsable
                      </Label>
                      <Input
                        id="responsable"
                        value={formResponsable}
                        onChange={(e) => setFormResponsable(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        maxLength={100}
                        className="h-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
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
                  setFormFecha(new Date())
                  setFormTipo('ENTRADA')
                  setFormDescripcion('')
                  setFormMonto('')
                  setFormCategoria('')
                  setFormResponsable('')
                }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 h-10 font-medium"
                disabled={!formDescripcion || !formMonto || !formFecha || !formCategoria}
              >
                Registrar Movimiento
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>

      {/* Sheet para Editar Movimiento */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 rounded-lg! top-2! bottom-2! right-2! h-[calc(100vh-1rem)]! overflow-hidden"
          style={{ width: '565px', maxWidth: 'none' }}
        >
          <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${editTipo === 'ENTRADA' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                <HugeiconsIcon
                  icon={editTipo === 'ENTRADA' ? MoneyReceiveSquareIcon : MoneySendSquareIcon}
                  size={24}
                  className={editTipo === 'ENTRADA' ? 'text-green-700' : 'text-red-700'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  Editar Movimiento
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  Modifica los detalles del movimiento
                </SheetDescription>
              </div>
            </div>
          </div>

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              if (!editingMovimiento?.id) {
                console.error("No hay ID del movimiento a editar");
                return;
              }

              const payload = {
                fecha: (() => {
                  if (!editFecha) return "";
                  const year = editFecha.getFullYear();
                  const month = String(editFecha.getMonth() + 1).padStart(2, '0');
                  const day = String(editFecha.getDate()).padStart(2, '0');
                  return `${year}-${month}-${day}`;
                })(),
                tipo: editTipo,
                descripcion: editDescripcion,
                monto: Number(editMonto),
                categoria: editCategoria,
                responsable: editResponsable,
              };

              try {
                await editarMovimiento(editingMovimiento.id, payload);
                toast.success("Movimiento actualizado correctamente");

                setIsEditSheetOpen(false);
                handleEditCancel();

              } catch (error) {
                console.error("Error al editar el movimiento:", error);
                toast.error("No se pudo editar el movimiento");
              }
            }}
            className="flex flex-col h-full"
          >
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-8">
                {/* Sección: Información Básica */}
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-5">
                    {/* Fecha */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-fecha" className="text-sm font-medium text-gray-700">
                        Fecha <span className="text-red-500">*</span>
                      </Label>
                      <DatePicker
                        id="edit-fecha"
                        value={editFecha}
                        onSelect={setEditFecha}
                        placeholder="Selecciona una fecha"
                        className="h-10"
                      />
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-categoria" className="text-sm font-medium text-gray-700">
                        Categoría <span className="text-red-500">*</span>
                      </Label>
                      <Popover open={editCategoriaComboboxOpen} onOpenChange={setEditCategoriaComboboxOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            mode="input"
                            placeholder={!editCategoria}
                            className="w-full h-10 text-sm font-normal justify-between bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md hover:border-gray-300 overflow-hidden"
                          >
                            {editCategoria ? (
                              <span className="flex items-center gap-2.5 min-w-0 flex-1 overflow-hidden">
                                <span
                                  className="ms-0.5 size-1.5 rounded-full shrink-0"
                                  style={{
                                    backgroundColor: getCategoriaColors(editCategoria).border,
                                  }}
                                ></span>
                                <span className="truncate text-sm min-w-0 overflow-hidden">
                                  {categoriasOptions.find((opt) => opt.value === editCategoria)?.label || editCategoria}
                                </span>
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500 truncate">Selecciona una categoría</span>
                            )}
                            <ButtonArrow className="shrink-0 ml-2" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-(--radix-popover-trigger-width) md:w-[calc(var(--radix-popover-trigger-width)-1rem)]"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <Command>
                            <CommandInput placeholder="Buscar categoría..." />
                            <CommandList>
                              <ScrollArea viewportClassName="max-h-[300px]">
                                <CommandEmpty>No se encontró categoría.</CommandEmpty>
                                <CommandGroup>
                                  {categoriasOptions.filter(opt => opt.value !== 'todas').map((option) => (
                                    <CommandItem
                                      key={option.value}
                                      value={option.value}
                                      onSelect={() => {
                                        setEditCategoria(option.value)
                                        setEditCategoriaComboboxOpen(false)
                                      }}
                                      className="flex items-center gap-2.5 min-w-0 max-w-full"
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-8 max-w-full overflow-hidden">
                                        <span
                                          className="size-1.5 rounded-full shrink-0"
                                          style={{
                                            backgroundColor: getCategoriaColors(option.value).border,
                                          }}
                                        ></span>
                                        <span className="truncate min-w-0 block max-w-[calc(100%-2rem)]">{option.label}</span>
                                      </div>
                                      {editCategoria === option.value && <CommandCheck className="shrink-0 ml-auto" />}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                <ScrollBar />
                              </ScrollArea>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Sección: Detalles del Movimiento */}
                <div className="space-y-5">
                  <div className="space-y-5">
                    {/* Descripción */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-descripcion" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-gray-400" />
                        Descripción <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="edit-descripcion"
                        value={editDescripcion}
                        onChange={(e) => setEditDescripcion(e.target.value)}
                        placeholder="Describe los detalles del movimiento..."
                        required
                        className="min-h-[100px] border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>

                    {/* Monto */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-monto" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        Monto (COP) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative group">
                        <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg font-medium transition-colors ${editMonto ? 'text-gray-700' : ''
                          }`}>
                          $
                        </div>
                        <Input
                          id="edit-monto"
                          type="number"
                          value={editMonto}
                          onChange={(e) => setEditMonto(e.target.value)}
                          placeholder="0"
                          min="0"
                          required
                          className="w-full h-14 pl-10 pr-4 text-xl font-semibold border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [-moz-appearance:textfield] bg-gray-50/50 hover:bg-white"
                        />
                      </div>
                    </div>

                    {/* Responsable */}
                    <div className="space-y-2">
                      <Label htmlFor="edit-responsable" className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-gray-400" />
                        Responsable
                      </Label>
                      <Input
                        id="edit-responsable"
                        value={editResponsable}
                        onChange={(e) => setEditResponsable(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        maxLength={100}
                        className="h-10 border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                      />
                    </div>
                  </div>
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
                disabled={!editDescripcion || !editMonto || !editFecha || !editCategoria}
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

