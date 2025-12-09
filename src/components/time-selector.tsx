'use client'

import { forwardRef, useEffect, useState } from 'react'
import { Button, ButtonArrow } from '@/components/ui/button'
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

interface TimeSelectorProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value?: string
  onChange?: (value: string) => void
}

const TimeSelector = forwardRef<HTMLDivElement, TimeSelectorProps>(
  ({
    className,
    value,
    onChange,
    disabled,
    ...props
  }, ref) => {
    const [hourValue, setHourValue] = useState<string>('')
    const [periodValue, setPeriodValue] = useState<'AM' | 'PM'>('AM')
    const [hourOpen, setHourOpen] = useState(false)

    // Convert 24-hour to 12-hour components
    const convertTo12Hour = (
      time24: string,
    ): { time: string; period: 'AM' | 'PM' } => {
      if (!time24 || time24 === '') return { time: '', period: 'AM' as 'AM' | 'PM' }

      const [hours, minutes] = time24.split(':').map(Number)
      if (isNaN(hours) || isNaN(minutes)) return { time: '', period: 'AM' as 'AM' | 'PM' }

      const period = hours >= 12 ? 'PM' : 'AM'
      const hour12 = hours % 12 || 12
      const formattedTime = `${hour12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      return { time: formattedTime, period }
    }

    // Convert 12-hour components to 24-hour
    const convertTo24Hour = (time12: string, period: 'AM' | 'PM'): string => {
      if (!time12) return ''

      const match = time12.match(/^(\d{1,2}):(\d{2})$/)
      if (!match) return ''

      const hour = parseInt(match[1], 10)
      const minutes = match[2]
      let hour24 = hour

      if (period === 'AM' && hour === 12) {
        hour24 = 0
      } else if (period === 'PM' && hour !== 12) {
        hour24 += 12
      }

      return `${hour24.toString().padStart(2, '0')}:${minutes}`
    }

    // Update components when value prop changes
    useEffect(() => {
      if (value !== undefined) {
        const { time, period } = convertTo12Hour(value as string)
        setHourValue(time)
        setPeriodValue(period)
      }
    }, [value])

    // Handle hour selection
    const handleHourSelect = (time: string) => {
      setHourValue(time)
      setHourOpen(false)

      const new24Hour = convertTo24Hour(time, periodValue)
      onChange?.(new24Hour)
    }

    // Handle period selection
    const handlePeriodSelect = (period: 'AM' | 'PM') => {
      setPeriodValue(period)

      const new24Hour = hourValue ? convertTo24Hour(hourValue, period) : ''
      onChange?.(new24Hour)
    }

    // Generate hour options
    const hourOptions = Array.from({ length: 12 }, (_, i) => i + 1).flatMap((hour) => {
      const hourLabel = hour.toString().padStart(2, '0')
      return [
        {
          value: `${hourLabel}:00`,
          label: `${hourLabel}:00`,
        },
        {
          value: `${hourLabel}:30`,
          label: `${hourLabel}:30`,
        },
      ]
    })

    return (
      <div ref={ref} className={cn('flex gap-2', className)} {...props}>
        {/* Hour Combobox with custom scroll */}
        <Popover open={hourOpen} onOpenChange={setHourOpen} modal={false}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              mode="input"
              className="w-40 h-10 justify-between"
              placeholder={!hourValue}
              disabled={disabled}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className={hourValue ? 'font-medium' : 'text-muted-foreground'}>
                  {hourValue || '00:00'}
                </span>
              </div>
              <ButtonArrow />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-(--radix-popover-trigger-width) p-0"
            onWheel={(e) => e.stopPropagation()}
          >
            <Command>
              <CommandInput placeholder="Buscar hora..." />
              <CommandList>
                <ScrollArea viewportClassName="max-h-[240px]">
                  <CommandEmpty>No se encontró la hora.</CommandEmpty>
                  <CommandGroup>
                    {hourOptions.map((option) => {
                      const isSelected = option.value === hourValue
                      return (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => handleHourSelect(option.value)}
                          className="py-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span className="font-medium">{option.label}</span>
                          </div>
                          {isSelected && <CommandCheck />}
                        </CommandItem>
                      )
                    })}
                  </CommandGroup>
                  <ScrollBar />
                </ScrollArea>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* AM/PM Select */}
        <Select
          value={periodValue}
          onValueChange={(value) => handlePeriodSelect(value as 'AM' | 'PM')}
          disabled={disabled}
        >
          <SelectTrigger className="w-24 h-10">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectContent>
        </Select>
      </div>
    )
  }
)

TimeSelector.displayName = 'TimeSelector'

export { TimeSelector }
