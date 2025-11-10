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
import { Obligacion } from '@/types/cuotas.types'

interface ObligacionComboboxProps {
  obligaciones: Obligacion[]
  value?: string
  onChange: (value: string) => void
  onObligacionSelect?: (obligacion: Obligacion) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
}

export function ObligacionCombobox({
  obligaciones,
  value,
  onChange,
  onObligacionSelect,
  placeholder = 'Selecciona una obligación pendiente',
  className,
  buttonClassName,
}: ObligacionComboboxProps) {
  const [open, setOpen] = React.useState(false)

  const obligacionSeleccionada = value
    ? obligaciones.find((o) => String(o.id) === String(value))
    : null

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          className={buttonClassName || 'w-full h-16 justify-between'}
        >
          {obligacionSeleccionada ? (
            <div className="flex flex-col items-start text-left w-full pr-8">
              <span className="font-medium text-gray-900 leading-tight">
                {obligacionSeleccionada.motivo}
              </span>
              <span className="text-sm text-gray-500 mt-1">
                {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                }).format(obligacionSeleccionada.valorPendiente)}
              </span>
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ButtonArrow />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={`w-[var(--radix-popover-trigger-width)] p-0 ${className || ''}`}
        onWheel={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput placeholder="Buscar obligación..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px]">
              <CommandEmpty>No se encontró la obligación.</CommandEmpty>
              <CommandGroup>
                {obligaciones.map((obligacion) => {
                  const isSelected = String(value) === String(obligacion.id)
                  return (
                    <CommandItem
                      key={obligacion.id}
                      value={`${obligacion.motivo} ${new Intl.NumberFormat('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                      }).format(obligacion.valorPendiente)}`}
                      onSelect={(currentValue) => {
                        const obligacionId = String(obligacion.id)
                        const newValue = obligacionId === String(value) ? '' : obligacionId
                        onChange(newValue)
                        if (newValue && onObligacionSelect) {
                          onObligacionSelect(obligacion)
                        }
                        setOpen(false)
                      }}
                      className="py-3.5"
                    >
                      <div className="flex flex-col items-start flex-1 min-w-0 pr-8">
                        <span className="font-medium text-gray-900 truncate">
                          {obligacion.motivo}
                        </span>
                        <span className="text-sm text-gray-500 mt-1">
                          {new Intl.NumberFormat('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                          }).format(obligacion.valorPendiente)}
                        </span>
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
  )
}

