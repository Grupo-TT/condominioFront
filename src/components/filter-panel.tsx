'use client'

import { cn } from '@/lib/utils'
import { Building2, Package, CheckCircle2, Clock, XCircle, Layers } from 'lucide-react'
import type { TipoRecursoFilter, EstadoFilter } from '@/hooks/useReservasFilters'

interface FilterPanelProps {
  tipoRecursoFilter: TipoRecursoFilter
  estadoFilter: EstadoFilter
  onTipoRecursoChange: (value: TipoRecursoFilter) => void
  onEstadoChange: (value: EstadoFilter) => void
  totalReservas: number
  filteredReservas: number
}

const tipoRecursoOptions: { value: TipoRecursoFilter; label: string; icon: typeof Building2 }[] = [
  { value: 'todos', label: 'Todos', icon: Layers },
  { value: 'Zona', label: 'Zonas', icon: Building2 },
  { value: 'Objeto', label: 'Objetos', icon: Package },
]

const estadoOptions: { value: EstadoFilter; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: 'todos', label: 'Todos', icon: Layers, color: 'text-gray-600' },
  { value: 'aprobada', label: 'Confirmadas', icon: CheckCircle2, color: 'text-emerald-600' },
  { value: 'pendiente', label: 'Pendientes', icon: Clock, color: 'text-amber-600' },
  { value: 'rechazada', label: 'Rechazadas', icon: XCircle, color: 'text-red-600' },
]

export function FilterPanel({
  tipoRecursoFilter,
  estadoFilter,
  onTipoRecursoChange,
  onEstadoChange,
  totalReservas,
  filteredReservas,
}: FilterPanelProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <div className="flex flex-wrap items-center gap-6">
        {/* Filtro por tipo de recurso */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Tipo:</span>
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200">
            {tipoRecursoOptions.map((option) => {
              const Icon = option.icon
              const isActive = tipoRecursoFilter === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => onTipoRecursoChange(option.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-gray-900 text-white" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Filtro por estado */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Estado:</span>
          <div className="flex items-center gap-1 p-1 bg-white rounded-xl border border-gray-200">
            {estadoOptions.map((option) => {
              const Icon = option.icon
              const isActive = estadoFilter === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => onEstadoChange(option.value)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                    isActive 
                      ? "bg-gray-900 text-white" 
                      : cn("hover:bg-gray-100", option.color)
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="ml-auto text-sm text-gray-500">
          Mostrando <span className="font-semibold text-gray-900">{filteredReservas}</span> de{' '}
          <span className="font-semibold text-gray-900">{totalReservas}</span> reservas
        </div>
      </div>
    </div>
  )
}

