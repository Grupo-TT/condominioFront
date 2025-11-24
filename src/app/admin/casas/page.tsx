'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, MoreVertical, Pencil, Trash2, Search, X, Dog, Cat, PawPrint } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home07Icon, User03Icon, Profile02Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { AnimatedTabs } from '@/components/animated-tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import axios from 'axios'
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
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
import { Casa, Mascotas } from '@/types/casa.types'
import { PropietarioFormData } from '@/lib/validations/propietario.validation'
import { PropietarioForm } from '@/components/forms/examples/PropietarioForm'
import { useCasas } from '@/hooks/useCasas'
import { useRouter } from 'next/navigation'
import { useCasaContext } from '@/contexts/CasaContext'
import { propietarioService } from '@/lib/services/propietario.service'

// Componente para renderizar iconos de miembros
function MiembrosIcons({ cantidad }: { cantidad: number }) {
  return (
    <div className="flex items-center gap-2">
      <HugeiconsIcon
        icon={User03Icon}
        size={18}
        className="text-gray-500"
      />
      <span className="text-sm font-medium text-gray-700">
        {cantidad}
      </span>
    </div>
  )
}

// Componente para renderizar iconos de mascotas
function MascotasIcons({ mascotas }: { mascotas: Mascotas }) {
  const tipos = [
    { tipo: 'perro', cantidad: mascotas.perro },
    { tipo: 'gato', cantidad: mascotas.gato },
    { tipo: 'otro', cantidad: mascotas.otro },
  ]

  return (
    <div className="flex gap-1 flex-wrap">
      {tipos.map(({ tipo, cantidad }, idx) =>
        Array.from({ length: cantidad }).map((_, i) => {
          // Colores personalizados para cada tipo
          const bgColor =
            tipo === 'perro'
              ? '#F1E8D6' // Beige/Dorado claro
              : tipo === 'gato'
              ? '#E3E4EA' // Azul grisáceo claro
              : '#E6EFEA' // Verde claro

          const iconColor =
            tipo === 'perro'
              ? '#A39170' // Dorado/Marrón
              : tipo === 'gato'
              ? '#595D75' // Azul grisáceo oscuro
              : '#4C6C5A' // Verde oscuro

          const Icon =
            tipo === 'perro' ? Dog : tipo === 'gato' ? Cat : PawPrint

          return (
            <div
              key={`${idx}-${i}`}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: bgColor }}
            >
              <Icon className="w-5 h-5" style={{ color: iconColor }} />
            </div>
          )
        })
      )}
    </div>
  )
}

