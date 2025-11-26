'use client'

import { useMemo, useState, useRef, useCallback } from 'react'
import { DataGrid, DataGridContainer } from '@/components/ui/data-grid'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Plus, MoreVertical, Eye, Mail, Search, X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
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
import { FormFieldWithTooltip, FormInput } from '@/components/forms'

// Tipo para los comunicados
interface Comunicado {
  id: string
  asunto: string
  mensaje: string
  fechaEnvio: string
  destinatarios: number
  estado: 'enviado' | 'pendiente' | 'error'
}

// Datos mock iniciales (luego se reemplazarán con datos reales)
const comunicadosMock: Comunicado[] = [
  {
    id: '1',
    asunto: 'Recordatorio de pago de cuota mensual',
    mensaje: 'Estimados propietarios, les recordamos que el pago de la cuota mensual vence el próximo 15 de cada mes...',
    fechaEnvio: '2024-01-15T10:30:00',
    destinatarios: 25,
    estado: 'enviado',
  },
  {
    id: '2',
    asunto: 'Mantenimiento programado del ascensor',
    mensaje: 'Informamos que el próximo lunes se realizará mantenimiento preventivo del ascensor...',
    fechaEnvio: '2024-01-10T14:20:00',
    destinatarios: 25,
    estado: 'enviado',
  },
]

