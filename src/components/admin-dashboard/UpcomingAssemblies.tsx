'use client'

import { ScrollArea } from "@/components/ui/scroll-area"
import { HugeiconsIcon } from '@hugeicons/react'
import { Book02Icon } from '@hugeicons/core-free-icons'

interface Assembly {
    id: string
    title: string
    date: string
    time: string
    location: string
    bgColor: string
    hoverColor: string
    iconColor: string
}

const assemblies: Assembly[] = [
    {
        id: '1',
        title: 'Asamblea General Ordinaria',
        date: '15 Dic',
        time: '6:00 PM',
        location: 'Salón Comunal',
        bgColor: '#A4C8AE',
        hoverColor: '#94b89e',
        iconColor: '#5a7a56',
    },
    {
        id: '2',
        title: 'Reunión de Comité',
        date: '22 Dic',
        time: '4:00 PM',
        location: 'Sala de Juntas',
        bgColor: '#e8ddc5',
        hoverColor: '#ddd0b5',
        iconColor: '#9a8a6a',
    },
    {
        id: '3',
        title: 'Asamblea Extraordinaria',
        date: '10 Ene',
        time: '7:00 PM',
        location: 'Salón Comunal',
        bgColor: '#c5c8e0',
        hoverColor: '#b5b8d0',
        iconColor: '#6a6d8a',
    },
]

export function UpcomingAssemblies() {
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
