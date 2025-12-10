'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from '@hugeicons/react'
import { Book02Icon } from '@hugeicons/core-free-icons'
import { useEffect, useState } from "react"
import { adminDashboardService } from "@/services/adminDashboard.service"

interface AssemblyCard {
    id: string
    title: string
    date: string
    time: string
    location: string
    bgColor: string
    hoverColor: string
    iconColor: string
}

export function UpcomingAssemblies() {

    const [assemblies, setAssemblies] = useState<AssemblyCard[]>([])

    useEffect(() => {
        const load = async () => {
            const nextThree = await adminDashboardService.getAsambleas()

            const mapped: AssemblyCard[] = nextThree.map((a, index) => {
                const fecha = new Date(a.fecha)
                const formattedDate = fecha.toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                }).replace(".", "")

                const colors = [
                    { bg: "#A4C8AE", hover: "#94b89e", icon: "#5a7a56" },
                    { bg: "#e8ddc5", hover: "#ddd0b5", icon: "#9a8a6a" },
                    { bg: "#c5c8e0", hover: "#b5b8d0", icon: "#6a6d8a" },
                ]

                return {
                    id: a.id,
                    title: a.titulo,
                    date: formattedDate,
                    time: a.horaInicio.slice(0,5),
                    location: a.lugar,
                    bgColor: colors[index]?.bg || "#e2e2e2",
                    hoverColor: colors[index]?.hover || "#d5d5d5",
                    iconColor: colors[index]?.icon || "#666",
                }
            })

            setAssemblies(mapped)
        }

        load()
    }, [])
    
    return (
        <div className="flex flex-col gap-4 max-h-[340px]">
            <h2 className="text-lg font-semibold text-gray-900">Próximas Asambleas</h2>
            <ScrollArea viewportClassName="max-h-[280px]">
                <div className="flex flex-col gap-3 pr-2">
                    {assemblies.map((assembly) => (
                        <div
                            key={assembly.id}
                            className="rounded-2xl p-4 transition-colors cursor-pointer flex-shrink-0"
                            style={{
                                backgroundColor: assembly.bgColor,
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = assembly.hoverColor}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = assembly.bgColor}
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0">
                                    <HugeiconsIcon icon={Book02Icon} className="w-5 h-5" style={{ color: assembly.iconColor }} />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900 truncate">{assembly.title}</h3>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-700 bg-white/70 rounded-lg px-3 py-2">
                                <span>{assembly.date}</span>
                                <span className="text-gray-400">|</span>
                                <span>{assembly.time}</span>
                                <span className="text-gray-400">|</span>
                                <span className="truncate">{assembly.location}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
