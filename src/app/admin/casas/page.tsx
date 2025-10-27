  'use client'

  import { useMemo, useState, useRef, useCallback } from 'react'
  import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
  import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
  import { DataGridPagination } from '@/components/ui/data-grid-pagination'
  import { DataGridTable } from '@/components/ui/data-grid-table'
  import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
  import { Plus, MoreVertical, Pencil, Trash2, Search, X, Dog, Cat, User } from 'lucide-react'
  import { HugeiconsIcon } from '@hugeicons/react'
  import { Home07Icon, User03Icon } from '@hugeicons/core-free-icons'
  import { Button } from '@/components/ui/button'
  import { Badge } from '@/components/ui/badge'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
  import { Separator } from '@/components/ui/separator'
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from '@/components/ui/select'
  import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
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
  import { Casa, MiembroCasa, Mascotas } from '@/types/casa.types'
  import { useCasas } from '@/hooks/useCasas'
  import { useRouter } from 'next/navigation'
  // Tipo para el formulario de nuevo propietario
  interface FormData {
    primerNombre: string
    segundoNombre: string
    primerApellido: string
    segundoApellido: string
    tipoDocumento: string
    numeroDocumento: string
    correoElectronico: string
    telefono: string
    rolEnCasa: string
    casaAsociada: string
  }

  // Componente separado para el formulario
  function NuevoPropietarioForm({ 
    formData, 
    onInputChange
  }: {
    formData: FormData
    onInputChange: (field: string, value: string) => void
  }) {
    return (
      <div className="space-y-6 px-4">
        {/* Información Personal */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500">Información Personal</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="primerNombre">Primer Nombre</Label>
              <Input
                id="primerNombre"
                placeholder="Ej: José"
                value={formData.primerNombre}
                onChange={(e) => onInputChange('primerNombre', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="segundoNombre">Segundo Nombre</Label>
              <Input
                id="segundoNombre"
                placeholder="Ej: Carlos"
                value={formData.segundoNombre}
                onChange={(e) => onInputChange('segundoNombre', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="primerApellido">Primer Apellido</Label>
              <Input
                id="primerApellido"
                placeholder="Ej: Pérez"
                value={formData.primerApellido}
                onChange={(e) => onInputChange('primerApellido', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="segundoApellido">Segundo Apellido</Label>
              <Input
                id="segundoApellido"
                placeholder="Ej: Hurtado"
                value={formData.segundoApellido}
                onChange={(e) => onInputChange('segundoApellido', e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
              <Select
                value={formData.tipoDocumento}
                onValueChange={(value) => onInputChange('tipoDocumento', value)}
                required
              >
                <SelectTrigger className="w-full text-left">
                  <SelectValue placeholder="Seleccionar tipo" className="text-left" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                  <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                  <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numeroDocumento">Número de Documento</Label>
              <Input
                id="numeroDocumento"
                placeholder="Ej: 12345678"
                value={formData.numeroDocumento}
                onChange={(e) => onInputChange('numeroDocumento', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Información de Contacto */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500">Información de Contacto</h3>
          <div className="grid grid-cols-1 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="correoElectronico">Correo Electrónico</Label>
              <Input
                id="correoElectronico"
                type="email"
                placeholder="Ej: jose.perez@email.com"
                value={formData.correoElectronico}
                onChange={(e) => onInputChange('correoElectronico', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input
                id="telefono"
                type="tel"
                placeholder="Ej: 3001234567"
                value={formData.telefono}
                onChange={(e) => onInputChange('telefono', e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Información de Propiedad */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-500">Información de Propiedad</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="grid gap-2">
              <Label htmlFor="rolEnCasa">Rol en la Casa</Label>
              <Select
                value={formData.rolEnCasa}
                onValueChange={(value) => onInputChange('rolEnCasa', value)}
                required
              >
                <SelectTrigger className="w-full text-left">
                  <SelectValue placeholder="Seleccionar rol" className="text-left" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="propietario">Propietario</SelectItem>
                  <SelectItem value="arrendatario">Arrendatario</SelectItem>
                  <SelectItem value="familiar">Familiar</SelectItem> 
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="casaAsociada">Casa Asociada</Label>
              <Select
                value={formData.casaAsociada}
                onValueChange={(value) => onInputChange('casaAsociada', value)}
                required
              >
                <SelectTrigger className="w-full text-left">
                  <SelectValue placeholder="Seleccionar casa" className="text-left" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Casa 1</SelectItem>
                  <SelectItem value="2">Casa 2</SelectItem>
                  <SelectItem value="3">Casa 3</SelectItem>
                  <SelectItem value="4">Casa 4</SelectItem>
                  <SelectItem value="5">Casa 5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    )
  }


  // Componente para renderizar iconos de miembros
  function MiembrosIcons({ miembros }: { miembros: MiembroCasa[] }) {
    const cantidadMiembros = miembros?.length ?? 0

    return (
      <div className="flex items-center justify-center">
        <span className="text-sm font-medium text-gray-700">
          {cantidadMiembros} miembro{cantidadMiembros !== 1 ? 's' : ''}
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
            const bgColor =
              tipo === 'perro'
                ? '#A3917020'
                : tipo === 'gato'
                ? '#595D7520'
                : '#D1D5DB20'
  
            const iconColor =
              tipo === 'perro'
                ? '#A39170'
                : tipo === 'gato'
                ? '#595D75'
                : '#9CA3AF'
  
            const Icon =
              tipo === 'perro' ? Dog : tipo === 'gato' ? Cat : User
  
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
    const { casas, loading, error, refetch } = useCasas()
    
    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    })
    const [sorting, setSorting] = useState<SortingState>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState<'todas' | 'residencial' | 'arrendada'>('todas')
    const [isSheetOpen, setIsSheetOpen] = useState(false)
    const searchInputRef = useRef<HTMLInputElement>(null)

    // Estado del formulario
    const [formData, setFormData] = useState({
      // Información personal
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      tipoDocumento: '',
      numeroDocumento: '',
      // Información de contacto
      correoElectronico: '',
      telefono: '',
      // Información de propiedad
      rolEnCasa: '',
      casaAsociada: ''
    })

    const handleClearSearch = useCallback(() => {
      setSearchTerm('')
      if (searchInputRef.current) {
        searchInputRef.current.focus()
      }
    }, [])

    const handleInputChange = useCallback((field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }, [])

    const handleSubmit = useCallback((e: React.FormEvent) => {
      e.preventDefault()
      // Aquí agregarías la lógica para crear el nuevo propietario
      console.log('Nuevo propietario:', formData)
      // Resetear formulario y cerrar sheet
      setFormData({
        primerNombre: '',
        segundoNombre: '',
        primerApellido: '',
        segundoApellido: '',
        tipoDocumento: '',
        numeroDocumento: '',
        correoElectronico: '',
        telefono: '',
        rolEnCasa: '',
        casaAsociada: ''
      })
      setIsSheetOpen(false)
    }, [formData])

    const handleSheetOpenChange = useCallback((open: boolean) => {
      setIsSheetOpen(open)
    }, [])

    const handleDelete = useCallback((casaId: string) => {
      console.log('Eliminar propietario de casa:', casaId)
      alert(`Propietario de la casa ${casaId} eliminado`)
    }, [])

    const filteredCasas = useMemo(() => {
      if (!searchTerm && filterType === 'todas') {
        return casas
      }

      const searchLower = searchTerm.toLowerCase()
      
      return casas.filter(casa => {
        // Normalizar comparación del filtro
        if (filterType !== 'todas') {
          const usoNormalizado = casa.usoCasa.toLowerCase().trim()
          if (usoNormalizado !== filterType) {
            return false
          }
        }

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

    const hasResults = filteredCasas.length > 0

    const columns = useMemo<ColumnDef<Casa>[]>(
      () => [
        {
          accessorKey: 'propietario',
          id: 'propietario',
          header: ({ column }) => <DataGridColumnHeader title="Propietario / Casa" column={column} />,
          cell: ({ row }) => (
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
                <div className="text-sm text-gray-500">Casa No.{row.original.numeroCasa}</div>
              </div>
            </div>
          ),
          size: 250,
          enableSorting: true,
          enableHiding: false,
        },
        {
          accessorKey: 'miembros',
          id: 'miembros',
          header: ({ column }) => <DataGridColumnHeader title="Miembros" column={column} />,
          cell: ({ row }) => (
            <div className="text-gray-900 font-medium">{row.original.cantidadMiembros}</div>
          ),
          size: 120,
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
          accessorKey: 'estado',
          id: 'estado',
          header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
          cell: ({ row }) => {
            const estado = row.original.estadoFinancieroCasa
            return (
              <Badge
                variant={estado === 'AL DIA' ? 'success' : 'destructive'}
                appearance="outline"
                size="md"
                className="gap-1.5"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    estado === 'AL DIA' ? 'bg-green-700' : 'bg-red-700'
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
          accessorKey: 'uso',
          id: 'uso',
          header: ({ column }) => <DataGridColumnHeader title="Uso" column={column} />,
          cell: ({ row }) => {
            const uso = row.original.usoCasa
            return (
              <Badge
                variant={uso === 'Residencial' ? 'outline' : 'secondary'}
                appearance="light"
                size="md"
              >
                {uso}
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
        },
      ],
      [handleDelete]
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

            {/* Estados de carga y error */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-500">Cargando casas...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="text-red-400 mr-3">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Error al cargar las casas</h3>
                      <p className="text-sm text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={refetch} 
                    variant="outline" 
                    size="sm"
                    className="text-red-700 border-red-300 hover:bg-red-50"
                  >
                    Reintentar
                  </Button>
                </div>
              </div>
            )}

            {/* Solo mostrar el contenido si no está cargando y no hay error */}
            {!loading && !error && (
              <>
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
                        <SheetContent side="right" className="w-[600px] sm:w-[720px] data-[state=open]:duration-300 data-[state=closed]:duration-250">
                  <SheetHeader>
                    <SheetTitle>Nuevo Propietario</SheetTitle>
                    <SheetDescription>
                      Registra un nuevo propietario en el sistema con toda su información personal y de contacto.
                    </SheetDescription>
                  </SheetHeader>
                  <form onSubmit={handleSubmit} className="flex flex-col h-full">
                    <div className="flex-1 overflow-y-auto">
                      <NuevoPropietarioForm
                        formData={formData}
                        onInputChange={handleInputChange}
                      />
                    </div>
                    
                    <SheetFooter className="flex flex-row gap-3 mt-auto">
                        <Button variant="outline" className="flex-1">Cancelar</Button>
                      <SheetClose asChild>
                        <Button type="submit" className="flex-1">Crear Propietario</Button>
                        
                      </SheetClose>
                    </SheetFooter>
                  </form>
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
              </>
            )}
          </div>
        </div>
      </>
    )
  }

