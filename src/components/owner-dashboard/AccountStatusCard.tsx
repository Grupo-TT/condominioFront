'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { AddInvoiceIcon, InvoiceIcon, TransactionHistoryIcon, LinkSquare01Icon } from '@hugeicons/core-free-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from 'next/link'
import { Skeleton } from '@/components/ui/skeleton'

interface AccountStatusCardProps {
    saldoPendiente: string
    estadoCasa: 'AL_DIA' | 'EN_MORA'
    ultimoPago: {
        fecha: string
        concepto: string
        valor: string
        tipoAbono: 'COMPLETO' | 'ABONO'
    } | null
    loading?: boolean
}

export function AccountStatusCard({
    saldoPendiente,
    estadoCasa,
    ultimoPago,
    loading = false,
}: AccountStatusCardProps) {
    const isAlDia = estadoCasa === 'AL_DIA'

    const statusLabels = isAlDia
        ? { text: "Al Día", iconColor: "text-emerald-700", icon: CheckCircle2 }
        : { text: "En Mora", iconColor: "text-red-600", icon: AlertCircle }

    const displayAmount = isAlDia ? "$0" : saldoPendiente

    if (loading) {
        return (
            <Card className="border bg-white rounded-2xl flex-1 min-w-[380px] py-0">
                <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-11 h-11 rounded-xl" />
                            <div>
                                <Skeleton className="h-5 w-32 mb-1" />
                                <Skeleton className="h-4 w-40" />
                            </div>
                        </div>
                    </div>
                    <div className="mb-5">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-9 w-40" />
                    </div>
                    <Skeleton className="h-24 w-full rounded-xl" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border bg-white rounded-2xl flex-1 min-w-[380px] py-0">
            <CardContent className="p-5">
                {/* Icon and Title */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                            <HugeiconsIcon icon={AddInvoiceIcon} className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Estado de cuenta</h3>
                            <p className="text-sm text-gray-500">Resumen financiero actual</p>
                        </div>
                    </div>
                    {/* See More Button */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Link href="/mi-casa/pagos-y-multas" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                                    <HugeiconsIcon icon={LinkSquare01Icon} className="h-4 w-4" />
                                </Link>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Ver más</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                {/* Amount and Status */}
                <div className="mb-5">
                    <p className="text-sm text-gray-500 font-medium mb-1">Saldo Pendiente</p>
                    <div className="flex items-center justify-between">
                        <span className="text-3xl font-bold tracking-tight text-gray-900">
                            {displayAmount}
                        </span>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-gray-200 bg-gray-50 text-gray-700">
                            {(() => {
                                const StatusIcon = statusLabels.icon
                                return <StatusIcon className={`h-3.5 w-3.5 ${statusLabels.iconColor}`} />
                            })()}
                            <span className="text-xs font-medium">{statusLabels.text}</span>
                        </div>
                    </div>
                </div>

                {/* Last Payment Section */}
                <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
                    {/* Section Header */}
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 rounded-lg bg-white shadow-sm border border-gray-200">
                            <HugeiconsIcon icon={TransactionHistoryIcon} className="h-4 w-4 text-gray-500" />
                        </div>
                        <span className="text-sm text-gray-600 font-medium">Último pago realizado</span>
                        {ultimoPago && (
                            <span className="text-xs text-gray-400 ml-auto bg-white px-3 py-1.5 rounded-lg">{ultimoPago.fecha}</span>
                        )}
                    </div>
                    {/* Payment Card */}
                    {ultimoPago ? (
                        <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-50">
                                <HugeiconsIcon icon={InvoiceIcon} className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600">{ultimoPago.concepto}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${ultimoPago.tipoAbono === 'COMPLETO'
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {ultimoPago.tipoAbono === 'COMPLETO' ? 'Pago completo' : 'Abono'}
                                </span>
                            </div>
                            <p className="font-semibold text-gray-800">{ultimoPago.valor}</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg p-3 flex items-center justify-center text-gray-400 text-sm">
                            No hay pagos registrados
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
