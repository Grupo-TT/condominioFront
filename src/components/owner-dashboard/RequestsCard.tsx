'use client'

import { Card, CardContent } from '@/components/ui/card'
import { HugeiconsIcon } from '@hugeicons/react'
import { AppleReminderIcon, LinkSquare01Icon, Wrench01Icon, Alert02Icon, IdeaIcon, NotificationCircleIcon } from '@hugeicons/core-free-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Calendar as CalendarIcon } from 'lucide-react'

interface Solicitud {
    id: string
    titulo: string
    tipo: 'reparacion-locativa' | 'queja' | 'peticion' | 'sugerencia'
    fecha: string
    estado: 'pendiente' | 'aprobada' | 'rechazada' | 'revisada'
    descripcion?: string
}

interface RequestsCardProps {
    solicitudes: Solicitud[]
    loading?: boolean
}

const getTipoConfig = (tipo: Solicitud['tipo']) => {
    const configs: Record<Solicitud['tipo'], { icon: typeof Wrench01Icon; iconBgColor: string; iconColor: string; typeBgColor: string; label: string }> = {
        'reparacion-locativa': {
            icon: Wrench01Icon,
            iconBgColor: '#E3E4EA',
            iconColor: '#595D75',
            typeBgColor: '#E3E4EA',
            label: 'Reparación Locativa'
        },
        'queja': {
            icon: Alert02Icon,
            iconBgColor: '#F1E8D6',
            iconColor: '#A39170',
            typeBgColor: '#F1E8D6',
            label: 'Queja'
        },
        'peticion': {
            icon: NotificationCircleIcon,
            iconBgColor: '#E6EFEA',
            iconColor: '#4C6C5A',
            typeBgColor: '#E6EFEA',
            label: 'Petición'
        },
        'sugerencia': {
            icon: IdeaIcon,
            iconBgColor: '#E6EFEA',
            iconColor: '#4C6C5A',
            typeBgColor: '#E6EFEA',
            label: 'Sugerencia'
        }
    }
    return configs[tipo]
}

const getEstadoConfig = (estado: Solicitud['estado']) => {
    const configs: Record<Solicitud['estado'], { dotColor: string; label: string }> = {
        'pendiente': { dotColor: 'bg-yellow-500', label: 'Pendiente' },
        'aprobada': { dotColor: 'bg-green-500', label: 'Aprobada' },
        'rechazada': { dotColor: 'bg-red-500', label: 'Rechazada' },
        'revisada': { dotColor: 'bg-blue-500', label: 'Revisada' }
    }
    return configs[estado]
}

export function RequestsCard({ solicitudes, loading = false }: RequestsCardProps) {
    if (loading) {
        return (
            <Card className="border bg-white rounded-2xl py-0 flex-1 min-w-[280px]">
                <CardContent className="p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-11 h-11 rounded-xl" />
                            <div>
                                <Skeleton className="h-5 w-28 mb-1" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 rounded-xl p-4" style={{ backgroundColor: '#F6F6F6' }}>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Skeleton key={i} className="h-16 w-full rounded-lg" />
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border bg-white rounded-2xl py-0 flex-1 min-w-[280px]">
            <CardContent className="p-5 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                            <HugeiconsIcon icon={AppleReminderIcon} className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Mis Solicitudes</h3>
                            <p className="text-sm text-gray-500">Peticiones, quejas y sugerencias</p>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/solicitudes" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                                    <HugeiconsIcon icon={LinkSquare01Icon} className="h-4 w-4" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver más</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Requests List */}
                <div className="flex-1 overflow-y-auto rounded-xl p-4 max-h-[320px]" style={{ backgroundColor: '#F6F6F6' }}>
                    {solicitudes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                            <HugeiconsIcon icon={AppleReminderIcon} className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No tienes solicitudes registradas</p>
                            <Link href="/solicitudes" className="text-sm text-primary hover:underline mt-2">
                                Crear una solicitud
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {solicitudes.map((solicitud, index) => {
                                const tipoConfig = getTipoConfig(solicitud.tipo)
                                const estadoConfig = getEstadoConfig(solicitud.estado)
                                return (
                                    <div
                                        key={solicitud.id}
                                        className={`flex items-start justify-between ${index < solicitudes.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}
                                    >
                                        <div className="flex items-start gap-3 flex-1">
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                                style={{ backgroundColor: tipoConfig.iconBgColor }}
                                            >
                                                <HugeiconsIcon icon={tipoConfig.icon} size={18} style={{ color: tipoConfig.iconColor }} strokeWidth={1.5} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="font-medium text-gray-900 line-clamp-1">{solicitud.titulo}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge
                                                        className="text-xs font-medium text-gray-700 border-0"
                                                        style={{ backgroundColor: tipoConfig.typeBgColor }}
                                                        size="sm"
                                                    >
                                                        {tipoConfig.label}
                                                    </Badge>
                                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                                        <CalendarIcon className="w-3 h-3" />
                                                        {new Date(solicitud.fecha).toLocaleDateString('es-CO', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-gray-600 bg-white border border-gray-300 px-2.5 py-1 rounded-full flex items-center gap-1.5 flex-shrink-0">
                                            <span className={`w-2 h-2 rounded-full ${estadoConfig.dotColor}`}></span>
                                            {estadoConfig.label}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
