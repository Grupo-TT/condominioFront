'use client'

import { useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Button, ButtonArrow } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { cn } from '@/lib/utils'

interface EstadoFilterOption {
  value: string
  label: string
  color: string
}

interface FiltersBarProps {
  // Search props
  searchTerm: string
  onSearchChange: (value: string) => void
  searchPlaceholder?: string
  
  // Estado filter props (opcional)
  showEstadoFilter?: boolean
  estadoFilter?: 'todas' | 'abonado' | 'pendiente'
  onEstadoFilterChange?: (value: 'todas' | 'abonado' | 'pendiente') => void
  estadoFilterOptions?: EstadoFilterOption[]
  estadoComboboxOpen?: boolean
  onEstadoComboboxOpenChange?: (open: boolean) => void
}

const defaultEstadoOptions: EstadoFilterOption[] = [
  { value: 'todas', label: 'Todas', color: 'bg-gray-400' },
  { value: 'abonado', label: 'Abonado', color: 'bg-yellow-500' },
  { value: 'pendiente', label: 'Pendiente', color: 'bg-red-500' },
]

export function FiltersBar({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  showEstadoFilter = false,
  estadoFilter = 'todas',
  onEstadoFilterChange,
  estadoFilterOptions = defaultEstadoOptions,
  estadoComboboxOpen = false,
  onEstadoComboboxOpenChange,
}: FiltersBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null)

  const handleClearSearch = useCallback(() => {
    onSearchChange('')
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [onSearchChange])

  const selectedEstadoOption = estadoFilterOptions.find(opt => opt.value === estadoFilter)

  return (
    <div className="flex items-center gap-3">
      {showEstadoFilter && onEstadoFilterChange && (
        <Popover open={estadoComboboxOpen} onOpenChange={onEstadoComboboxOpenChange}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              mode="input"
              placeholder={estadoFilter === 'todas'}
              className="w-[180px] h-10 text-sm font-normal justify-between bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {estadoFilter !== 'todas' && selectedEstadoOption ? (
                <span className="flex items-center gap-2.5">
                  <span className={cn('ms-0.5 size-1.5 rounded-full', selectedEstadoOption.color)}></span>
                  <span className="truncate text-sm">
                    {selectedEstadoOption.label}
                  </span>
                </span>
              ) : (
                <span className="text-sm text-gray-500">Filtrar por estado</span>
              )}
              <ButtonArrow />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[180px] p-0">
            <Command>
              <CommandInput placeholder="Buscar estado..." />
              <CommandList>
                <CommandEmpty>No se encontró estado.</CommandEmpty>
                <CommandGroup>
                  {estadoFilterOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() => {
                        onEstadoFilterChange(option.value as 'todas' | 'abonado' | 'pendiente')
                        onEstadoComboboxOpenChange?.(false)
                      }}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={cn('ms-1 size-1.5 rounded-full', option.color)}></span>
                        <span className="truncate">{option.label}</span>
                      </span>
                      {estadoFilter === option.value && <CommandCheck />}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
      
      <div className="relative w-80">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 pr-10 h-10 text-sm bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 shadow-sm hover:shadow-md"
          ref={searchInputRef}
        />
        {searchTerm !== '' && (
          <Button
            onClick={handleClearSearch}
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 hover:bg-gray-100 rounded-full"
          >
            <X size={16} className="text-gray-500" />
          </Button>
        )}
      </div>
    </div>
  )
}

