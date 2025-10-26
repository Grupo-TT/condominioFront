import { apiClient } from '../config/axios.config'

interface CasaFromAPI {
  numeroCasa: number
  propietario: {
    nombreCompleto: string
    telefono: number
    correo: string
  }
  cantidadMiembros: number
  cantidadMascotas: number
  mascotas: {
    "TipoMascota.PERRO"?: number
    "TipoMascota.GATO"?: number
    "TipoMascota.OTRO"?: number
  }
  estadoFinancieroCasa: string
  usoCasa: string
}

interface CasasApiResponse {
  message: string
  data: CasaFromAPI[]
}

export function adaptCasaFromAPI(casaApi: CasaFromAPI) {

  const mascotas = {
    perro: casaApi.mascotas?.["TipoMascota.PERRO"] ?? 0,
    gato: casaApi.mascotas?.["TipoMascota.GATO"] ?? 0,
    otro: casaApi.mascotas?.["TipoMascota.OTRO"] ?? 0,
  }

  return {
    numeroCasa: String(casaApi.numeroCasa),
    propietario: casaApi.propietario
    ?{
      nombreCompleto: casaApi.propietario.nombreCompleto,
      telefono: casaApi.propietario.telefono,
      correo: casaApi.propietario.correo,
    } : {
      nombreCompleto: 'Sin propietario',
      telefono: 0,
      correo: '',
    },
    cantidadMiembros: casaApi.cantidadMiembros || 0,
    cantidadMascotas: casaApi.cantidadMascotas || 0,
    mascotas,
    estadoFinancieroCasa: (casaApi.estadoFinancieroCasa ?? 'AL_DIA').replace('_', ' '),
    usoCasa: (casaApi.usoCasa ?? 'RESIDENCIAL').replace('_', ' ')
  }
}

export const casaService = {
  async getAll(
  ) {
    try {
      const response = await apiClient.get<CasasApiResponse>('/casa/all')
      return response.data.data || []
    } catch (error) {
      console.error('Error al obtener las casas:', error)
      throw error
    }
  },
  async getMembersByCasa(numeroCasa: number | string) {
    try {
      const res = await apiClient.get<MiembrosApiResponse>(`/miembros/view-members/${numeroCasa}`)
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
