'use client'

import { HouseTypesData } from "@/data/dashboard.mock"

interface PropertyOverviewCardProps {
    houseTypes: HouseTypesData
}

export function PropertyOverviewCard({ houseTypes }: PropertyOverviewCardProps) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex-1">
            <div className="grid grid-cols-[auto_1fr] gap-6 h-full">
                <div className="bg-[#F6F6F6] rounded-xl p-4 flex flex-col items-center justify-center text-center h-full">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-6xl font-medium">{houseTypes.total}</span>
                    <span className="text-sm text-gray-500">Total de propiedades<br />en el condominio</span>
                </div>
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <span className="text-xl font-semibold">Uso de las propiedades</span>
                        <span className="text-base text-gray-500 block mt-1">
                            Desglose del uso actual de las propiedades: arrendadas a terceros o residenciales ocupadas por propietarios.
                        </span>
                    </div>
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-base text-gray-600">Arrendadas</span>
                                <span className="text-2xl font-bold">{houseTypes.arrendadas.count}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-base text-gray-600">Residenciales</span>
                                <span className="text-2xl font-bold">{houseTypes.residenciales.count}</span>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {Array.from({ length: 24 }, (_, index) => {
                                const filledBars = Math.round((houseTypes.arrendadas.percentage * 24) / 100)
                                return (
                                    <div
                                        key={index}
                                        className={`h-7 flex-1 rounded-full ${index < filledBars ? 'bg-gray-800' : 'bg-gray-200'}`}
                                    />
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
