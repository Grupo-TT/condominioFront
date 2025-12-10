'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { User03Icon, LinkSquare01Icon } from '@hugeicons/core-free-icons'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

interface Member {
    id: number
    nombre: string
    parentesco: string
    avatar: string
}

interface MembersCardProps {
    members: Member[]
    loading?: boolean
}

const getColorFromParentesco = (parentesco: string): { bg: string; text: string } => {
    const tipo = parentesco.toUpperCase()

    // Tipos femeninos -> Rosa/Pink
    if (
        tipo.includes("HIJA") || tipo.includes("ESPOSA") || tipo.includes("MADRE") ||
        tipo.includes("HERMANA") || tipo.includes("ABUELA") || tipo.includes("TIA") ||
        tipo.includes("SOBRINA") || tipo.includes("NIETA")
    ) {
        return { bg: "bg-pink-100", text: "text-pink-600" }
    }

    // Tipos masculinos -> Azul/Blue
    if (
        tipo.includes("HIJO") || tipo.includes("ESPOSO") || tipo.includes("PADRE") ||
        tipo.includes("HERMANO") || tipo.includes("ABUELO") || tipo.includes("TIO") ||
        tipo.includes("SOBRINO") || tipo.includes("NIETO")
    ) {
        return { bg: "bg-blue-100", text: "text-blue-600" }
    }

    // Neutro -> Gris/Gray
    return { bg: "bg-gray-100", text: "text-gray-600" }
}

export function MembersCard({ members, loading = false }: MembersCardProps) {
    if (loading) {
        return (
            <Card className="border-0 rounded-2xl py-0 h-full" style={{ maxWidth: '600px', backgroundColor: '#F6F6F6' }}>
                <CardContent className="p-5 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-11 h-11 rounded-xl" />
                            <div>
                                <Skeleton className="h-5 w-40 mb-1" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-14 w-full rounded-xl" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="border-0 rounded-2xl py-0 h-full" style={{ maxWidth: '600px', backgroundColor: '#F6F6F6' }}>
            <CardContent className="p-5 h-full flex flex-col">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white border border-gray-200">
                            <Users className="h-5 w-5 text-gray-500" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">Miembros de la vivienda</h3>
                            <p className="text-sm text-gray-500">Personas registradas que habitan en esta propiedad</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Link href="/mi-casa/miembros-hogar" className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600">
                                        <HugeiconsIcon icon={LinkSquare01Icon} className="h-4 w-4" />
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Ver más</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>

                {/* Members List */}
                <div className="flex-1 overflow-y-auto max-h-[320px]">
                    {members.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center h-full">
                            <Users className="h-10 w-10 text-gray-300 mb-2" />
                            <p className="text-sm text-gray-500">No hay miembros registrados</p>
                            <Link href="/mi-casa/miembros-hogar" className="text-sm text-primary hover:underline mt-2">
                                Agregar miembro
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {members.map((member) => (
                                <div
                                    key={member.id}
                                    className="flex items-center px-4 py-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        {(() => {
                                            const colors = getColorFromParentesco(member.parentesco)
                                            return (
                                                <div className={`w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center`}>
                                                    <HugeiconsIcon icon={User03Icon} className={`h-5 w-5 ${colors.text}`} />
                                                </div>
                                            )
                                        })()}
                                        <span className="font-medium text-gray-800">{member.nombre}</span>
                                    </div>
                                    <div className="w-32 text-center">
                                        <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200">
                                            {member.parentesco}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