export default function ComunicadosPage() {
  const [activeTab, setActiveTab] = useState('enviar')
  const [comunicados, setComunicados] = useState<Comunicado[]>(comunicadosMock)
  const [loading, setLoading] = useState(false)
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedComunicado, setSelectedComunicado] = useState<Comunicado | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Estados del formulario
  const [formAsunto, setFormAsunto] = useState('')
  const [formMensaje, setFormMensaje] = useState('')
  const [errors, setErrors] = useState<{ asunto?: string; mensaje?: string }>({})

  const handleClearSearch = useCallback(() => {
    setSearchTerm('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  const validateForm = () => {
    const nextErrors: { asunto?: string; mensaje?: string } = {}
    if (!formAsunto || formAsunto.trim().length === 0) {
      nextErrors.asunto = 'El asunto es requerido.'
    } else if (formAsunto.length > 200) {
      nextErrors.asunto = 'El asunto no puede superar los 200 caracteres.'
    }
    if (!formMensaje || formMensaje.trim().length === 0) {
      nextErrors.mensaje = 'El mensaje es requerido.'
    } else if (formMensaje.length > 5000) {
      nextErrors.mensaje = 'El mensaje no puede superar los 5000 caracteres.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleEnviarComunicado = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setLoading(true)
      
      // Aquí iría la llamada al servicio para enviar el comunicado
      // const response = await comunicadoService.enviarComunicado({
      //   asunto: formAsunto,
      //   mensaje: formMensaje,
      // })

      // Simulación de envío
      await new Promise(resolve => setTimeout(resolve, 1000))

      const nuevoComunicado: Comunicado = {
        id: Date.now().toString(),
        asunto: formAsunto,
        mensaje: formMensaje,
        fechaEnvio: new Date().toISOString(),
        destinatarios: 25, // Esto vendría del servicio
        estado: 'enviado',
      }

      setComunicados(prev => [nuevoComunicado, ...prev])
      
      toast.success('Comunicado enviado exitosamente', {
        description: `Se envió a ${nuevoComunicado.destinatarios} propietarios`,
      })

      setFormAsunto('')
      setFormMensaje('')
      setErrors({})
      setActiveTab('enviados') // Cambiar a la tab de comunicados enviados
    } catch (err) {
      console.error('Error enviando comunicado:', err)
      toast.error('Error al enviar el comunicado', {
        description: 'Por favor, intenta de nuevo.',
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredComunicados = useMemo(() => {
    const term = searchTerm.toLowerCase()
    return comunicados.filter((c) => {
      if (!term) return true
      return (
        c.asunto.toLowerCase().includes(term) ||
        c.mensaje.toLowerCase().includes(term)
      )
    })
  }, [searchTerm, comunicados])

  const columns = useMemo<ColumnDef<Comunicado>[]>(
    () => [
      {
        accessorKey: 'asunto',
        id: 'asunto',
        header: ({ column }) => <DataGridColumnHeader title="Asunto" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-px">
              <div className="font-medium text-gray-900">{row.original.asunto}</div>
              <div className="text-xs text-gray-500">
                {new Date(row.original.fechaEnvio).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ),
        enableSorting: true,
        enableHiding: false,
        size: 300,
        meta: {
          skeleton: (
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ),
        },
      },
      {
        accessorKey: 'mensaje',
        id: 'mensaje',
        header: ({ column }) => <DataGridColumnHeader title="Mensaje" column={column} />,
        cell: ({ row }) => (
          <span className="line-clamp-2 text-gray-600" title={row.original.mensaje}>
            {row.original.mensaje}
          </span>
        ),
        enableSorting: false,
        size: 400,
        meta: {
          skeleton: <Skeleton className="h-4 w-96" />,
        },
      },
      {
        accessorKey: 'destinatarios',
        id: 'destinatarios',
        header: ({ column }) => <DataGridColumnHeader title="Destinatarios" column={column} />,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              {row.original.destinatarios} propietarios
            </span>
          </div>
        ),
        enableSorting: true,
        size: 150,
        meta: {
          skeleton: <Skeleton className="h-4 w-20" />,
        },
      },
      {
        accessorKey: 'estado',
        id: 'estado',
        header: ({ column }) => <DataGridColumnHeader title="Estado" column={column} />,
        cell: ({ row }) => {
          const estado = row.original.estado
          const getBadgeVariant = () => {
            if (estado === 'enviado') return 'success'
            if (estado === 'pendiente') return 'warning'
            return 'destructive'
          }
          const getEstadoLabel = () => {
            if (estado === 'enviado') return 'Enviado'
            if (estado === 'pendiente') return 'Pendiente'
            return 'Error'
          }
          return (
            <Badge
              variant={getBadgeVariant()}
              appearance="outline"
            >
              {getEstadoLabel()}
            </Badge>
          )
        },
        enableSorting: true,
        size: 120,
        meta: {
          skeleton: <Skeleton className="h-6 w-20" />,
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
                    setSelectedComunicado(row.original)
                    setIsSheetOpen(true)
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Ver detalles
                </DropdownMenuItem>
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
    []
  )

  const table = useReactTable({
    columns,
    data: filteredComunicados,
    pageCount: Math.ceil((filteredComunicados?.length || 0) / pagination.pageSize),
    getRowId: (row: Comunicado) => row.id,
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
                <BreadcrumbPage>Comunicados</BreadcrumbPage>
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
              <h1 className="text-2xl font-bold text-gray-900">Comunicados</h1>
              <p className="text-gray-500 mt-1">
                Envía correos masivos a los propietarios del condominio y gestiona tus comunicaciones.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList variant="line" className="h-auto bg-transparent p-0 border-b border-gray-200">
              <TabsTrigger 
                value="enviar" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:border-green-800"
              >
                <Send className="w-4 h-4" />
                Enviar Comunicado
              </TabsTrigger>
              <TabsTrigger 
                value="enviados" 
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:border-green-800"
              >
                <Mail className="w-4 h-4" />
                Comunicados Enviados
              </TabsTrigger>
            </TabsList>

            {/* Tab: Enviar Comunicado */}
            <TabsContent value="enviar" className="mt-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <form onSubmit={handleEnviarComunicado} className="space-y-6">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold text-gray-900">Nuevo Comunicado</h2>
                    <p className="text-sm text-gray-500">
                      Completa el formulario para enviar un comunicado masivo a todos los propietarios del condominio.
                    </p>
                  </div>

                  <Separator />

                  <FormInput
                    name="asunto"
                    label="Asunto"
                    required
                    value={formAsunto}
                    onChange={(val) => {
                      setFormAsunto(val)
                      if (val.trim().length > 0 && val.length <= 200) {
                        setErrors((prev) => ({ ...prev, asunto: undefined }))
                      }
                    }}
                    placeholder="Ej: Recordatorio de pago de cuota mensual"
                    invalid={Boolean(errors.asunto)}
                    error={errors.asunto}
                    showError={Boolean(errors.asunto)}
                    maxLength={200}
                  />

                  <div className="space-y-2">
                    <FormFieldWithTooltip
                      label="Mensaje"
                      required
                      invalid={Boolean(errors.mensaje)}
                      error={errors.mensaje}
                    >
                      <div className="relative">
                        <textarea
                          id="mensaje"
                          value={formMensaje}
                          onChange={(e) => {
                            const val = e.target.value
                            setFormMensaje(val)
                            if (val.trim().length > 0 && val.length <= 5000) {
                              setErrors((prev) => ({ ...prev, mensaje: undefined }))
                            }
                          }}
                          placeholder="Escribe el mensaje que deseas enviar a los propietarios..."
                          className="w-full min-h-48 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-gray-300 focus:ring-1 focus:ring-gray-200 resize-none"
                          maxLength={5000}
                        />
                      </div>
                    </FormFieldWithTooltip>
                    <div className="text-xs text-gray-500 text-right">
                      {formMensaje.length} / 5000 caracteres
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Send className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          Información de envío
                        </p>
                        <p className="text-sm text-blue-700">
                          Este comunicado se enviará a todos los propietarios registrados en el sistema que tengan un correo electrónico válido.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setFormAsunto('')
                        setFormMensaje('')
                        setErrors({})
                      }}
                    >
                      Limpiar
                    </Button>
                    <Button type="submit" className="gap-2" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Enviar Comunicado
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            {/* Tab: Comunicados Enviados */}
            <TabsContent value="enviados" className="mt-6">
              <div className="space-y-6">
                {/* Barra de búsqueda */}
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      placeholder="Buscar comunicados..."
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
                </div>

                {/* Tabla de comunicados */}
                {loading && comunicados.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-6">
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : filteredComunicados.length === 0 ? (
                  <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-12 px-6 text-center hover:border-gray-400 transition-colors">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-base font-semibold text-gray-700">
                          {searchTerm ? 'No se encontraron resultados' : 'No hay comunicados enviados'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {searchTerm
                            ? `No hay comunicados que coincidan con "${searchTerm}"`
                            : 'Aún no has enviado ningún comunicado. Ve a la pestaña "Enviar Comunicado" para comenzar.'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <DataGrid
                    table={table}
                    recordCount={filteredComunicados?.length || 0}
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
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Sheet para ver detalles del comunicado */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250"
          style={{ width: '600px', maxWidth: 'none' }}
        >
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="text-xl font-semibold">
              Detalles del Comunicado
            </SheetTitle>
            <SheetDescription className="text-gray-600">
              Información completa del comunicado enviado.
            </SheetDescription>
          </SheetHeader>

          {selectedComunicado && (
            <div className="flex flex-col h-full overflow-y-auto">
              <div className="space-y-6 px-4 pt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Asunto</label>
                  <p className="text-sm text-gray-900">{selectedComunicado.asunto}</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Mensaje</label>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{selectedComunicado.mensaje}</p>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Fecha de envío</label>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedComunicado.fechaEnvio).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Destinatarios</label>
                    <p className="text-sm text-gray-600">{selectedComunicado.destinatarios} propietarios</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Estado</label>
                  <Badge
                    variant={selectedComunicado.estado === 'enviado' ? 'success' : selectedComunicado.estado === 'pendiente' ? 'warning' : 'destructive'}
                    appearance="outline"
                  >
                    {selectedComunicado.estado === 'enviado' ? 'Enviado' : selectedComunicado.estado === 'pendiente' ? 'Pendiente' : 'Error'}
                  </Badge>
                </div>
              </div>
              <SheetFooter className="mt-auto px-4 pb-4 pt-4 border-t">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1">Cerrar</Button>
                </SheetClose>
              </SheetFooter>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

