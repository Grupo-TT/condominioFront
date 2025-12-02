// src/app/(propietario)/asamblea/page.tsx
'use client'

import { useEffect, useMemo } from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { useAsamblea } from '@/hooks/useAsamblea'
import { HugeiconsIcon } from '@hugeicons/react'
import { Book02Icon } from '@hugeicons/core-free-icons'

const formatPrettyDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString

  return new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
    .format(date)
    .replace(/(^\w)|(\s\w)/g, (match) => match.toUpperCase())
}

const formatPrettyTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const hoursValue = Number.isFinite(hours) ? hours! : 0
  const minutesValue = Number.isFinite(minutes) ? minutes! : 0

  const period = hoursValue >= 12 ? 'PM' : 'AM'
  const normalizedHours = hoursValue % 12 || 12
  const paddedMinutes = minutesValue.toString().padStart(2, '0')

  return `${normalizedHours}:${paddedMinutes} ${period}`
}

const estadoLabels: Record<string, string> = {
  programada: 'Programada',
  en_curso: 'En curso',
  finalizada: 'Finalizada',
  cancelada: 'Cancelada',
}

const estadoStyles: Record<string, string> = {
  programada: 'bg-blue-100 text-blue-800',
  en_curso: 'bg-green-100 text-green-800',
  finalizada: 'bg-gray-100 text-gray-800',
  cancelada: 'bg-red-100 text-red-800',
}

const formatTimelineDate = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return dateString

  const formatter = new Intl.DateTimeFormat('es-ES', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })

  return formatter.format(date)
}

const formatTimelineWeekday = (dateString: string) => {
  const date = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(date.getTime())) return ''

  const formatter = new Intl.DateTimeFormat('es-ES', { weekday: 'long' })
  const weekday = formatter.format(date)
  return weekday.charAt(0).toUpperCase() + weekday.slice(1)
}

const accentGradients = [
  'linear-gradient(130deg, #A4C8AE 0%, #E6D6B7 55%, #F5EFE0 100%)',
  'linear-gradient(140deg, #9397B0 0%, #B9BED5 55%, #F2E9D3 100%)',
  'linear-gradient(135deg, #7FA08E 0%, #A4C8AE 45%, #DCE3F1 100%)',
  'linear-gradient(145deg, #C37979 0%, #E6D6B7 60%, #FFF7EC 100%)',
  'linear-gradient(150deg, #A4C8AE 0%, #E6D6B7 40%, #B9BED5 80%, #FFFFFF 100%)',
  'linear-gradient(140deg, #BFB8A9 0%, #E6D6B7 60%, #FFFFFF 100%)',
]

const getAccentGradient = (seed: string) => {
  const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return accentGradients[hash % accentGradients.length]
}

export default function AsambleaPropietarioPage() {
  const { asambleas, fetchAsambleas, loading } = useAsamblea()

  useEffect(() => {
    fetchAsambleas()
  }, [fetchAsambleas])

  const upcomingAsambleas = useMemo(() => {
    const now = new Date()
    return asambleas
      .filter((asamblea) => {
        const asambleaDate = new Date(`${asamblea.fecha}T${asamblea.hora || '00:00'}`)
        return asambleaDate >= now
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.fecha}T${a.hora || '00:00'}`).getTime()
        const dateB = new Date(`${b.fecha}T${b.hora || '00:00'}`).getTime()
        return dateA - dateB
      })
  }, [asambleas])

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
                <BreadcrumbLink href="/dashboard">Dashboard Propietario</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Asambleas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-x-hidden">
        <div className="flex flex-1 flex-col gap-6 px-6 pt-6 pb-8 overflow-x-hidden">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Asambleas</h1>
            <p className="text-gray-500 mt-1">
              Estas son las próximas asambleas programadas disponibles para consulta.
            </p>
          </div>

          <section className="space-y-4 mt-5">
            {loading ? (
              <Card className="border-dashed">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  Cargando asambleas programadas...
                </CardContent>
              </Card>
            ) : upcomingAsambleas.length === 0 ? (
              <div className="rounded-lg border border-dashed p-10 text-center">
                <p className="text-base font-medium text-gray-900">
                  No hay asambleas programadas.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  En cuanto se programe una nueva asamblea, aparecerá en este listado.
                </p>
              </div>
            ) : (
              <div className="space-y-6 w-full max-w-6xl">
                {upcomingAsambleas.map((asamblea, index) => {
                  const isLast = index === upcomingAsambleas.length - 1
                  return (
                    <div key={asamblea.id} className="flex gap-4 md:gap-8 pr-4">
                      <div className="w-32 md:w-36 text-right">
                        <p className="text-sm font-semibold text-gray-700">
                          {formatTimelineDate(asamblea.fecha)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimelineWeekday(asamblea.fecha)}
                        </p>
                      </div>

                      <div className="flex flex-col items-center pt-1">
                        <span className="inline-block h-3 w-3 rounded-full bg-gray-400 ring-4 ring-white" />
                        {!isLast && <span className="flex-1 w-px bg-gray-200" />}
                      </div>

                      <Card className="flex-1 overflow-hidden border border-gray-100 shadow-sm py-0 gap-0">
                        <div className="flex flex-col gap-3.5 px-4 pt-7 pb-3.5 lg:flex-row lg:items-stretch">
                          <div className="flex-1 space-y-3">
                            <div className="flex flex-col gap-3.5 sm:flex-row sm:items-start sm:justify-between">
                              <div className="space-y-2">
                                <h3 className="text-xl font-semibold text-gray-900 leading-tight">
                                  {asamblea.titulo}
                                </h3>
                                <p className="text-sm text-gray-500 leading-tight">
                                  {formatPrettyDate(asamblea.fecha)}
                                </p>
                              </div>
                              <Badge className={`${estadoStyles[asamblea.estado]} capitalize`}>
                                {estadoLabels[asamblea.estado] ?? asamblea.estado}
                              </Badge>
                            </div>

                            <div className="rounded-2xl bg-gray-900/5 border border-gray-200/80 p-3 space-y-2.5">
                              <p className="text-[13px] text-gray-700 leading-relaxed">
                                {asamblea.descripcion}
                              </p>

                              <div className="grid gap-1.5 text-sm text-gray-700">
                                {[{
                                  icon: Clock,
                                  label: 'Hora de la asamblea',
                                  value: formatPrettyTime(asamblea.hora),
                                }, {
                                  icon: MapPin,
                                  label: 'Lugar de reunión',
                                  value: asamblea.lugar,
                                }].map(({ icon: Icon, label, value }) => (
                                  <div
                                    key={label}
                                    className="flex items-center gap-3"
                                  >
                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600">
                                      <Icon className="h-4 w-4" />
                                    </span>
                                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                                      <span className="text-gray-600">
                                        {label}
                                      </span>
                                      <span className="font-semibold text-gray-900 whitespace-nowrap">
                                        {value}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="lg:w-44 flex items-stretch">
                            <div
                              className="relative h-full min-h-[110px] w-full rounded-2xl flex items-center justify-center"
                              style={{ backgroundImage: getAccentGradient(asamblea.id) }}
                            >
                              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/70 text-gray-700 shadow-sm">
                                <HugeiconsIcon icon={Book02Icon} size={28} strokeWidth={1.8} />
                              </span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  )
}
