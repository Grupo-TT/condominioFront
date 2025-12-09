'use client'

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent
} from "@/components/ui/chart"
import { RadialBarChart, RadialBar, PolarRadiusAxis, Label, Customized } from "recharts"
import { HugeiconsIcon } from '@hugeicons/react'
import { MoneyReceiveSquareIcon } from '@hugeicons/core-free-icons'
import { HousesStatusData } from "@/data/dashboard.mock"

const chartConfig = {
    alDia: {
        label: "Al Día",
        color: "#4C6C5B",
    },
    morosas: {
        label: "Morosas",
        color: "#525252",
    },
}

// Componente para definir los patrones de líneas diagonales
const DiagonalStripePatterns = () => (
    <defs>
        {/* Patrón para Al Día - verde */}
        <pattern
            id="radialStripesGreen"
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
        {/* Patrón para Morosas - gris claro */}
        <pattern
            id="radialStripesGray"
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

interface HousesStatusChartProps {
    housesStatus: HousesStatusData
}

export function HousesStatusChart({ housesStatus }: HousesStatusChartProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 pt-4 pb-3 px-4 min-w-[280px] overflow-hidden self-start">
            <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <HugeiconsIcon icon={MoneyReceiveSquareIcon} className="w-5 h-5 text-gray-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Estado de Casas</h2>
            </div>
            <div className="bg-[#F6F6F6] rounded-xl px-2 pb-4 overflow-hidden">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto w-full max-w-[320px] h-[165px] -mt-8"
                >
                    <RadialBarChart
                        data={[{ alDia: housesStatus.alDia.count, morosas: housesStatus.morosas.count }]}
                        endAngle={180}
                        innerRadius={90}
                        outerRadius={150}
                        cy="95%"
                    >
                        <Customized component={DiagonalStripePatterns} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) - 16}
                                                    className="fill-foreground text-2xl font-bold"
                                                >
                                                    {Math.round((housesStatus.morosas.count / (housesStatus.alDia.count + housesStatus.morosas.count)) * 100)}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 4}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    Morosas
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </PolarRadiusAxis>
                        <RadialBar
                            dataKey="alDia"
                            stackId="a"
                            cornerRadius={10}
                            fill="url(#radialStripesGreen)"
                            className="stroke-[#F6F6F6] stroke-[3px]"
                        />
                        <RadialBar
                            dataKey="morosas"
                            fill="url(#radialStripesGray)"
                            stackId="a"
                            cornerRadius={10}
                            className="stroke-[#F6F6F6] stroke-[3px]"
                        />
                    </RadialBarChart>
                </ChartContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#4C6C5B]"></div>
                    <span className="text-xs text-gray-600">Al Día ({housesStatus.alDia.count})</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#525252]"></div>
                    <span className="text-xs text-gray-600">Morosas ({housesStatus.morosas.count})</span>
                </div>
            </div>
        </div>
    )
}

