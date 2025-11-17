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
import { Calendar } from 'lucide-react'

interface PeriodoComboboxProps {
  value: Date
  onChange: (fecha: Date) => void
  placeholder?: string
  className?: string
  buttonClassName?: string
}

export function PeriodoCombobox({
  value,
  onChange,
  placeholder = 'Selecciona un período',
  className,
  buttonClassName,
}: PeriodoComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Formatear el período para mostrar
  const periodoTexto = value.toLocaleDateString('es-CO', {
    month: 'long',
    year: 'numeric',
  })
  const periodoTextoCapitalizado = periodoTexto.charAt(0).toUpperCase() + periodoTexto.slice(1)

  const añoSeleccionado = value.getFullYear()

  // Generar lista de meses para el selector
  const mesesDisponibles = React.useMemo(() => {
    const meses: { value: string; label: string; fecha: Date }[] = []
    const añoActual = añoSeleccionado
    
    // Generar meses del año seleccionado
    for (let mes = 0; mes < 12; mes++) {
      const fecha = new Date(añoActual, mes, 1)
      const nombreMes = fecha.toLocaleDateString('es-CO', { month: 'long' })
      const nombreMesCapitalizado = nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)
      meses.push({
        value: `${añoActual}-${mes}`,
        label: `${nombreMesCapitalizado} ${añoActual}`,
        fecha,
      })
    }
    
    return meses
  }, [añoSeleccionado])

  // Verificar si un mes está seleccionado
  const mesSeleccionado = mesesDisponibles.find(
    (mes) =>
      mes.fecha.getMonth() === value.getMonth() &&
      mes.fecha.getFullYear() === value.getFullYear()
  )

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value}
          aria-expanded={open}
          className={buttonClassName || 'min-w-[180px] h-9 justify-between'}
        >
          {mesSeleccionado ? (
            <div className="flex items-center gap-2 text-left w-full pr-8">
              <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
              <span className="font-medium text-gray-900">
                {periodoTextoCapitalizado}
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
          <CommandInput placeholder="Buscar mes..." />
          <CommandList>
            <ScrollArea viewportClassName="max-h-[300px]">
              <CommandEmpty>No se encontró el mes.</CommandEmpty>
              <CommandGroup>
                {mesesDisponibles.map((mes) => {
                  const isSelected =
                    value.getMonth() === mes.fecha.getMonth() &&
                    value.getFullYear() === mes.fecha.getFullYear()
                  
                  return (
                    <CommandItem
                      key={mes.value}
                      value={mes.label}
                      onSelect={() => {
                        onChange(mes.fecha)
                        setOpen(false)
                      }}
                      className="py-3"
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0 pr-8">
                        <Calendar className="h-4 w-4 text-gray-500 shrink-0" />
                        <span className="font-medium text-gray-900">
                          {mes.label}
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

