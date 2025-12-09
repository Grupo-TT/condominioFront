'use client'

import { Card, CardContent } from '@/components/ui/card'
import { HugeiconsIcon } from '@hugeicons/react'
import { AppleReminderIcon, LinkSquare01Icon, Wrench01Icon, Alert02Icon, IdeaIcon, NotificationCircleIcon } from '@hugeicons/core-free-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Request {
    id: string
    title: string
    type: string
    date: string
    status: string
    statusColor: string
    icon: typeof Wrench01Icon
    iconBgColor: string
    iconColor: string
    typeBgColor: string
}

const requestsData: Request[] = [
    {
        id: '1',
        title: 'Reparación tubería baño principal',
        type: 'Reparación Locativa',
        date: 'Nov 28, 2024',
        status: 'Pendiente',
        statusColor: 'bg-yellow-500',
        icon: Wrench01Icon,
        iconBgColor: '#E3E4EA',
        iconColor: '#595D75',
        typeBgColor: '#E3E4EA',
    },
    {
        id: '2',
        title: 'Ruido excesivo en horario nocturno',
        type: 'Queja',
        date: 'Nov 15, 2024',
        status: 'Revisada',
        statusColor: 'bg-blue-500',
        icon: Alert02Icon,
        iconBgColor: '#F1E8D6',
        iconColor: '#A39170',
        typeBgColor: '#F1E8D6',
    },
    {
        id: '3',
        title: 'Instalar más bancas en el parque',
        type: 'Sugerencia',
        date: 'Oct 20, 2024',
        status: 'Aprobada',
        statusColor: 'bg-green-500',
        icon: IdeaIcon,
        iconBgColor: '#E6EFEA',
        iconColor: '#4C6C5A',
        typeBgColor: '#E6EFEA',
    },
    {
        id: '4',
        title: 'Notificación de trasteo',
        type: 'Notificación',
        date: 'Dic 01, 2024',
        status: 'Pendiente',
        statusColor: 'bg-yellow-500',
        icon: NotificationCircleIcon,
        iconBgColor: '#E3E4EA',
        iconColor: '#595D75',
        typeBgColor: '#E3E4EA',
    },
    {
        id: '5',
        title: 'Consulta reserva salón social',
        type: 'Consulta',
        date: 'Dic 03, 2024',
        status: 'En revisión',
        statusColor: 'bg-blue-500',
        icon: IdeaIcon,
        iconBgColor: '#F1E8D6',
        iconColor: '#A39170',
        typeBgColor: '#F1E8D6',
    },
    {
        id: '6',
        title: 'Vehículo mal estacionado',
        type: 'Reporte',
        date: 'Dic 05, 2024',
        status: 'Cerrada',
        statusColor: 'bg-gray-400',
        icon: Alert02Icon,
        iconBgColor: '#E6EFEA',
        iconColor: '#4C6C5A',
        typeBgColor: '#E6EFEA',
    },
]

export function RequestsCard() {
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
                                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                                    <HugeiconsIcon icon={LinkSquare01Icon} className="h-4 w-4" />
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver más</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Requests List */}
                <div className="flex-1 overflow-y-auto rounded-xl p-4 max-h-[320px]" style={{ backgroundColor: '#F6F6F6' }}>
                    <div className="space-y-4">
                        {requestsData.map((request, index) => (
                            <div
                                key={request.id}
                                className={`flex items-start justify-between ${index < requestsData.length - 1 ? 'border-b border-gray-100 pb-4' : ''}`}
                            >
                                <div className="flex items-start gap-3 flex-1">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ backgroundColor: request.iconBgColor }}
                                    >
                                        <HugeiconsIcon icon={request.icon} size={18} style={{ color: request.iconColor }} strokeWidth={1.5} />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-gray-900">{request.title}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span
                                                className="px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-700"
                                                style={{ backgroundColor: request.typeBgColor }}
                                            >
                                                {request.type}
                                            </span>
                                            <span className="text-xs text-gray-400">{request.date}</span>
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-600 bg-white border border-gray-300 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                                    <span className={`w-2 h-2 rounded-full ${request.statusColor}`}></span>
                                    {request.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
