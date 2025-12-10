'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Check, Users, MapPin, Package } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar02Icon, LinkSquare01Icon } from '@hugeicons/core-free-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface Reservation {
    id: string
    title: string
    timeRange: string
    month: string
    day: string
    daysUntil: string
    resource: string
    resourceType: 'zona' | 'objeto'
    attendees: number
    status: 'pendiente' | 'aprobada' | 'rechazada' | 'finalizada'
    bgColor: string
    footerColor: string
    resourceBgColor: string
}

interface ReservationsCardProps {
    reservations: Reservation[]
    loading?: boolean
}

const getStatusConfig = (status: Reservation['status']) => {
    switch (status) {
        case 'aprobada':
            return { text: 'Confirmada', bgColor: 'bg-emerald-700' }
        case 'pendiente':
            return { text: 'Pendiente', bgColor: 'bg-yellow-500' }
        case 'rechazada':
            return { text: 'Rechazada', bgColor: 'bg-red-500' }
        case 'finalizada':
            return { text: 'Finalizada', bgColor: 'bg-gray-500' }
        default:
            return { text: 'Pendiente', bgColor: 'bg-yellow-500' }
    }
}

export function ReservationsCard({ reservations, loading = false }: ReservationsCardProps) {
    if (loading) {
        return (
            <Card className="border rounded-2xl py-0 flex-1 xl:max-w-[400px] w-full bg-white">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-11 h-11 rounded-xl" />
                            <div>
                                <Skeleton className="h-5 w-28 mb-1" />
                                <Skeleton className="h-4 w-36" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4 rounded-xl p-3" style={{ backgroundColor: '#F6F6F6' }}>
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-40 w-full rounded-2xl" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border rounded-2xl py-0 flex-1 xl:max-w-[400px] w-full bg-white">
            <CardContent className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                            <HugeiconsIcon icon={Calendar02Icon} className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Mis Reservas</h3>
                            <p className="text-sm text-gray-500">Reservas programadas</p>
                        </div>
                    </div>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/reservas" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                                    <HugeiconsIcon icon={LinkSquare01Icon} className="h-4 w-4" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver más</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Reservations Cards */}
                <div className="flex flex-col gap-4 overflow-y-auto max-h-[320px] rounded-xl p-3" style={{ backgroundColor: '#F6F6F6' }}>
                    {reservations.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <HugeiconsIcon icon={Calendar02Icon} className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No tienes reservas programadas</p>
                            <Link href="/reservas" className="text-sm text-primary hover:underline mt-2">
                                Hacer una reserva
                            </Link>
                        </div>
                    ) : (
                        reservations.map((reservation) => {
                            const statusConfig = getStatusConfig(reservation.status)
                            return (
                                <div
                                    key={reservation.id}
                                    className="relative flex flex-col rounded-2xl overflow-hidden w-full flex-shrink-0"
                                    style={{ backgroundColor: reservation.bgColor }}
                                >
                                    <div className="absolute top-3 right-3 z-10 flex items-center justify-center h-8 px-3 rounded-lg bg-white/80 text-gray-600 text-xs font-medium">
                                        {reservation.daysUntil}
                                    </div>
                                    <div className="px-4 pt-4 pb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col items-center justify-center w-11 h-11 rounded-xl bg-white font-bold text-gray-800">
                                                <span className="text-[10px] uppercase leading-tight text-gray-500">{reservation.month}</span>
                                                <span className="text-base leading-tight">{reservation.day}</span>
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 text-base">{reservation.title}</p>
                                                <p className="text-sm text-gray-600">{reservation.timeRange}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-4 pb-3">
                                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                                            <div
                                                className="flex items-center justify-center w-9 h-9 rounded-lg"
                                                style={{ backgroundColor: reservation.resourceBgColor }}
                                            >
                                                {reservation.resourceType === 'zona' ? (
                                                    <MapPin className="h-4 w-4 text-gray-600" />
                                                ) : (
                                                    <Package className="h-4 w-4 text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900">{reservation.resource}</p>
                                                <p className="text-xs text-gray-500">{reservation.resourceType === 'zona' ? 'Zona común' : 'Objeto'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className="px-4 py-3 flex items-center justify-between"
                                        style={{ backgroundColor: reservation.footerColor }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-white">
                                                <div className={`flex items-center justify-center w-4 h-4 rounded-full ${statusConfig.bgColor}`}>
                                                    <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                                                </div>
                                                <span className="text-gray-700">{statusConfig.text}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium bg-white">
                                                <Users className="h-3.5 w-3.5 text-gray-500" />
                                                <span className="text-gray-700">{reservation.attendees}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
