import { casaService } from '@/lib/services/casa.service'
import { apiClient } from '../lib/config/axios.config'
import { AsambleaService } from '@/lib/services/asamblea.service'

export const adminDashboardService = {

    async financeResumenMes(year: number) {
        try {
            const response = await apiClient.get('/dashboard-admin/resumen-year', {
                params: { year }
            })
            const body = response.data.data

            if (body && Array.isArray(body.meses)) {
                return body.meses
            }
            return []
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } }
                if (axiosError.response?.status === 404) {
                    return []
                }
            }
            throw error
        }
    },

    async currentMonthSummary() {
        try {
            const response = await apiClient.get('/dashboard-admin/resumen-month')
            const body = response.data.data
            if (body && typeof body === 'object') {
                return body.metricas
            }
            return {}
        } catch (error) {
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } }
                if (axiosError.response?.status === 404) {
                    return {}
                }
            }
            throw error
        }
    },

    async getHousesStatus() {
        try {
            const casas = await casaService.getAll();

            const total = casas.length;

            const alDiaCount = casas.filter(c => c.estadoFinancieroCasa === "AL_DIA").length;
            const morosasCount = casas.filter(c => c.estadoFinancieroCasa === "EN_MORA").length;

            const alDiaPercentage = total ? Math.round((alDiaCount / total) * 100) : 0;
            const morosasPercentage = total ? Math.round((morosasCount / total) * 100) : 0;

            return {
                total,
                alDia: {
                    count: alDiaCount,
                    percentage: alDiaPercentage,
                },
                morosas: {
                    count: morosasCount,
                    percentage: morosasPercentage,
                },
            };
        } catch (error) {
            console.error("Error al obtener el estado financiero de las casas:", error);
            throw error;
        }
    },

    async getHousesTypes() {
        try {
            const casas = await casaService.getAll();

            const total = casas.length;

            const arrendadasCount = casas.filter(c => c.usoCasa === "ARRENDADA").length;
            const residencialesCount = casas.filter(c => c.usoCasa === "RESIDENCIAL").length;

            const arrendadasPercentage = total ? Math.round((arrendadasCount / total) * 100) : 0;
            const residencialesPercentage = total ? Math.round((residencialesCount / total) * 100) : 0;

            return {
                total,
                arrendadas: {
                    count: arrendadasCount,
                    percentage: arrendadasPercentage,
                },
                residenciales: {
                    count: residencialesCount,
                    percentage: residencialesPercentage,
                },
            };
        } catch (error) {
            console.error("Error al obtener tipos de casas:", error);
            throw error;
        }
    },

    async getAsambleas() {
    try {
        const all = await AsambleaService.getAll();

        const hoy = new Date();

        const proximas = all.filter(a => new Date(a.fecha) >= hoy);

        proximas.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

        return proximas.slice(0, 3);

    } catch (error) {
        console.error("Error al obtener las próximas asambleas:", error);
        throw error;
    }
}
        
}

