import { apiClient } from '../lib/config/axios.config'

export const adminDashboardService = {

    async financeResumenMes(year: number) {
        try {
            const response = await apiClient.get('/dashboard-admin/resumen-year', {
                params: { year }
            })
            console.log("🚀 ~ response:", response.data)

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
            console.log("🚀 ~ response:", response)
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
    }
}
