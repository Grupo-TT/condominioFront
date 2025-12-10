import { adminDashboardService } from '@/services/adminDashboard.service'
import { useCallback } from 'react'
import { HousesStatusData, HouseTypesData, DashboardSummary } from '@/types/dashboard.types'
import { MonthlyData } from '@/data/dashboard.mock'

const defaultHousesStatus: HousesStatusData = {
    total: 0,
    alDia: { count: 0, percentage: 0 },
    morosas: { count: 0, percentage: 0 }
}

const defaultHouseTypes: HouseTypesData = {
    total: 0,
    arrendadas: { count: 0, percentage: 0 },
    residenciales: { count: 0, percentage: 0 }
}

const defaultSummary: DashboardSummary = {
    ingresos: 0,
    egresos: 0,
    balance: 0,
    saldoActual: 0
}

export function useDashboardAdmin() {
    const fetchResumenFinancieroAnio = useCallback(async (year: number): Promise<MonthlyData[]> => {
        try {
            const data = await adminDashboardService.financeResumenMes(year)
            return data
        } catch (err) {
            console.error('Error fetching finance resumen:', err)
            return []
        }
    }, [])

    const fetchResumenFinancieroMes = useCallback(async (): Promise<DashboardSummary> => {
        try {
            const data = await adminDashboardService.currentMonthSummary()
            return data || defaultSummary
        } catch (err) {
            console.error('Error fetching current month summary:', err)
            return defaultSummary
        }
    }, [])

    const fetchCasas = useCallback(async (): Promise<HousesStatusData> => {
        try {
            const data = await adminDashboardService.getHousesStatus()
            return data || defaultHousesStatus
        } catch (err) {
            console.error('Error fetching houses status:', err)
            return defaultHousesStatus
        }
    }, [])

    const fetchTypes = useCallback(async (): Promise<HouseTypesData> => {
        try {
            const data = await adminDashboardService.getHousesTypes()
            return data || defaultHouseTypes
        } catch (err) {
            console.error('Error fetching houses types:', err)
            return defaultHouseTypes
        }
    }, [])

    return {
        fetchResumenFinancieroAnio,
        fetchResumenFinancieroMes,
        fetchCasas,
        fetchTypes,
    }
}