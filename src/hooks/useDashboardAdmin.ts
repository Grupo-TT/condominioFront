import { adminDashboardService } from '@/services/adminDashboard.service'
import { useState, useCallback } from 'react'

export function useDashboardAdmin() {
    const fetchResumenFinancieroAnio = useCallback(async (year: number) => {
        try {
            const data = await adminDashboardService.financeResumenMes(year)
            return data
        } catch (err) {
            console.error('Error fetching finance resumen:', err)
            return []
        }
    }, [])

    const fetchResumenFinancieroMes = useCallback(async () => {
        try {
            const data = await adminDashboardService.currentMonthSummary()
            return data
        } catch (err) {
            console.error('Error fetching current month summary:', err)
            return []
        }
    }, [])

    const fetchCasas = useCallback(async () => {
        try {
            const data = await adminDashboardService.getHousesStatus()
            return data
        } catch (err) {
            console.error('Error fetching houses status:', err)
            return []
        }
    }, [])

    const fetchTypes = useCallback(async () => {
        try {
            const data = await adminDashboardService.getHousesTypes()
            return data
        } catch (err) {
            console.error('Error fetching houses types:', err)
            return []
        }
    }, [])

    const fetchAsambleas = useCallback(async () => {
        try {
            const data = await adminDashboardService.getAsambleas()
            return data
        } catch (err) {
            console.error('Error fetching asambleas:', err)
            return []
        }
    }, [])

    return {
        fetchResumenFinancieroAnio,
        fetchResumenFinancieroMes,
        fetchCasas,
        fetchTypes,
    }
}