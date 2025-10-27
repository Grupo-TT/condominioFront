'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, MoreVertical, Pencil, Trash2, Search, X, Dog, Cat, PawPrint } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home07Icon, User03Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import axios from 'axios'
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
  const { casas } = useCasas()
  
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'todas' | 'residencial' | 'arrendada'>('todas')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])


  const handleCrearPropietario = async (data: PropietarioFormData) => {
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

  const handleSheetOpenChange = useCallback((open: boolean) => {
    setIsSheetOpen(open)
  }, [])

  const handleDelete = useCallback((casaId: string) => {
    // Aquí agregarías la lógica para eliminar el propietario
    console.log('Eliminar propietario de casa:', casaId)
    // Por ahora solo mostramos un mensaje
    alert(`Propietario de la casa ${casaId} eliminado`)
  }, [])

  // Filtrar datos basándose en el término de búsqueda y tipo
  const filteredCasas = useMemo(() => {
    if (!searchTerm && filterType === 'todas') {
      return casas || []
    }

    const searchLower = searchTerm.toLowerCase()

    return (casas || []).filter(casa => {
      // Filtrar por tipo de uso
      if (filterType !== 'todas' && casa.usoCasa.toLowerCase().trim() !== filterType) {
        return false
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
  }, [casas, searchTerm, filterType])

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
      },
      {
        accessorKey: 'miembros',
        id: 'miembros',
        header: ({ column }) => <DataGridColumnHeader title="Miembros" column={column} />,
        cell: ({ row }) => <MiembrosIcons cantidad={row.original.cantidadMiembros} />,
        size: 200,
        enableSorting: false,
      },
      {
        accessorKey: 'mascotas',
        id: 'mascotas',
        header: ({ column }) => <DataGridColumnHeader title="Mascotas" column={column} />,
        cell: ({ row }) => <MascotasIcons mascotas={row.original.mascotas} />,
        size: 180,
        enableSorting: false,
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
                    console.log('Editar casa:', row.original.id)
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
      },
    ],
    [handleDelete, router]
  )

  const table = useReactTable({
    columns,
    data: filteredCasas,
    pageCount: Math.ceil((filteredCasas?.length || 0) / pagination.pageSize),
    getRowId: (row: Casa) => row.id,
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
          <Tabs value={filterType} onValueChange={(value) => setFilterType(value as 'todas' | 'residencial' | 'arrendada')} className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="todas">Todas</TabsTrigger>
                <TabsTrigger value="residencial">Residenciales</TabsTrigger>
                <TabsTrigger value="arrendada">Arrendadas</TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-3">
                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <Input
                    placeholder="Buscar casas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-10"
                    ref={searchInputRef}
                  />
                  {searchTerm !== '' && (
                    <Button
                      onClick={handleClearSearch}
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 hover:bg-gray-100"
                    >
                      <X size={14} />
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
                    className="data-[state=open]:duration-300 data-[state=closed]:duration-250"
                    style={{ width: '650px', maxWidth: 'none' }}
                  >
                    <SheetHeader>
                      <SheetTitle>Nuevo Propietario</SheetTitle>
                      <SheetDescription>
                        Registra un nuevo propietario en el sistema con toda su información personal y de contacto.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="flex flex-col h-full">
                      <PropietarioForm
                        onSubmit={handleCrearPropietario}
                        onCancel={() => setIsSheetOpen(false)}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
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
                      : filterType === 'residencial'
                        ? 'No hay casas residenciales registradas'
                        : filterType === 'arrendada'
                          ? 'No hay casas arrendadas registradas'
                          : 'No hay casas registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="residencial">
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
                      ? `No hay casas residenciales que coincidan con "${searchTerm}"`
                      : 'No hay casas residenciales registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="arrendada">
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
                      ? `No hay casas arrendadas que coincidan con "${searchTerm}"`
                      : 'No hay casas arrendadas registradas'
                    }
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

