'use client'

import { useRouter, useParams } from 'next/navigation'
import { useMemo } from 'react'
import { useCasaContext } from '@/contexts/CasaContext'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home07Icon, NotificationSquareIcon, Door01Icon, UserGroupIcon, User03Icon } from '@hugeicons/core-free-icons'
import { ArrowLeft, Edit, Users, DollarSign, Calendar, Wrench, Dog, Cat, PawPrint } from 'lucide-react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMiembros } from '@/hooks/useCasa'

// Datos de ejemplo - en una aplicación real esto vendría de una API


export default function CasaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const numeroCasa = params.id as string
  const { getCasaFromCache, clearCasaCache } = useCasaContext()
  
  // Leer la casa del contexto (más rápido que sessionStorage, sin serialización)
  const casaPrecargada = useMemo(() => {
    const casa = getCasaFromCache(numeroCasa)
    // Limpiar del caché después de leerlo para liberar memoria
    if (casa) {
      clearCasaCache(numeroCasa)
    }
    return casa
  }, [numeroCasa, getCasaFromCache, clearCasaCache])
  
  const { casa: casaSeleccionada, miembros, loading } = useMiembros(numeroCasa, casaPrecargada)

  const propietarioMiembro = useMemo(() => {
    return miembros.find((m) => m.tipoMiembro === 'PROPIETARIO')
  }, [miembros])

  const totalMascotas = useMemo(() => {
    if (!casaSeleccionada?.mascotas) return 0
    return Object.values(casaSeleccionada.mascotas).reduce(
      (total, cantidad) => total + (cantidad || 0), 
      0
    )
  }, [casaSeleccionada])

  const miembrosFiltrados = useMemo(() => {
    return miembros.filter(miembro => {
      const tipo = miembro.tipoMiembro.toUpperCase()
      return tipo !== 'PROPIETARIO'
    })
  }, [miembros])

  // Función helper para determinar el género según el tipo de miembro
  const getGenderFromTipoMiembro = (tipoMiembro: string): 'masculino' | 'femenino' | 'neutro' => {
    const tipo = tipoMiembro.toUpperCase()
    
    // Tipos femeninos
    if (tipo.includes('HIJA') || tipo.includes('ESPOSA') || tipo.includes('MADRE') || 
        tipo.includes('HERMANA') || tipo.includes('ABUELA') || tipo.includes('TIA') ||
        tipo.includes('SOBRINA') || tipo.includes('NIETA')) {
      return 'femenino'
    }
    
    // Tipos masculinos
    if (tipo.includes('HIJO') || tipo.includes('ESPOSO') || tipo.includes('PADRE') || 
        tipo.includes('HERMANO') || tipo.includes('ABUELO') || tipo.includes('TIO') ||
        tipo.includes('SOBRINO') || tipo.includes('NIETO')) {
      return 'masculino'
    }
    
    return 'neutro'
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
          </div>
        </header>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando información de la casa...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!casaSeleccionada) {
    return (
      <div className="flex flex-col h-full">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
      <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
                <BreadcrumbPage>Casa No. {casaSeleccionada?.numeroCasa}</BreadcrumbPage>
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
                Casa N° {casaSeleccionada?.numeroCasa} - {casaSeleccionada?.propietario.nombreCompleto}
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
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {/* Tarjeta principal con toda la información */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-6">
              {/* NOMBRE */}
              <div className="space-y-2 min-w-0">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  NOMBRE
                </label>
                <p className="text-lg font-bold text-gray-900">{casaSeleccionada?.propietario.nombreCompleto}</p>
              </div>

              {/* TELEFONO */}
              <div className="space-y-2 min-w-0">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  TELEFONO
                </label>
                <p className="text-lg font-bold text-gray-900">{casaSeleccionada?.propietario.telefono}</p>
              </div>

              {/* EMAIL */}
              <div className="space-y-2 min-w-0 -ml-8">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  EMAIL
                </label>
                <p className="text-lg font-bold text-gray-900">{casaSeleccionada?.propietario.correo}</p>
              </div>

              {/* DOCUMENTO */}
              <div className="space-y-2 min-w-0">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  DOCUMENTO
                </label>
                <p className="text-lg font-bold text-gray-900">
                {propietarioMiembro?.numeroDocumento || 'No disponible'}
                </p>
              </div>

              {/* ESTADO */}
              <div className="space-y-2 min-w-0">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  ESTADO
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  <HugeiconsIcon
                    icon={NotificationSquareIcon}
                    size={18}
                    className="text-gray-500 shrink-0"
                  />
                <p className="text-lg font-bold text-gray-900">
                  {casaSeleccionada?.estadoFinancieroCasa
                    ?.toLowerCase()
                    ?.replace(/\b\w/g, (c) => c.toUpperCase())}
                </p>
                </div>
              </div>

              {/* TIPO DE USO */}
              <div className="space-y-2 min-w-0">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  TIPO DE USO
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  <HugeiconsIcon
                    icon={Door01Icon}
                    size={18}
                    className="text-gray-500 shrink-0"
                  />
                  <p className="text-lg font-bold text-gray-900">
                    {casaSeleccionada?.usoCasa?.toUpperCase() === 'ARRENDADA' ? 'Arrendada' : 'Propia'}
                  </p>
                </div>
              </div>

              {/* MIEMBROS */}
              <div className="space-y-2 min-w-0 -ml-8">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  MIEMBROS
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  <HugeiconsIcon
                    icon={UserGroupIcon}
                    size={18}
                    className="text-gray-500 shrink-0"
                  />
                  <p className="text-lg font-bold text-gray-900">{casaSeleccionada?.cantidadMiembros}</p>
                </div>
              </div>

              {/* MASCOTAS */}
              <div className="space-y-2 min-w-0">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  MASCOTAS
                </label>
                <div className="flex items-center gap-2 min-w-0">
                  <PawPrint className="w-5 h-5 text-gray-500 shrink-0" />
                  <p className="text-lg font-bold text-gray-900">
                    {totalMascotas}
                  </p>
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
                          {miembrosFiltrados.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {miembrosFiltrados.map((miembro, index) => {
                                const genero = getGenderFromTipoMiembro(miembro.tipoMiembro)
                                const colorConfig = genero === 'femenino' 
                                  ? { bg: 'bg-pink-100', text: 'text-pink-600' }
                                  : genero === 'masculino'
                                  ? { bg: 'bg-blue-100', text: 'text-blue-600' }
                                  : { bg: 'bg-gray-100', text: 'text-gray-600' }
                                
                                return (
                              <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  {/* Header con icono y nombre */}
                                  <div className="flex items-center gap-3 mb-3">
                                    <div className={`w-10 h-10 ${colorConfig.bg} rounded-full flex items-center justify-center`}>
                                      <HugeiconsIcon
                                        icon={User03Icon}
                                        size={20}
                                        className={colorConfig.text}
                                      />
                                    </div>
                                  <div className="flex-1 min-w-0">
                                    <h5 className="font-semibold text-gray-900 truncate">{miembro.nombreCompleto}</h5>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="secondary" className="text-xs">
                                        {miembro.tipoMiembro
                                          ? miembro.tipoMiembro.charAt(0).toUpperCase() + miembro.tipoMiembro.slice(1).toLowerCase()
                                          : ""}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Información */}
                                <div className="space-y-2">
                                  <div className="flex gap-4">
                                    <div className="flex-1">
                                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Documento</span>
                                      <p className="text-sm text-gray-900">
                                         {miembro.numeroDocumento}
                                      </p>
                                    </div>
                                    <div className="flex-1">
                                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Teléfono</span>
                                      <p className="text-sm text-gray-900">{miembro.telefono}</p>
                                    </div>
                                  </div>
                                  <div> 
                                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Correo</span> 
                                    <p className="text-sm text-gray-900 truncate" 
                                    title={miembro.email || 'Información no disponible'}>
                                    {miembro.email || 'Información no disponible'} 
                                    </p> 
                                  </div>
                                </div>
                              </div>
                            )})}
                          </div>
                          ) : (
                            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-4 px-6 text-center hover:border-gray-400 transition-colors">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <HugeiconsIcon
                                    icon={UserGroupIcon}
                                    size={24}
                                    className="text-gray-400"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-base font-semibold text-gray-700">No hay miembros registrados</p>
                                  <p className="text-sm text-gray-500">Esta vivienda no tiene miembros adicionales registrados</p>
                                </div>
                              </div>
                            </div>
                          )}
                      </div>

                      {/* Mascotas */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4">Mascotas</h4>

                          {casaSeleccionada?.mascotas &&
                          (casaSeleccionada.mascotas.perro > 0 ||
                            casaSeleccionada.mascotas.gato > 0 ||
                            casaSeleccionada.mascotas.otro > 0) ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Perros */}
                              {casaSeleccionada.mascotas.perro > 0 && (
                                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: '#F1E8D6' }}
                                    >
                                      <Dog className="w-5 h-5" style={{ color: '#A39170' }} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-lg font-bold text-gray-900">
                                        {casaSeleccionada.mascotas.perro}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {casaSeleccionada.mascotas.perro === 1 ? 'Perro' : 'Perros'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Gatos */}
                              {casaSeleccionada.mascotas.gato > 0 && (
                                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: '#E3E4EA' }}
                                    >
                                      <Cat className="w-5 h-5" style={{ color: '#595D75' }} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-lg font-bold text-gray-900">
                                        {casaSeleccionada.mascotas.gato}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {casaSeleccionada.mascotas.gato === 1 ? 'Gato' : 'Gatos'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Otros */}
                              {casaSeleccionada.mascotas.otro > 0 && (
                                <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <div className="flex items-center gap-3">
                                    <div 
                                      className="w-10 h-10 rounded-full flex items-center justify-center"
                                      style={{ backgroundColor: '#E6EFEA' }}
                                    >
                                      <PawPrint className="w-5 h-5" style={{ color: '#4C6C5A' }} />
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-lg font-bold text-gray-900">
                                        {casaSeleccionada.mascotas.otro}
                                      </span>
                                      <span className="text-sm text-gray-500">
                                        {casaSeleccionada.mascotas.otro === 1 ? 'Otro' : 'Otros'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-4 px-6 text-center hover:border-gray-400 transition-colors">
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <PawPrint className="w-6 h-6 text-gray-400" />
                                </div>
                                <div className="space-y-0.5">
                                  <p className="text-base font-semibold text-gray-700">No hay mascotas registradas</p>
                                  <p className="text-sm text-gray-500">Esta vivienda no tiene mascotas registradas</p>
                                </div>
                              </div>
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
