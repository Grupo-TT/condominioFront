'use client'

import { useState } from 'react'
import { CalendarIcon, ChevronDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

interface DatePickerProps {
  id?: string
  value?: Date
  onSelect: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  minDate?: Date
  maxDate?: Date
}

export function DatePicker({ 
  id, 
  value, 
  onSelect, 
  placeholder = 'Selecciona una fecha', 
  className,
  minDate,
  maxDate
}: DatePickerProps) {
  const [open, setOpen] = useState(false)

  const handleSelect = (date: Date | undefined) => {
    onSelect(date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant='outline' 
          id={id} 
          className={cn('w-full justify-between font-normal h-9 px-3', className)}
        >
          <span className='flex items-center min-w-0 flex-1 overflow-hidden'>
            <CalendarIcon className='mr-2 h-4 w-4 flex-shrink-0' />
            <span className='truncate'>
              {value ? value.toLocaleDateString('es-CO', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : placeholder}
            </span>
          </span>
          <ChevronDownIcon className='h-4 w-4 flex-shrink-0 ml-2' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={handleSelect}
          disabled={(date) => {
            if (minDate && date < minDate) return true
            if (maxDate && date > maxDate) return true
            return false
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

