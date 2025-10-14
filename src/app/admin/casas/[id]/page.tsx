'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home07Icon, NotificationSquareIcon, Door01Icon, UserGroupIcon, User03Icon } from '@hugeicons/core-free-icons'
import { ArrowLeft, Edit, Trash2, Users, Heart, DollarSign, Calendar, Wrench, Dog, Cat, PawPrint } from 'lucide-react'
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Datos de ejemplo - en una aplicación real esto vendría de una API
const casasData = {
  '1': {
    id: '1',
    numero: '101',
    propietario: 'María González',
    tipoDocumento: 'Cédula',
    numeroDocumento: '12345678',
    correo: 'maria.gonzalez@email.com',
    telefono: '+57 300 123 4567',
    estado: 'Al Día',
    uso: 'Habitacional',
    rol: 'Propietario',
    fechaRegistro: '2023-01-15',
    ultimaActualizacion: '2024-01-10',
    miembros: [
      { 
        nombre: 'María González', 
        relacion: 'Propietaria', 
        edad: 35,
        genero: 'femenino',
        tipoDocumento: 'Cédula',
        numeroDocumento: '12345678',
        telefono: '+57 300 123 4567',
        correo: 'maria.gonzalez@email.com'
      },
      { 
        nombre: 'Carlos González', 
        relacion: 'Esposo', 
        edad: 38,
        genero: 'masculino',
        tipoDocumento: 'Cédula',
        numeroDocumento: '87654321',
        telefono: '+57 300 987 6543',
        correo: 'carlos.gonzalez@email.com'
      },
      { 
        nombre: 'Ana González', 
        relacion: 'Hija', 
        edad: 12,
        genero: 'femenino',
        tipoDocumento: 'Tarjeta de Identidad',
        numeroDocumento: 'TI123456789',
        telefono: '+57 300 555 1234',
        correo: 'ana.gonzalez@email.com'
      },
    ],
    mascotas: [
      { nombre: 'Max', tipo: 'Perro', raza: 'Golden Retriever' },
      { nombre: 'Luna', tipo: 'Gato', raza: 'Persa' },
    ],
  },
  '2': {
    id: '2',
    numero: '102',
    propietario: 'Juan Pérez',
    tipoDocumento: 'Cédula',
    numeroDocumento: '87654321',
    correo: 'juan.perez@email.com',
    telefono: '+57 300 987 6543',
    estado: 'En Mora',
    uso: 'Habitacional',
    rol: 'Propietario',
    fechaRegistro: '2023-02-20',
    ultimaActualizacion: '2024-01-05',
    miembros: [
      { 
        nombre: 'Juan Pérez', 
        relacion: 'Propietario', 
        edad: 42,
        genero: 'masculino',
        tipoDocumento: 'Cédula',
        numeroDocumento: '11223344',
        telefono: '+57 300 111 2233',
        correo: 'juan.perez@email.com'
      },
      { 
        nombre: 'Laura Pérez', 
        relacion: 'Esposa', 
        edad: 39,
        genero: 'femenino',
        tipoDocumento: 'Cédula',
        numeroDocumento: '55667788',
        telefono: '+57 300 444 5566',
        correo: 'laura.perez@email.com'
      },
    ],
    mascotas: [],
  },
}

