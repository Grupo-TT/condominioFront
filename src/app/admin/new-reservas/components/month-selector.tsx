'use client'

import { ChevronLeft, ChevronRight, X, Building2, Package, Layers, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { FilterHorizontalIcon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import { 
  addMonths, 
  subMonths, 
  format, 
  isSameMonth,
  startOfYear,
  eachMonthOfInterval,
  endOfYear
} from 'date-fns'
import { es } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import { useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { TipoRecursoFilter, EstadoFilter } from '../page'

interface MonthSelectorProps {
  selectedMonth: Date
  onMonthChange: (month: Date) => void
  tipoRecursoFilter: TipoRecursoFilter
  estadoFilter: EstadoFilter
  onTipoRecursoChange: (value: TipoRecursoFilter) => void
  onEstadoChange: (value: EstadoFilter) => void
  activeFiltersCount?: number
  onClearFilters?: () => void
  reservasCount?: number
}

const tipoRecursoOptions: { value: TipoRecursoFilter; label: string; icon: typeof Building2 }[] = [
  { value: 'todos', label: 'Todos los tipos', icon: Layers },
  { value: 'Zona', label: 'Solo Zonas', icon: Building2 },
  { value: 'Objeto', label: 'Solo Objetos', icon: Package },
]

const estadoOptions: { value: EstadoFilter; label: string; icon: typeof CheckCircle2; color: string }[] = [
  { value: 'todos', label: 'Todos los estados', icon: Layers, color: 'text-gray-600' },
  { value: 'aprobada', label: 'Confirmadas', icon: CheckCircle2, color: 'text-emerald-600' },
  { value: 'pendiente', label: 'Pendientes', icon: Clock, color: 'text-amber-600' },
  { value: 'rechazada', label: 'Rechazadas', icon: XCircle, color: 'text-red-600' },
]

export function MonthSelector({ 
  selectedMonth, 
  onMonthChange,
  tipoRecursoFilter,
  estadoFilter,
  onTipoRecursoChange,
  onEstadoChange,
  activeFiltersCount = 0,
  onClearFilters,
  reservasCount = 0
}: MonthSelectorProps) {
  // Generar meses del año actual
  const months = useMemo(() => {
    const year = selectedMonth.getFullYear()
    const start = startOfYear(new Date(year, 0, 1))
    const end = endOfYear(new Date(year, 0, 1))
    return eachMonthOfInterval({ start, end })
  }, [selectedMonth])

  // Obtener labels actuales
  const currentTipoLabel = tipoRecursoOptions.find(o => o.value === tipoRecursoFilter)?.label || 'Tipo'
  const currentEstadoLabel = estadoOptions.find(o => o.value === estadoFilter)?.label || 'Estado'

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
      {/* Botón anterior */}
      <button
        className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shrink-0"
        onClick={() => onMonthChange(subMonths(selectedMonth, 1))}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Meses distribuidos en todo el ancho */}
      <div className="flex-1 flex items-center justify-between">
        {months.map((month) => {
          const isSelected = isSameMonth(month, selectedMonth)
          const monthName = format(month, 'MMM', { locale: es })
          
          return (
            <Button
              key={month.toISOString()}
              data-selected={isSelected}
              variant={isSelected ? "default" : "ghost"}
              size="sm"
              className={cn(
                "px-6 py-1 h-7 rounded-full capitalize font-medium text-sm transition-all",
                isSelected 
                  ? "bg-gray-900 text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
              onClick={() => onMonthChange(month)}
            >
              {monthName}
              {isSelected && reservasCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-medium rounded bg-white text-gray-900">
                  {reservasCount}
                </span>
              )}
            </Button>
          )
        })}
      </div>

      {/* Botón siguiente */}
      <button
        className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors shrink-0"
        onClick={() => onMonthChange(addMonths(selectedMonth, 1))}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* Separador */}
      <div className="w-px h-6 bg-gray-200 mx-1" />

      {/* Botón de filtrar - Dropdown */}
      <div className="shrink-0 relative">
        {activeFiltersCount > 0 && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  onClearFilters?.()
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center h-6 w-6 rounded-full bg-white hover:bg-gray-100 text-gray-700 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Limpiar filtros</p>
            </TooltipContent>
          </Tooltip>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className={cn(
                "inline-flex items-center gap-2 rounded-full h-9 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400",
                activeFiltersCount > 0 
                  ? "bg-gray-900 text-white hover:bg-gray-800 pl-10 pr-3" 
                  : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 px-4"
              )}
            >
              {activeFiltersCount === 0 && (
                <HugeiconsIcon icon={FilterHorizontalIcon} size={16} className="shrink-0" />
              )}
              <span className="whitespace-nowrap">Filtrar</span>
              {activeFiltersCount > 0 && (
                <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full text-[10px] font-medium bg-white text-gray-900 shrink-0">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* Filtro por tipo */}
          <DropdownMenuLabel className="text-xs text-gray-500">Tipo de recurso</DropdownMenuLabel>
          {tipoRecursoOptions.map((option) => {
            const Icon = option.icon
            const isActive = tipoRecursoFilter === option.value
            return (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => onTipoRecursoChange(option.value)}
                className={cn(isActive && "bg-gray-100")}
              >
                <Icon className="h-4 w-4 mr-2" />
                {option.label}
                {isActive && <CheckCircle2 className="h-4 w-4 ml-auto text-emerald-600" />}
              </DropdownMenuItem>
            )
          })}
          
          <DropdownMenuSeparator />
          
          {/* Filtro por estado */}
          <DropdownMenuLabel className="text-xs text-gray-500">Estado</DropdownMenuLabel>
          {estadoOptions.map((option) => {
            const Icon = option.icon
            const isActive = estadoFilter === option.value
            return (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => onEstadoChange(option.value)}
                className={cn(isActive && "bg-gray-100")}
              >
                <Icon className={cn("h-4 w-4 mr-2", option.color)} />
                {option.label}
                {isActive && <CheckCircle2 className="h-4 w-4 ml-auto text-emerald-600" />}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      </div>
    </div>
  )
}
