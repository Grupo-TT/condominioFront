import { useMemo } from 'react'
import { Search, Users, ChevronDown, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Checkbox } from '@/components/ui/checkbox'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface PersonaSeleccionable {
  id: string
  nombreCompleto: string
  correo: string
  telefono: number
  roles: string[]
  idCasa: number
}

interface RecipientSelectorProps {
  propietariosDisponibles: PersonaSeleccionable[]
  selectedPropietarios: PersonaSeleccionable[]
  searchPropietarios: string
  onSearchChange: (search: string) => void
  onTogglePropietario: (propietario: PersonaSeleccionable) => void
  onSelectAll: () => void
  onSelectByRole: (role: string) => void
  loading?: boolean
}

// Función para obtener las iniciales del nombre
function getInitials(nombre: string) {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Helper to get unique roles from all personas (excluding ADMIN)
function getUniqueRoles(personas: PersonaSeleccionable[]): string[] {
  const rolesSet = new Set<string>()
  personas.forEach(p => (p.roles || []).forEach(r => {
    if (r.toUpperCase() !== 'ADMIN') {
      rolesSet.add(r)
    }
  }))
  return Array.from(rolesSet).sort()
}

// Helper to get primary role for badge display
function getPrimaryRole(roles: string[] | undefined): string {
  if (!roles || roles.length === 0) return 'RESIDENTE'
  // Prioritize certain roles for display
  const priorityOrder = ['ADMIN', 'PROPIETARIO', 'ARRENDATARIO', 'RESIDENTE']
  for (const priority of priorityOrder) {
    if (roles.includes(priority)) return priority
  }
  return roles[0] || 'RESIDENTE'
}

export function RecipientSelector({
  propietariosDisponibles,
  selectedPropietarios,
  searchPropietarios,
  onSearchChange,
  onTogglePropietario,
  onSelectAll,
  onSelectByRole,
  loading = false,
}: RecipientSelectorProps) {
  // Filtrar propietarios por búsqueda y excluir admins
  const propietariosFiltrados = useMemo(() => {
    // First, filter out admins
    const nonAdmins = propietariosDisponibles.filter(
      p => !(p.roles || []).some(r => r.toUpperCase() === 'ADMIN')
    )

    if (!searchPropietarios) return nonAdmins
    const term = searchPropietarios.toLowerCase()
    return nonAdmins.filter(
      p => p.nombreCompleto?.toLowerCase().includes(term) ||
        p.correo?.toLowerCase().includes(term) ||
        (p.idCasa != null && p.idCasa.toString().includes(term)) ||
        (p.roles || []).some(r => r.toLowerCase().includes(term))
    )
  }, [propietariosDisponibles, searchPropietarios])

  // Get unique roles for the dropdown
  const uniqueRoles = useMemo(() => getUniqueRoles(propietariosDisponibles), [propietariosDisponibles])

  // Check if all personas with a specific role are selected
  const isRoleFullySelected = (role: string) => {
    const personasWithRole = propietariosDisponibles.filter(p => (p.roles || []).includes(role))
    return personasWithRole.length > 0 && personasWithRole.every(p => selectedPropietarios.some(s => s.id === p.id))
  }

  // Count personas with a specific role
  const countByRole = (role: string) => propietariosDisponibles.filter(p => (p.roles || []).includes(role)).length

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Seleccionar destinatarios</h3>
            <p className="text-sm text-gray-400">{selectedPropietarios.length} seleccionados</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-full px-4 h-9 font-medium border-gray-200 text-gray-700 hover:bg-gray-50 gap-2"
            >
              Seleccionar
              <ChevronDown className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 p-2">
            <div className="space-y-1">
              <label
                className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Checkbox
                  checked={selectedPropietarios.length === propietariosDisponibles.length && propietariosDisponibles.length > 0}
                  onCheckedChange={() => onSelectAll()}
                  className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                />
                <span className="text-sm font-medium text-gray-700">Todos</span>
                <span className="text-xs text-gray-400 ml-auto">{propietariosDisponibles.length}</span>
              </label>
              {uniqueRoles.map((role) => (
                <label
                  key={role}
                  className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Checkbox
                    checked={isRoleFullySelected(role)}
                    onCheckedChange={() => onSelectByRole(role)}
                    className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
                  />
                  <span className="text-sm font-medium text-gray-700 capitalize">{role.toLowerCase()}</span>
                  <span className="text-xs text-gray-400 ml-auto">{countByRole(role)}</span>
                </label>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Búsqueda */}
      <div className="px-6 pb-4 shrink-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            placeholder="Buscar por nombre, correo o casa..."
            value={searchPropietarios}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-11 h-11 text-sm bg-gray-50 border-0 rounded-xl focus-visible:ring-1 focus-visible:ring-gray-200 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Lista de propietarios */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4">
        <div className="space-y-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Loader2 className="w-8 h-8 text-gray-400 mb-2 animate-spin" />
              <p className="text-sm text-gray-400">Cargando destinatarios...</p>
            </div>
          ) : propietariosFiltrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Users className="w-10 h-10 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">
                {searchPropietarios
                  ? 'No se encontraron destinatarios'
                  : 'No hay destinatarios disponibles'}
              </p>
            </div>
          ) : (
            propietariosFiltrados.map((propietario) => {
              const isSelected = selectedPropietarios.some(p => p.id === propietario.id)
              const primaryRole = getPrimaryRole(propietario.roles)
              return (
                <div
                  key={propietario.id}
                  onClick={() => onTogglePropietario(propietario)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200",
                    isSelected
                      ? "bg-gray-900 text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-900"
                  )}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className={cn(
                      "rounded-xl text-xs font-semibold",
                      isSelected ? "bg-gray-700 text-white" : "bg-white text-gray-700 border border-gray-200"
                    )}>
                      {getInitials(propietario.nombreCompleto)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "text-sm font-medium truncate",
                      isSelected ? "text-white" : "text-gray-900"
                    )}>
                      {propietario.nombreCompleto}
                    </p>
                    <p className={cn(
                      "text-xs truncate",
                      isSelected ? "text-gray-300" : "text-gray-400"
                    )}>
                      {propietario.idCasa != null ? `Casa ${propietario.idCasa} · ` : ''}{propietario.correo || ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      appearance="light"
                      size="sm"
                      className={cn(
                        "text-[10px] capitalize",
                        isSelected && "bg-white/20 text-white border-white/30"
                      )}
                    >
                      {primaryRole.toLowerCase()}
                    </Badge>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