export default function CasasPage() {
  const router = useRouter()
  const { casas, loading } = useCasas()
  const { setCasaInCache } = useCasaContext()
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'todas' | 'residencial' | 'arrendada'>('todas')
  const [estadoFilter, setEstadoFilter] = useState<'todas' | 'al-dia' | 'en-mora'>('todas')
  const [estadoComboboxOpen, setEstadoComboboxOpen] = useState(false)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isReplaceDialogOpen, setIsReplaceDialogOpen] = useState(false)
  const [pendingPropietarioData, setPendingPropietarioData] = useState<PropietarioFormData | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])


  const handleCrearPropietario = async (data: PropietarioFormData) => {
    // Verificar si la casa seleccionada ya tiene un propietario
    const casaId = parseInt(data.idCasa, 10)
    const casaSeleccionada = casas?.find(casa => parseInt(casa.numeroCasa, 10) === casaId)
    
    // Verificar si la casa tiene propietario (con datos válidos) y el rol es PROPIETARIO
    const tienePropietario = casaSeleccionada?.propietario && 
                             casaSeleccionada.propietario.nombreCompleto && 
                             casaSeleccionada.propietario.nombreCompleto.trim() !== ''
    
    if (tienePropietario && data.rolEnCasa === 'PROPIETARIO') {
      // Guardar los datos pendientes y mostrar el diálogo de confirmación
      setPendingPropietarioData(data)
      setIsReplaceDialogOpen(true)
      return
    }

    // Si no hay propietario o el rol no es PROPIETARIO, proceder directamente
    await crearPropietario(data)
  }

  const crearPropietario = async (data: PropietarioFormData) => {
    try {
      await propietarioService.create(data)

      // Mostrar toast de éxito
      toast.success('Propietario creado exitosamente', {
        duration: 5000,
      })

      // Cerrar el sheet
      setIsSheetOpen(false)
      // Recargar la lista de casas si es necesario
      // fetchCasas()
    } catch (err) {
      // Extraer mensaje de error usando axios.isAxiosError
      const errorMessage = axios.isAxiosError(err)
        ? (err.response?.data as { message?: string })?.message || err.message || "Error al crear el propietario"
        : "Error al crear el propietario. Intenta de nuevo."
      
      // Mostrar toast de error
      toast.error(errorMessage, {
        duration: 5000,
      })
    }
  }

  const handleConfirmReplace = async () => {
    if (pendingPropietarioData) {
      await crearPropietario(pendingPropietarioData)
      setPendingPropietarioData(null)
      setIsReplaceDialogOpen(false)
    }
  }

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setIsSheetOpen(open)
  }, [])

  const handleDelete = useCallback((casaId: string) => {
    // Aquí agregarías la lógica para eliminar el propietario
    console.log('Eliminar propietario de casa:', casaId)
    // Por ahora solo mostramos un mensaje
    alert(`Propietario de la casa ${casaId} eliminado`)
  }, [])

  // Filtrar datos basándose en el término de búsqueda, tipo y estado financiero
  const filteredCasas = useMemo(() => {
    const searchLower = searchTerm.toLowerCase()

    return (casas || []).filter(casa => {
      // Filtrar por tipo de uso
      if (filterType !== 'todas' && casa.usoCasa.toLowerCase().trim() !== filterType) {
        return false
      }

      // Filtrar por estado financiero
      if (estadoFilter !== 'todas') {
        const estadoCasa = casa.estadoFinancieroCasa.toUpperCase().trim()
        if (estadoFilter === 'al-dia' && estadoCasa !== 'AL DIA') {
          return false
        }
        if (estadoFilter === 'en-mora' && estadoCasa !== 'EN MORA') {
          return false
        }
      }

      // Filtrar por término de búsqueda
      if (searchTerm) {
        return (
          casa.propietario.nombreCompleto.toLowerCase().includes(searchLower) ||
          casa.numeroCasa.toLowerCase().includes(searchLower) ||
          casa.estadoFinancieroCasa.toLowerCase().includes(searchLower) ||
          casa.usoCasa.toLowerCase().includes(searchLower)
        )
      }

      return true
    })
  }, [casas, searchTerm, filterType, estadoFilter])

  // Verificar si hay resultados
  const hasResults = filteredCasas.length > 0

  const columns = useMemo<ColumnDef<Casa>[]>(
    () => [
      {
        accessorKey: 'propietario',
        id: 'propietario',
        header: ({ column }) => <DataGridColumnHeader title="Propietario / Casa" column={column} />,
        cell: ({ row }) => {
          const esArrendada = row.original.usoCasa.toUpperCase() === 'ARRENDADA'
          const rol = esArrendada ? 'Arrendatario' : 'Propietario'
          
          return (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <HugeiconsIcon
                  icon={Home07Icon}
                  size={20}
                  color="currentColor"
                  strokeWidth={1.5}
                  className="text-gray-600"
                />
              </div>
              <div>
                <button
                  onClick={() => {
                    // Guardar la casa en el contexto para evitar otra petición
                    setCasaInCache(row.original.numeroCasa, row.original)
                    router.push(`/admin/casas/${row.original.numeroCasa}`)
                  }}
                  className="font-semibold text-gray-900 hover:text-green-700 transition-all duration-200 cursor-pointer text-left relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-green-700 after:transition-all after:duration-200 hover:after:w-full"
                >
                  {row.original.propietario.nombreCompleto}
                </button>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{rol}</span> · Casa No.{row.original.numeroCasa}
                </div>
              </div>
            </div>
          )
        },
        size: 250,
        enableSorting: true,
        enableHiding: false,
        meta: {
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: 'miembros',
        id: 'miembros',
        header: ({ column }) => <DataGridColumnHeader title="Miembros" column={column} />,
        cell: ({ row }) => <MiembrosIcons cantidad={row.original.cantidadMiembros} />,
        size: 200,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-6 w-12" />,
        },
      },
      {
        accessorKey: 'mascotas',
        id: 'mascotas',
        header: ({ column }) => <DataGridColumnHeader title="Mascotas" column={column} />,
        cell: ({ row }) => <MascotasIcons mascotas={row.original.mascotas} />,
        size: 180,
        enableSorting: false,
        meta: {
          skeleton: <Skeleton className="h-6 w-12" />,
        },
      },
      {
        accessorKey: 'estadoFinancieroCasa',
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
        cell: ({ row }) => {
          const estado = row.original.estadoFinancieroCasa
          const capitalizeText = (text: string) => {
            return text
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          }
          return (
            <Badge
              variant={estado.toUpperCase() === 'AL DIA' ? 'success' : 'destructive'}
              appearance="outline"
              size="md"
              className="gap-1.5"
            >
              <span
                className={`w-2 h-2 rounded-full ${estado.toUpperCase() === 'AL DIA' ? 'bg-green-700' : 'bg-red-700'
                  }`}
              />
              {capitalizeText(estado)}
            </Badge>
          )
        },
        size: 120,
        enableSorting: true,
        meta: {
          skeleton: <Skeleton className="h-6 w-20" />,
        },
      },
      {
        accessorKey: 'usoCasa',
        id: 'uso',
        header: ({ column }) => <DataGridColumnHeader title="Uso" column={column} />,
        cell: ({ row }) => {
          const uso = row.original.usoCasa
          const capitalizeText = (text: string) => {
            return text
              .toLowerCase()
              .split(' ')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')
          }
          return (
            <Badge
              variant={uso.toUpperCase() === 'RESIDENCIAL' ? 'outline' : 'secondary'}
              appearance="light"
              size="md"
            >
              {capitalizeText(uso)}
            </Badge>
          )
        },
        size: 140,
        enableSorting: true,
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
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    console.log('Editar casa:', row.original.numeroCasa)
                  }}
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
                      <AlertDialogTitle>¿Eliminar propietario?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el propietario{' '}
                        <strong>{row.original.propietario.nombreCompleto}</strong> de la casa{' '}
                        <strong>{row.original.numeroCasa}</strong> y toda su información asociada.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(row.original.numeroCasa)}
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
    [handleDelete, router, setCasaInCache]
  )

  const table = useReactTable({
    columns,
    data: filteredCasas,
    pageCount: Math.ceil((filteredCasas?.length || 0) / pagination.pageSize),
    getRowId: (row: Casa) => row.numeroCasa,
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
                <BreadcrumbPage>Casas</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Casas</h1>
              <p className="text-gray-500 mt-1">
                Gestiona la información de propietarios, miembros y mascotas de cada casa.
              </p>
            </div>
          </div>

          {/* Filtros y controles */}
          <AnimatedTabs
            value={filterType}
            onValueChange={(value) => setFilterType(value as 'todas' | 'residencial' | 'arrendada')}
            tabs={[
              {
                value: 'todas',
                label: 'Todas',
                content: loading || hasResults ? (
                /* Tabla con skeleton o datos */
                <DataGrid
                  table={table}
                  recordCount={filteredCasas?.length || 0}
                  loadingMode="skeleton"
                  isLoading={loading}
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
                    {searchTerm || estadoFilter !== 'todas'
                      ? `No hay casas que coincidan con "${searchTerm || ''}"${estadoFilter !== 'todas' ? ` y estado ${estadoFilter === 'al-dia' ? 'al día' : 'en mora'}` : ''}${filterType !== 'todas' ? ` de tipo ${filterType === 'residencial' ? 'residencial' : 'arrendada'}` : ''}`
                      : filterType === 'residencial'
                        ? 'No hay casas residenciales registradas'
                        : filterType === 'arrendada'
                          ? 'No hay casas arrendadas registradas'
                          : 'No hay casas registradas'
                    }
                  </p>
                </div>
              ),
              },
              {
                value: 'residencial',
                label: 'Residenciales',
                content: loading || hasResults ? (
                /* Tabla con skeleton o datos */
                <DataGrid
                  table={table}
                  recordCount={filteredCasas?.length || 0}
                  loadingMode="skeleton"
                  isLoading={loading}
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
                    {searchTerm || estadoFilter !== 'todas'
                      ? `No hay casas que coincidan con "${searchTerm || ''}"${estadoFilter !== 'todas' ? ` y estado ${estadoFilter === 'al-dia' ? 'al día' : 'en mora'}` : ''} de tipo residencial`
                      : 'No hay casas residenciales registradas'
                    }
                  </p>
                </div>
              ),
              },
              {
                value: 'arrendada',
                label: 'Arrendadas',
                content: loading || hasResults ? (
                /* Tabla con skeleton o datos */
                <DataGrid
                  table={table}
                  recordCount={filteredCasas?.length || 0}
                  loadingMode="skeleton"
                  isLoading={loading}
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
                    {searchTerm || estadoFilter !== 'todas'
                      ? `No hay casas que coincidan con "${searchTerm || ''}"${estadoFilter !== 'todas' ? ` y estado ${estadoFilter === 'al-dia' ? 'al día' : 'en mora'}` : ''} de tipo arrendada`
                      : 'No hay casas arrendadas registradas'
                    }
                  </p>
                </div>
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
                      className="w-[180px] h-10 text-sm font-normal justify-between bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                    >
                      {estadoFilter !== 'todas' ? (
                        <span className="flex items-center gap-2.5">
                          <span className={cn(
                            'ms-0.5 size-1.5 rounded-full',
                            estadoFilter === 'al-dia' ? 'bg-green-500' :
                            'bg-red-500'
                          )}></span>
                          <span className="truncate text-sm">
                            {estadoFilter === 'al-dia' ? 'Al día' : 'En mora'}
                          </span>
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">Filtrar por estado</span>
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
                            value="al-dia"
                            onSelect={() => {
                              setEstadoFilter('al-dia')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-green-500"></span>
                              <span className="truncate">Al día</span>
                            </span>
                            {estadoFilter === 'al-dia' && <CommandCheck />}
                          </CommandItem>
                          <CommandItem
                            value="en-mora"
                            onSelect={() => {
                              setEstadoFilter('en-mora')
                              setEstadoComboboxOpen(false)
                            }}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className="ms-1 size-1.5 rounded-full bg-red-500"></span>
                              <span className="truncate">En mora</span>
                            </span>
                            {estadoFilter === 'en-mora' && <CommandCheck />}
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
                    placeholder="Buscar casas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10 h-10 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
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
                <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
                  <SheetTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      Nuevo Propietario
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 !rounded-lg !top-2 !bottom-2 !right-2 !h-[calc(100vh-1rem)] overflow-hidden"
                    style={{ 
                      width: '650px', 
                      maxWidth: 'none'
                    }}
                  >
                    <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                          <HugeiconsIcon icon={Profile02Icon} size={28} style={{ color: '#4C6C5A' }} />
                        </div>
                        <div className="flex-1">
                          <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                            Nuevo Propietario
                          </SheetTitle>
                          <SheetDescription className="text-sm text-gray-500">
                            Registra un nuevo propietario en el sistema con toda su información personal y de contacto.
                          </SheetDescription>
                        </div>
                      </div>
                    </div>

                    <PropietarioForm
                      onSubmit={handleCrearPropietario}
                      onCancel={() => setIsSheetOpen(false)}
                    />
                  </SheetContent>
                </Sheet>

                {/* Dialog de confirmación para reemplazar propietario */}
                <AlertDialog open={isReplaceDialogOpen} onOpenChange={setIsReplaceDialogOpen}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Reemplazar propietario actual?</AlertDialogTitle>
                      <AlertDialogDescription>
                        La casa seleccionada ya tiene un propietario asociado. Toda la información del propietario actual será reemplazada con el nuevo propietario que estás creando.
                        <br /><br />
                        ¿Deseas continuar?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => {
                        setPendingPropietarioData(null)
                        setIsReplaceDialogOpen(false)
                      }}>
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleConfirmReplace}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Continuar y Reemplazar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            }
          />
        </div>
      </div>
    </>
  )
}

