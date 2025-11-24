'use client'

import { useState, useEffect } from 'react'
import { Dog, Cat, PawPrint, Minus, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface AgregarMascotaSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tipoMascota?: 'perro' | 'gato' | 'otro' | null
  cantidadInicial?: number
  onSave?: (cantidad: number) => void
}

const tiposMascota = [
  { value: 'perro', label: 'Perro', icon: Dog, color: '#A39170', bgColor: '#F1E8D6' },
  { value: 'gato', label: 'Gato', icon: Cat, color: '#595D75', bgColor: '#E3E4EA' },
  { value: 'otro', label: 'Otro', icon: PawPrint, color: '#4C6C5A', bgColor: '#E6EFEA' },
]

export function AgregarMascotaSheet({ 
  open, 
  onOpenChange, 
  tipoMascota: tipoMascotaProp, 
  cantidadInicial,
  onSave 
}: AgregarMascotaSheetProps) {
  const [tipoMascota, setTipoMascota] = useState(tipoMascotaProp || '')
  const [cantidad, setCantidad] = useState(cantidadInicial || 1)
  const [tipoComboboxOpen, setTipoComboboxOpen] = useState(false)
  const [tipoSearchTerm, setTipoSearchTerm] = useState('')

  const isEditMode = !!tipoMascotaProp

  // Filtrar tipos de mascota según el término de búsqueda
  const tiposFiltrados = tiposMascota.filter(tipo =>
    tipo.label.toLowerCase().includes(tipoSearchTerm.toLowerCase())
  )

  // Cargar datos cuando se abre en modo edición
  useEffect(() => {
    if (open && tipoMascotaProp) {
      setTipoMascota(tipoMascotaProp)
      setCantidad(cantidadInicial || 1)
    }
  }, [open, tipoMascotaProp, cantidadInicial])

  // Resetear formulario cuando se cierra el sheet
  useEffect(() => {
    if (!open) {
      if (!isEditMode) {
        setTipoMascota('')
        setCantidad(1)
      }
      setTipoSearchTerm('')
    }
  }, [open, isEditMode])

  const handleSubmit = () => {
    if (!tipoMascota) {
      return
    }

    if (onSave) {
      onSave(cantidad)
    } else {
      // TODO: Aquí se agregaría la lógica para guardar la mascota
      console.log('Agregar mascota:', { tipo: tipoMascota, cantidad })
    }
    
    // Cerrar el sheet después de guardar
    onOpenChange(false)
  }

  const tipoSeleccionado = tiposMascota.find(t => t.value === tipoMascota)
  const IconComponent = tipoSeleccionado?.icon || PawPrint

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Modificar Mascota' : 'Agregar Mascota'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Modifica la cantidad de mascotas de este tipo en tu hogar.'
              : 'Registra una nueva mascota en tu hogar. Selecciona el tipo y la cantidad.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Tipo de mascota */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tipo de mascota <span className="text-red-500">*</span>
            </label>
            <Popover open={tipoComboboxOpen} onOpenChange={setTipoComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  mode="input"
                  className="w-full justify-between h-11 bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
                  disabled={isEditMode}
                >
                  {tipoSeleccionado ? (
                    <span className="flex items-center gap-2.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: tipoSeleccionado.bgColor }}
                      >
                        <IconComponent className="w-4 h-4" style={{ color: tipoSeleccionado.color }} />
                      </div>
                      <span className="truncate">{tipoSeleccionado.label}</span>
                    </span>
                  ) : (
                    <span className="text-gray-500">Selecciona el tipo de mascota</span>
                  )}
                  {!isEditMode && <ButtonArrow />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Buscar tipo..."
                    value={tipoSearchTerm}
                    onValueChange={setTipoSearchTerm}
                  />
                  <CommandList>
                    <ScrollArea className="h-[140px]">
                      <CommandEmpty>No se encontró tipo de mascota.</CommandEmpty>
                      <CommandGroup>
                        {tiposFiltrados.map((tipo) => {
                          const Icon = tipo.icon
                          return (
                            <CommandItem
                              key={tipo.value}
                              value={tipo.value}
                              onSelect={() => {
                                setTipoMascota(tipo.value)
                                setTipoComboboxOpen(false)
                                setTipoSearchTerm('')
                              }}
                            >
                              <span className="flex items-center gap-2.5">
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center"
                                  style={{ backgroundColor: tipo.bgColor }}
                                >
                                  <Icon className="w-4 h-4" style={{ color: tipo.color }} />
                                </div>
                                <span className="truncate">{tipo.label}</span>
                              </span>
                              {tipoMascota === tipo.value && <CommandCheck />}
                            </CommandItem>
                          )
                        })}
                      </CommandGroup>
                      <ScrollBar orientation="vertical" />
                    </ScrollArea>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Cantidad */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cantidad <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center">
                  <PawPrint className="w-5 h-5 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">Cantidad</span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                  disabled={cantidad <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-base font-semibold text-gray-900 min-w-[2rem] text-center">
                  {cantidad}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full"
                  onClick={() => setCantidad(prev => prev + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!tipoMascota}>
            {isEditMode ? 'Guardar Cambios' : 'Agregar Mascota'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

