'use client'

import { Card, CardContent } from '@/components/ui/card'
import { PawPrint, Users, LucideIcon } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Home09Icon, ProfileIcon } from '@hugeicons/core-free-icons'

interface MetricCard {
    icon: LucideIcon | typeof Home09Icon
    isHugeIcon: boolean
    label: string
    value: string
    bgColor: string
    iconColor: string
}

interface OwnerInfoCardProps {
    userName: string
    userEmail: string
    numeroCasa: string
    uso: string
    membersCount: number
    mascotasCount: number
}

export function OwnerInfoCard({
    userName,
    userEmail,
    numeroCasa,
    uso,
    membersCount,
    mascotasCount,
}: OwnerInfoCardProps) {
    const metricsCards: MetricCard[] = [
        {
            icon: Home09Icon,
            isHugeIcon: true,
            label: "No. de Casa",
            value: numeroCasa,
            bgColor: "bg-gray-100",
            iconColor: "text-gray-900"
        },
        {
            icon: ProfileIcon,
            isHugeIcon: true,
            label: "Tipo de Uso",
            value: uso,
            bgColor: "bg-gray-100",
            iconColor: "text-gray-900"
        },
        {
            icon: Users,
            isHugeIcon: false,
            label: "Miembros",
            value: membersCount.toString(),
            bgColor: "bg-gray-100",
            iconColor: "text-gray-900"
        },
        {
            icon: PawPrint,
            isHugeIcon: false,
            label: "Mascotas",
            value: mascotasCount.toString(),
            bgColor: "bg-gray-100",
            iconColor: "text-gray-900"
        }
    ]

    return (
        <Card
            className="relative overflow-hidden border-0 rounded-2xl py-0"
            style={{
                background: 'radial-gradient(ellipse at 20% 30%, #ffffff 0%, #fafaf5 20%, #f0f4e8 40%, #e5ede5 60%, #dce8dc 80%, #d4e2d4 100%)',
                width: '100%',
                maxWidth: '780px'
            }}
        >
            <CardContent className="p-5 relative h-full flex flex-col">
                {/* Decorative Elements */}
                <svg
                    className="absolute right-0 top-0 h-full w-1/3 opacity-30"
                    viewBox="0 0 200 200"
                    preserveAspectRatio="xMaxYMid slice"
                >
                    <defs>
                        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#4a7c59" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6b8e23" stopOpacity="0.5" />
                        </linearGradient>
                    </defs>
                    <path d="M50,180 Q80,160 100,170 T150,155 T200,140 L200,200 L50,200 Z" fill="url(#waveGrad)" />
                    <path d="M80,190 Q110,165 140,175 T190,160 T200,155 L200,200 L80,200 Z" fill="url(#waveGrad)" opacity="0.6" />
                    <circle cx="180" cy="30" r="8" fill="#4a7c59" opacity="0.5" />
                    <circle cx="155" cy="70" r="5" fill="#6b8e23" opacity="0.4" />
                </svg>

                <div className="relative z-10 flex-1 flex flex-col justify-between">
                    {/* Date Badge */}
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-gray-600 text-sm">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                                <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
                                <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
                                <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
                            </svg>
                            <span>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>

                    {/* Owner Name */}
                    <div className="mb-4">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {userName}
                        </h2>
                        <span className="text-sm text-gray-500">{userEmail}</span>
                    </div>

                    {/* Metrics Row */}
                    <div className="flex gap-3">
                        {metricsCards.map((metric, index) => {
                            const LucideIconComponent = metric.icon as LucideIcon
                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl px-5 pb-5 pt-3.5 flex-1 min-w-[140px] max-w-[170px] flex flex-col"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${metric.bgColor}`}>
                                            {metric.isHugeIcon ? (
                                                <HugeiconsIcon icon={metric.icon as typeof Home09Icon} className={`h-5 w-5 ${metric.iconColor}`} />
                                            ) : (
                                                <LucideIconComponent className={`h-5 w-5 ${metric.iconColor}`} />
                                            )}
                                        </div>
                                        <span className="text-sm text-gray-700 font-normal">
                                            {metric.label}
                                        </span>
                                    </div>
                                    <p className="text-xl font-normal text-gray-800 mt-auto pt-3">
                                        {metric.value}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
