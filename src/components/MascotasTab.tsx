'use client'

import { useCallback, useEffect, useState } from 'react'
import { Dog, Cat, PawPrint, MoreVertical, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

import { mascotasService } from '@/lib/services/casa.service'
import { Mascotas } from '@/types/casa.types'
import { AgregarMascotaSheet } from './AgregarMascotaSheet'
import { toast } from 'sonner'
import { Skeleton } from '@/components/ui/skeleton'

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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [tipoMascotaEditando, setTipoMascotaEditando] = useState<TipoMascota | null>(null)
  const [tipoMascotaAEliminar, setTipoMascotaAEliminar] = useState<TipoMascota | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchMascotas = useCallback(async () => {
    if (casaNumero === undefined || casaNumero === null || casaNumero === '') {
      setMascotas({ perro: 0, gato: 0, otro: 0 })
      setError('No se pudo identificar la casa del usuario.')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const casaId = Number(casaNumero)
      if (Number.isNaN(casaId)) {
        throw new Error('Identificador de casa inválido')
      }
      const response = await mascotasService.getMascotasByCasa(casaId)
      setMascotas(convertirMascotas(response))
    } catch (err) {
      if (
        (err as { response?: { status?: number } })?.response?.status === 404
      ) {
        setMascotas({ perro: 0, gato: 0, otro: 0 })
        setError(null)
        return
      }
      console.error('Error al obtener las mascotas:', err)
      const responseMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      const fallbackMessage = err instanceof Error
        ? err.message
        : 'No se pudieron cargar las mascotas.'
      const errorMessage = responseMessage || fallbackMessage
      setError(errorMessage)
      toast.error(errorMessage, { description: 'No se pudieron cargar las mascotas.' })
    } finally {
      setLoading(false)
    }
  }, [casaNumero])

  useEffect(() => {
    void fetchMascotas()
  }, [fetchMascotas])

  // Escuchar evento de refresco cuando se agrega mascota desde otro componente
  useEffect(() => {
    const handleRefresh = () => {
      void fetchMascotas()
    }
    window.addEventListener('mascotas:refresh', handleRefresh)
    return () => {
      window.removeEventListener('mascotas:refresh', handleRefresh)
    }
  }, [fetchMascotas])

  const handleModificar = (tipo: TipoMascota) => {
    setTipoMascotaEditando(tipo)
    setIsEditDialogOpen(true)
  }

  const handleEliminarClick = (tipo: TipoMascota) => {
    setTipoMascotaAEliminar(tipo)
    setIsDeleteDialogOpen(true)
  }

  const handleEliminarMascota = async () => {
    if (!tipoMascotaAEliminar) return
    if (casaNumero === undefined || casaNumero === null || casaNumero === '') {
      toast.error('No se pudo identificar la casa del usuario.', { description: 'Intenta cerrar sesión y volver a entrar.' })
      return
    }

    const casaId = Number(casaNumero)
    if (Number.isNaN(casaId)) {
      toast.error('Identificador de casa inválido', { description: 'Contacta al administrador.' })
      return
    }

    try {
      setIsDeleting(true)
      await mascotasService.updateMascotaByCasa(
        casaId,
        tipoMascotaAEliminar.toUpperCase(),
        0
      )
      setMascotas((prev) => ({
        ...prev,
        [tipoMascotaAEliminar]: 0,
      }))
      toast.success('Mascota eliminada correctamente', { description: 'El registro ha sido removido.' })
    } catch (err) {
      console.error('Error al eliminar la mascota:', err)
      const responseMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      const fallbackMessage = err instanceof Error
        ? err.message
        : 'No se pudo eliminar la mascota.'
      toast.error(responseMessage || fallbackMessage, { description: 'No se pudo eliminar la mascota.' })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
      setTipoMascotaAEliminar(null)
    }
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

  const tarjetasSkeleton = (
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="w-[150px] h-[140px] p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col items-center justify-center"
        >
          <Skeleton className="w-12 h-12 rounded-full mb-3" />
          <Skeleton className="h-3 w-16 mb-2" />
          <Skeleton className="h-6 w-10" />
        </div>
      ))}
    </div>
  )

  if (loading) {
    return tarjetasSkeleton
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-6 shadow-sm text-center space-y-4">
        <div>
          <p className="text-sm font-medium text-red-600">{error}</p>
          <p className="text-xs text-gray-500 mt-1">Intenta recargar la información.</p>
        </div>
        <Button variant="outline" onClick={() => void fetchMascotas()}>
          Reintentar
        </Button>
      </div>
    )
  }

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
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={8}
              className="w-40"
            >
              <DropdownMenuItem
                onClick={() => handleModificar(tipo)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Modificar
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={() => handleEliminarClick(tipo)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
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

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Eliminar mascotas tipo {tipoMascotaAEliminar ? getTipoLabel(tipoMascotaAEliminar, 2).toLowerCase() : 'este tipo'}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Ya no aparecerán en tu lista, pero podrás registrarlas nuevamente cuando quieras.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => void handleEliminarMascota()}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

