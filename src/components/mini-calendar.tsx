'use client'

import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { 
  format, 
  addMonths, 
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  getDay,
  setYear
} from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface MiniCalendarProps {
  selectedDate: Date
  selectedMonth: Date
  onDateSelect: (date: Date) => void
  onMonthChange: (month: Date) => void
  daysWithEvents?: string[] // Ahora son strings en formato 'yyyy-MM-dd'
  reservasCount?: number
}

const WEEKDAYS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do']

// Generar años para el selector (desde 2025 hasta el siguiente año)
const generateYears = (currentYear: number) => {
  const years = []
  const startYear = 2025
  const endYear = currentYear + 1
  for (let i = startYear; i <= endYear; i++) {
    years.push(i)
  }
  return years
}

export function MiniCalendar({
  selectedDate,
  selectedMonth,
  onDateSelect,
  onMonthChange,
  daysWithEvents = [],
  reservasCount = 0
}: MiniCalendarProps) {
  const currentYear = selectedMonth.getFullYear()
  const years = useMemo(() => generateYears(new Date().getFullYear()), [])

  // Generar días del calendario
  const calendarDays = useMemo(() => {
    const start = startOfMonth(selectedMonth)
    const end = endOfMonth(selectedMonth)
    const days = eachDayOfInterval({ start, end })
    
    // Obtener el día de la semana del primer día (0 = domingo, 1 = lunes, etc.)
    let startDay = getDay(start)
    // Ajustar para que la semana empiece en lunes (0 = lunes)
    startDay = startDay === 0 ? 6 : startDay - 1
    
    // Añadir días vacíos al principio
    const paddingDays = Array(startDay).fill(null)
    
    return [...paddingDays, ...days]
  }, [selectedMonth])

  // Verificar si un día tiene eventos - usando string comparison
  const hasEvent = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd')
    return daysWithEvents.includes(dateKey)
  }

  const monthName = format(selectedMonth, 'MMMM', { locale: es })

  const handleYearChange = (year: number) => {
    const newDate = setYear(selectedMonth, year)
    onMonthChange(newDate)
  }

  return (
    <div className="flex flex-col">
      {/* Header del calendario - alineado con el selector de meses */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-1">
          <button
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            onClick={() => onMonthChange(subMonths(selectedMonth, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="text-base font-semibold text-gray-900 capitalize min-w-[100px] text-center">
            {monthName}
          </span>
          
          <button
            className="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            onClick={() => onMonthChange(addMonths(selectedMonth, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Selector de año */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1.5 h-9 px-4 rounded-full text-sm font-medium"
            >
              {currentYear}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-[300px] overflow-y-auto">
            {years.map((year) => (
              <DropdownMenuItem 
                key={year}
                onClick={() => handleYearChange(year)}
                className={cn(
                  "text-sm",
                  year === currentYear && "bg-gray-100 font-semibold"
                )}
              >
                {year}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Contenido del calendario */}
      <div className="p-4">
        {/* Grid del calendario */}
        <div className="grid grid-cols-7 gap-1">
          {/* Días de la semana */}
          {WEEKDAYS.map((day) => (
            <div 
              key={day} 
              className="flex items-center justify-center h-6 text-xs font-medium text-gray-400"
            >
              {day}
            </div>
          ))}

          {/* Días del mes */}
          {calendarDays.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />
            }

            const isToday = isSameDay(day, new Date())
            const isSelected = isSameDay(day, selectedDate)
            const isCurrentMonth = isSameMonth(day, selectedMonth)
            const dayHasEvent = hasEvent(day)

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "relative flex flex-col items-center justify-center aspect-square w-full rounded-lg text-sm transition-all",
                  "hover:bg-gray-100",
                  isSelected && "bg-gray-900 text-white hover:bg-gray-800",
                  isToday && !isSelected && "bg-gray-100 font-semibold",
                  !isCurrentMonth && "text-gray-300"
                )}
              >
                {format(day, 'd')}
                
                {/* Indicador de evento */}
                {dayHasEvent && !isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-emerald-700" />
                )}
                {dayHasEvent && isSelected && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                )}
              </button>
            )
          })}
        </div>

        </div>
    </div>
  )
}
