'use client'

import * as React from 'react'
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
import { Clock, Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HoraOption {
  value: string
  label: string
  hora24: number
}

interface HoraComboboxProps {
  horas: HoraOption[]
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
  disabled?: boolean
  horasOcupadas?: Set<string>
  label?: string
}

export function HoraCombobox({
  horas,
  value,
  onChange,
  placeholder = 'Selecciona hora',
  className,
  buttonClassName,
  disabled = false,
  horasOcupadas = new Set(),
  label,
}: HoraComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const horaSeleccionada = value
    ? horas.find((h) => h.value === value)
    : null

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs text-gray-600">{label}</label>
      )}
      <Popover open={open} onOpenChange={setOpen} modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            mode="input"
            placeholder={!value}
            aria-expanded={open}
            disabled={disabled}
            className={buttonClassName || 'w-full justify-between h-10'}
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              {horaSeleccionada ? (
                <span className="font-medium">{horaSeleccionada.label}</span>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ButtonArrow />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={`w-[var(--radix-popover-trigger-width)] p-0 ${className || ''}`}
          onWheel={(e) => e.stopPropagation()}
        >
          <Command shouldFilter={false}>
            <CommandInput placeholder="Buscar hora..." />
            <CommandList>
              <ScrollArea viewportClassName="max-h-[300px]">
                <CommandEmpty>No se encontró la hora.</CommandEmpty>
                <CommandGroup>
                  {horas.map((hora) => {
                    const estaOcupada = horasOcupadas.has(hora.value)
                    const isSelected = value === hora.value
                    return (
                      <CommandItem
                        key={hora.value}
                        value={hora.value}
                        onSelect={() => {
                          if (!estaOcupada) {
                            const newValue = hora.value === value ? '' : hora.value
                            onChange(newValue)
                            setOpen(false)
                          }
                        }}
                        disabled={estaOcupada}
                        className={cn(
                          "flex flex-col items-start py-3",
                          estaOcupada && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <div className="flex items-center gap-2 w-full">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{hora.label}</span>
                          {isSelected && !estaOcupada && (
                            <Check className="ml-auto h-4 w-4" />
                          )}
                        </div>
                        <span className={cn(
                          "text-xs mt-1 ml-6",
                          estaOcupada ? "text-red-500 font-medium" : "text-green-600"
                        )}>
                          {estaOcupada ? "Ocupado" : "Disponible"}
                        </span>
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
    </div>
  )
}

