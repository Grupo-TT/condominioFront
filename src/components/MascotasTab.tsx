'use client'

import { useEffect, useState } from 'react'
import { Dog, Cat, PawPrint, MoreVertical, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { mascotasService } from '@/lib/services/casa.service'
import { Mascotas } from '@/types/casa.types'
import { AgregarMascotaSheet } from './AgregarMascotaSheet'

type TipoMascota = 'perro' | 'gato' | 'otro'

const convertirMascotas = (data: { tipoMascota: string, cantidad: number }[]) => {
  return {
    perro: data.find(m => m.tipoMascota === "PERRO")?.cantidad ?? 0,
    gato: data.find(m => m.tipoMascota === "GATO")?.cantidad ?? 0,
    otro: data.find(m => m.tipoMascota === "OTRO")?.cantidad ?? 0,
  }
}

export function MascotasTab() {

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const casaNumero = user.idCasa;
  const [mascotas, setMascotas] = useState<Mascotas>({
    perro: 0,
    gato: 0,
    otro: 0
  })
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [tipoMascotaEditando, setTipoMascotaEditando] = useState<TipoMascota | null>(null)

  useEffect(() => {
    async function cargarMascotas() {
      const response = await mascotasService.getMascotasByCasa(casaNumero)
      setMascotas(convertirMascotas(response))
    }

    cargarMascotas()
  }, [casaNumero])

  const handleModificar = (tipo: TipoMascota) => {
    setTipoMascotaEditando(tipo)
    setIsEditDialogOpen(true)
  }

  const getTipoLabel = (tipo: TipoMascota, cantidad: number): string => {
    const labels = {
      perro: cantidad === 1 ? 'Perro' : 'Perros',
      gato: cantidad === 1 ? 'Gato' : 'Gatos',
      otro: cantidad === 1 ? 'Otro' : 'Otros',
    }
    return labels[tipo]
  }

  const totalMascotas = mascotas.perro + mascotas.gato + mascotas.otro

  if (totalMascotas === 0) {
    return (
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 py-4 px-6 text-center hover:border-gray-400 transition-colors">
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <PawPrint className="w-6 h-6 text-gray-400" />
          </div>
          <div className="space-y-0.5">
            <p className="text-base font-semibold text-gray-700">No hay mascotas registradas</p>
            <p className="text-sm text-gray-500">Esta vivienda no tiene mascotas registradas</p>
          </div>
        </div>
      </div>
    )
  }

  const renderTarjeta = (tipo: TipoMascota, cantidad: number, icon: typeof Dog, bgColor: string, iconColor: string) => {
    if (cantidad === 0) return null

    return (
      <div key={tipo} className="w-[150px] h-[140px] p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center relative group">
        {/* Botón de menú */}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-label="acciones" variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem
                onClick={() => handleModificar(tipo)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Modificar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Contenido de la tarjeta */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
          style={{ backgroundColor: bgColor }}
        >
          {icon === Dog && <Dog className="w-6 h-6" style={{ color: iconColor }} />}
          {icon === Cat && <Cat className="w-6 h-6" style={{ color: iconColor }} />}
          {icon === PawPrint && <PawPrint className="w-6 h-6" style={{ color: iconColor }} />}
        </div>
        <span className="text-xs text-gray-500 mb-1.5">
          {getTipoLabel(tipo, cantidad)}
        </span>
        <span className="text-xl font-bold text-gray-900">
          {cantidad}
        </span>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {renderTarjeta('perro', mascotas.perro, Dog, '#F1E8D6', '#A39170')}
        {renderTarjeta('gato', mascotas.gato, Cat, '#E3E4EA', '#595D75')}
        {renderTarjeta('otro', mascotas.otro, PawPrint, '#E6EFEA', '#4C6C5A')}
      </div>

      {/* Dialog para editar mascota */}
      {tipoMascotaEditando && (
        <AgregarMascotaSheet
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open)
            if (!open) {
              setTipoMascotaEditando(null)
            }
          }}
          tipoMascota={tipoMascotaEditando}
          cantidadInicial={mascotas[tipoMascotaEditando]}
          onSave={(cantidad) => {
            setMascotas(prev => ({
              ...prev,
              [tipoMascotaEditando]: cantidad
            }))
            setIsEditDialogOpen(false)
            setTipoMascotaEditando(null)
          }}
          idCasa={casaNumero}
        />
      )}
    </>
  )
}

