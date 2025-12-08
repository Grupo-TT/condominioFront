'use client'

import { HugeiconsIcon } from '@hugeicons/react'
import {
    MoneyReceiveSquareIcon,
    MoneySendSquareIcon,
    WalletIcon,
    MoneyBag02Icon,
} from '@hugeicons/core-free-icons'
import { DashboardSummary } from "@/data/dashboard.mock"

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}

interface MetricsCardsGridProps {
    summary: DashboardSummary
}

export function MetricsCardsGrid({ summary }: MetricsCardsGridProps) {
    return (
        <div className="flex flex-col gap-3 h-full">
            {/* Section Header */}
            <div className="pt-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Métricas del Mes Actual
                </h2>
                <p className="text-sm text-gray-500">
                    Resumen financiero del periodo en curso
                </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 flex-1">
                {/* Entradas Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-base text-gray-600">Entradas</p>
                        <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                            <HugeiconsIcon icon={MoneyReceiveSquareIcon} className="w-6 h-6" style={{ color: '#10b981' }} />
                        </div>
                    </div>
                    <div className="text-[26px] font-semibold text-gray-900 mb-2">
                        {formatCurrency(summary.entradas)}
                    </div>
                    <p className="text-xs text-gray-500 mt-auto">
                        Total de ingresos del mes
                    </p>
                </div>

                {/* Salidas Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-base text-gray-600">Salidas</p>
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <HugeiconsIcon icon={MoneySendSquareIcon} className="w-6 h-6" style={{ color: '#ef4444' }} />
                        </div>
                    </div>
                    <div className="text-[26px] font-semibold text-gray-900 mb-2">
                        {formatCurrency(summary.salidas)}
                    </div>
                    <p className="text-xs text-gray-500 mt-auto">
                        Total de gastos del mes
                    </p>
                </div>

                {/* Balance Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-base text-gray-600">Balance</p>
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                            <HugeiconsIcon icon={MoneyBag02Icon} className="w-6 h-6" style={{ color: '#081534' }} />
                        </div>
                    </div>
                    <div className={`text-[26px] font-semibold mb-2 ${summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {formatCurrency(summary.balance)}
                    </div>
                    <p className="text-xs text-gray-500 mt-auto">
                        Diferencia entre ingresos y gastos
                    </p>
                </div>

                {/* Saldo Actual Card */}
                <div className="bg-white rounded-xl border border-gray-200 pt-3 pb-6 px-4 hover:border-gray-300 transition-colors flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-base text-gray-600">Saldo Actual</p>
                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                            <HugeiconsIcon icon={WalletIcon} className="w-6 h-6" style={{ color: '#081534' }} />
                        </div>
                    </div>
                    <div className="text-[26px] font-semibold text-gray-900 mb-2">
                        {formatCurrency(summary.saldoActual)}
                    </div>
                    <p className="text-xs text-gray-500 mt-auto">
                        Disponible en cuenta
                    </p>
                </div>
            </div>
        </div>
    )
}

