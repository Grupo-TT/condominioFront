'use client'

import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { AddInvoiceIcon, InvoiceIcon, TransactionHistoryIcon, LinkSquare01Icon } from '@hugeicons/core-free-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from 'next/link'

interface AccountStatusCardProps {
    saldoActual: string
    ultimoPago: string
    conceptoUltimoPago: string
    fechaUltimoPago: string
}

export function AccountStatusCard({
    saldoActual,
    ultimoPago,
    conceptoUltimoPago,
    fechaUltimoPago,
}: AccountStatusCardProps) {
    const numericBalance = parseFloat(saldoActual.replace(/[^0-9.-]+/g, ""))
    const isAlDia = numericBalance === 0

    const statusLabels = isAlDia
        ? { text: "Al Día", iconColor: "text-emerald-700", icon: CheckCircle2 }
        : { text: "En Mora", iconColor: "text-red-600", icon: AlertCircle }

    const displayAmount = isAlDia ? "$0.00" : saldoActual

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
                        <span className="text-xs text-gray-400 ml-auto bg-white px-3 py-1.5 rounded-lg">{fechaUltimoPago}</span>
                    </div>
                    {/* Payment Card */}
                    <div className="bg-white rounded-lg p-3 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50">
                            <HugeiconsIcon icon={InvoiceIcon} className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-600">{conceptoUltimoPago}</p>
                        </div>
                        <p className="font-semibold text-gray-800">{ultimoPago}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
