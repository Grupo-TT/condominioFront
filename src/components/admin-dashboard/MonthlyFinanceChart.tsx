'use client'

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Customized } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon } from '@hugeicons/core-free-icons'
import { MonthlyData } from "@/data/dashboard.mock"

const chartConfig = {
    entradas: {
        label: "Entradas",
        color: "#4C6C5B",
    },
    salidas: {
        label: "Salidas",
        color: "#525252",
    },
}

// Componente para definir los patrones de líneas diagonales
const DiagonalStripePatterns = () => (
    <defs>
        {/* Patrón para entradas - verde */}
        <pattern
            id="diagonalStripesGreen"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
        >
            <rect width="8" height="8" fill="#4C6C5B" />
            <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="3"
            />
        </pattern>
        {/* Patrón para salidas - gris claro */}
        <pattern
            id="diagonalStripesGray"
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
        >
            <rect width="8" height="8" fill="#525252" />
            <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="rgba(255,255,255,0.35)"
                strokeWidth="3"
            />
        </pattern>
    </defs>
)

interface MonthlyFinanceChartProps {
    selectedYear: number
    onYearChange: (year: number) => void
    monthlyData: MonthlyData[]
}

export function MonthlyFinanceChart({
    selectedYear,
    onYearChange,
    monthlyData
}: MonthlyFinanceChartProps) {
    return (
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 pt-5 pb-4 px-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Entradas y Salidas Mensuales
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Resumen financiero del año
                    </p>
                </div>
                <Select value={selectedYear.toString()} onValueChange={(value) => onYearChange(Number(value))}>
                    <SelectTrigger className="relative w-32 pl-9">
                        <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3">
                            <HugeiconsIcon icon={Calendar03Icon} className="w-4 h-4" aria-hidden="true" />
                        </div>
                        <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value={new Date().getFullYear().toString()}>
                            {new Date().getFullYear()}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="bg-[#F6F6F6] rounded-xl p-4">
                <ChartContainer config={chartConfig} className="h-[280px] w-full">
                    <BarChart data={monthlyData} margin={{ top: 15, right: 20, left: -15, bottom: 5 }}>
                        <Customized component={DiagonalStripePatterns} />
                        <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#d1d5db" />
                        <XAxis
                            dataKey="mes"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickMargin={6}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#6b7280', fontSize: 12 }}
                            tickMargin={10}
                            tickFormatter={(value) => {
                                if (value >= 1000000) {
                                    return `${(value / 1000000).toFixed(0)}M`
                                }
                                return value.toString()
                            }}
                        />
                        <ChartTooltip
                            content={<ChartTooltipContent />}
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                        />
                        <Bar
                            dataKey="entradas"
                            fill="url(#diagonalStripesGreen)"
                            radius={8}
                            maxBarSize={50}
                        />
                        <Bar
                            dataKey="salidas"
                            fill="url(#diagonalStripesGray)"
                            radius={8}
                            maxBarSize={50}
                        />
                    </BarChart>
                </ChartContainer>
            </div>
        </div>
    )
}