export default function CasaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const casaId = params.id as string
  
  const casa = casasData[casaId as keyof typeof casasData]

  const handleDelete = () => {
    console.log('Eliminar casa:', casa?.id)
    // Aquí agregarías la lógica para eliminar la casa
    router.push('/admin/casas')
  }

  if (!casa) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                  <BreadcrumbLink href="/admin/casas">Casas</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Casa no encontrada</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="flex items-center justify-between p-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Casa no encontrada</h1>
              <p className="text-gray-500 mt-1">La casa solicitada no existe en el sistema</p>
            </div>
            
            <Button variant="outline" onClick={() => router.push('/admin/casas')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Casa no encontrada</h1>
              <p className="text-gray-600 mb-6">La casa que buscas no existe o ha sido eliminada.</p>
              <Button onClick={() => router.push('/admin/casas')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a Casas
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
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
                <BreadcrumbLink href="/admin/casas">Casas</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Casa {casa.numero}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="bg-white px-6 py-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <HugeiconsIcon
                icon={Home07Icon}
                size={24}
                strokeWidth={1.5}
                className="text-green-800"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Casa N° {casa.numero} - {casa.propietario}
              </h1>
              <p className="text-gray-600 text-base mt-1">
                Información general, miembros, mascotas y estado financiero de la vivienda.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => router.push('/admin/casas')} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <Button variant="outline" className="gap-2">
                <Edit className="w-4 h-4" />
                Editar
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-red-600 hover:text-red-700 gap-2">
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar casa?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará permanentemente el propietario{' '}
                        <strong>{casa.propietario}</strong> de la casa{' '}
                        <strong>{casa.numero}</strong> y toda su información asociada.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Tarjeta principal con toda la información */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* NOMBRE */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  NOMBRE
                </label>
                <p className="text-lg font-bold text-gray-900">{casa.propietario}</p>
              </div>

              {/* EMAIL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  EMAIL
                </label>
                <p className="text-lg font-bold text-gray-900">{casa.correo}</p>
              </div>

              {/* DOCUMENTO */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  DOCUMENTO
                </label>
                <p className="text-lg font-bold text-gray-900">
                  {casa.tipoDocumento} • {casa.numeroDocumento}
                </p>
              </div>

              {/* TELEFONO */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  TELEFONO
                </label>
                <p className="text-lg font-bold text-gray-900">{casa.telefono}</p>
              </div>

              {/* ESTADO */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  ESTADO
                </label>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={NotificationSquareIcon}
                    size={18}
                    className="text-gray-500"
                  />
                  <p className="text-lg font-bold text-gray-900">{casa.estado}</p>
                </div>
              </div>

              {/* ROL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  ROL
                </label>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={Door01Icon}
                    size={18}
                    className="text-gray-500"
                  />
                  <p className="text-lg font-bold text-gray-900">{casa.rol}</p>
                </div>
              </div>

              {/* MIEMBROS */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  MIEMBROS
                </label>
                <div className="flex items-center gap-2">
                  <HugeiconsIcon
                    icon={UserGroupIcon}
                    size={18}
                    className="text-gray-500"
                  />
                  <p className="text-lg font-bold text-gray-900">{casa.miembros.length}</p>
                </div>
              </div>

              {/* MASCOTAS */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  MASCOTAS
                </label>
                <div className="flex items-center gap-2">
                  <PawPrint className="w-5 h-5 text-gray-500" />
                  <p className="text-lg font-bold text-gray-900">{casa.mascotas.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs de información adicional */}
          <div className="mt-4">
            <Tabs defaultValue="miembros-mascotas" className="w-full">
              <div className="border-b border-gray-200">
                <TabsList className="h-auto bg-transparent p-0">
                  <TabsTrigger 
                    value="miembros-mascotas" 
                    className="relative flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-800 rounded-none border-b-2 border-transparent"
                  >
                    <Users className="w-4 h-4" />
                    Miembros & Mascotas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="multas" 
                    className="relative flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-800 rounded-none border-b-2 border-transparent"
                  >
                    <DollarSign className="w-4 h-4" />
                    Multas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reservas" 
                    className="relative flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-800 rounded-none border-b-2 border-transparent"
                  >
                    <Calendar className="w-4 h-4" />
                    Reservas
                  </TabsTrigger>
                  <TabsTrigger 
                    value="reparaciones" 
                    className="relative flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-green-800 rounded-none border-b-2 border-transparent"
                  >
                    <Wrench className="w-4 h-4" />
                    Reparaciones
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="miembros-mascotas" className="mt-6">
                <div className="space-y-6">
                      {/* Miembros */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Miembros de la Vivienda</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {casa.miembros.filter(miembro => miembro.relacion !== 'Propietario' && miembro.relacion !== 'Propietaria').map((miembro, index) => (
                            <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                {/* Header con icono y nombre */}
                                <div className="flex items-center gap-3 mb-3">
                                  {miembro.genero === 'masculino' ? (
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                      <HugeiconsIcon
                                        icon={User03Icon}
                                        size={20}
                                        className="text-blue-600"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                                      <HugeiconsIcon
                                        icon={User03Icon}
                                        size={20}
                                        className="text-pink-600"
                                      />
                                    </div>
                                  )}
                                <div className="flex-1 min-w-0">
                                  <h5 className="font-semibold text-gray-900 truncate">{miembro.nombre}</h5>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {miembro.relacion}
                                    </Badge>
                                    <span className="text-xs text-gray-500">{miembro.edad} años</span>
                                  </div>
                                </div>
                              </div>

                              {/* Información */}
                              <div className="space-y-2">
                                <div className="flex gap-4">
                                  <div className="flex-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Documento</span>
                                    <p className="text-sm text-gray-900">
                                      {miembro.tipoDocumento === 'Cédula' ? 'CC.' : 
                                       miembro.tipoDocumento === 'Tarjeta de Identidad' ? 'TI.' : 
                                       miembro.tipoDocumento} {miembro.numeroDocumento}
                                    </p>
                                  </div>
                                  <div className="flex-1">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</span>
                                    <p className="text-sm text-gray-900">{miembro.telefono}</p>
                                  </div>
                                </div>
                                <div>
                                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Correo</span>
                                  <p className="text-sm text-gray-900 truncate" title={miembro.correo}>{miembro.correo}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mascotas */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Mascotas</h4>
                        {casa.mascotas.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {casa.mascotas.map((mascota, index) => (
                              <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                {/* Header con icono, nombre y raza */}
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    {mascota.tipo === 'Perro' ? (
                                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A3917020' }}>
                                        <Dog className="w-5 h-5" style={{ color: '#A39170' }} />
                                      </div>
                                    ) : mascota.tipo === 'Gato' ? (
                                      <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#595D7520' }}>
                                        <Cat className="w-5 h-5" style={{ color: '#595D75' }} />
                                      </div>
                                    ) : (
                                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <Heart className="w-5 h-5 text-gray-600" />
                                      </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-semibold text-gray-900 truncate">{mascota.nombre}</h5>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                          {mascota.tipo}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {/* Raza en la parte derecha */}
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Raza</span>
                                    <p className="text-sm text-gray-900">{mascota.raza}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Heart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No hay mascotas registradas</p>
                          </div>
                        )}
                      </div>
                </div>
              </TabsContent>

              <TabsContent value="multas" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Multas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay multas registradas para esta casa</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reservas" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reservas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay reservas registradas para esta casa</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reparaciones" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Reparaciones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-gray-500">
                      <p>No hay reparaciones registradas para esta casa</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}