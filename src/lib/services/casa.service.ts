import { apiClient } from '../config/axios.config'

interface CasaFromAPI {
  numeroCasa: number
  propietario: {
    id: number
    primerNombre: string
    segundoNombre: string
    primerApellido: string
    segundoApellido: string
    tipoDocumento: string
    numeroDocumento: number
    telefono: number
    user: {
      id: number
      email: string
      contrasenia: string
      accountNoExpired: boolean
      accountNoLocked: boolean
      credentialNoExpired: boolean
      roles: Array<{
        id: number
        roleEnum: string
        permissions: Array<{
          id: number
          name: string
        }>
      }>
      enabled: boolean
    }
    estado: boolean
    junta: boolean
    comiteConvivencia: boolean
    casa: {
      id: number
      numeroCasa: number
    }
  }
  cantidadMiembros: number
  cantidadMascotas: number
}

interface CasasApiResponse {
  message: string
  data: CasaFromAPI[]
}

function buildNombreCompleto(propietario: CasaFromAPI['propietario']): string {
  if (!propietario) return 'Sin propietario';

  const partes = [
    propietario.primerNombre,
    propietario.segundoNombre,
    propietario.primerApellido,
    propietario.segundoApellido
  ]
  return partes.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
}

export function adaptCasaFromAPI(casaApi: CasaFromAPI) {
  return {
    id: String(casaApi.propietario?.casa?.id ?? casaApi.numeroCasa),
    numero: String(casaApi.numeroCasa),
    propietario: buildNombreCompleto(casaApi.propietario),
    miembros: Array.from({ length: casaApi.cantidadMiembros || 0 }, () => ({})),
    mascotas: Array.from({ length: casaApi.cantidadMascotas || 0 }, () => ({
      tipo: 'perro' as const
    })),
    estado: casaApi.propietario?.estado ? ('Al Día' as const) : ('En Mora' as const),
    uso: 'Residencial' as const
  }
}

export const casaService = {
  async getAll(
  ) {
    try {
      const response = await apiClient.get<CasasApiResponse>('/Casa/All')
      return response.data.data || []
    } catch (error) {
      console.error('Error al obtener las casas:', error)
      throw error
    }
  },
  async getMembersByCasa(
    idCasa: string | number
  ) {
    try {
      const res = await apiClient.get<MiembrosApiResponse>(`/Miembros/ViewMembers/${idCasa}`)
      return res.data.data || []
    } catch (error) {
      console.error('Error al obtener los miembros:', error)
      throw error
    }
  }
}

interface MiembroCasa {
  nombreCompleto: string
  tipoMiembro: 'PROPIETARIO' | 'ARRENDATARIO' | 'FAMILIAR' | 'OTRO' | string
  numeroDocumento: number | string
  telefono: number | string
  email?: string
}

interface MiembrosApiResponse {
  message: string
  data: MiembroCasa[]
}
