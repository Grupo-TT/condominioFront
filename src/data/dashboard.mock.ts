export interface MonthlyData {
    mes: string
    entradas: number
    salidas: number
}

export interface DashboardSummary {
    entradas: number
    salidas: number
    balance: number
    saldoActual: number
}

// Datos mensuales de entradas y salidas por año
export const monthlyDataByYear: Record<number, MonthlyData[]> = {
    2023: [
        { mes: 'Ene', entradas: 11500000, salidas: 8000000 },
        { mes: 'Feb', entradas: 10800000, salidas: 8500000 },
        { mes: 'Mar', entradas: 12200000, salidas: 8200000 },
        { mes: 'Abr', entradas: 11900000, salidas: 9000000 },
        { mes: 'May', entradas: 12500000, salidas: 8400000 },
        { mes: 'Jun', entradas: 11300000, salidas: 8800000 },
        { mes: 'Jul', entradas: 13100000, salidas: 9300000 },
        { mes: 'Ago', entradas: 12800000, salidas: 9700000 },
        { mes: 'Sep', entradas: 11700000, salidas: 8100000 },
        { mes: 'Oct', entradas: 12400000, salidas: 8900000 },
        { mes: 'Nov', entradas: 11900000, salidas: 8300000 },
        { mes: 'Dic', entradas: 13500000, salidas: 9600000 },
    ],
    2024: [
        { mes: 'Ene', entradas: 12500000, salidas: 8300000 },
        { mes: 'Feb', entradas: 11800000, salidas: 9100000 },
        { mes: 'Mar', entradas: 13200000, salidas: 8700000 },
        { mes: 'Abr', entradas: 12900000, salidas: 9500000 },
        { mes: 'May', entradas: 13500000, salidas: 8900000 },
        { mes: 'Jun', entradas: 12300000, salidas: 9300000 },
        { mes: 'Jul', entradas: 14100000, salidas: 9800000 },
        { mes: 'Ago', entradas: 13800000, salidas: 10200000 },
        { mes: 'Sep', entradas: 12700000, salidas: 8600000 },
        { mes: 'Oct', entradas: 13400000, salidas: 9400000 },
        { mes: 'Nov', entradas: 12900000, salidas: 8800000 },
        { mes: 'Dic', entradas: 14500000, salidas: 10100000 },
    ],
    2025: [
        { mes: 'Ene', entradas: 13500000, salidas: 9300000 },
        { mes: 'Feb', entradas: 12800000, salidas: 9600000 },
        { mes: 'Mar', entradas: 14200000, salidas: 9200000 },
        { mes: 'Abr', entradas: 13900000, salidas: 10000000 },
        { mes: 'May', entradas: 14500000, salidas: 9400000 },
        { mes: 'Jun', entradas: 13300000, salidas: 9800000 },
        { mes: 'Jul', entradas: 15100000, salidas: 10300000 },
        { mes: 'Ago', entradas: 14800000, salidas: 10700000 },
        { mes: 'Sep', entradas: 13700000, salidas: 9100000 },
        { mes: 'Oct', entradas: 14400000, salidas: 9900000 },
        { mes: 'Nov', entradas: 13900000, salidas: 9300000 },
        { mes: 'Dic', entradas: 15500000, salidas: 10600000 },
    ],
}

// Calcular el resumen del dashboard para 2024
const monthlyData2024 = monthlyDataByYear[2024]
const totalEntradas = monthlyData2024.reduce((sum, data) => sum + data.entradas, 0)
const totalSalidas = monthlyData2024.reduce((sum, data) => sum + data.salidas, 0)
const balance = totalEntradas - totalSalidas

export const dashboardSummary: DashboardSummary = {
    entradas: totalEntradas,
    salidas: totalSalidas,
    balance: balance,
    saldoActual: 45800000,
}

// Datos de estado de casas
export interface HousesStatusData {
    total: number
    alDia: {
        count: number
        percentage: number
    }
    morosas: {
        count: number
        percentage: number
    }
}

export const housesStatus: HousesStatusData = {
    total: 48,
    alDia: {
        count: 32,
        percentage: 67,
    },
    morosas: {
        count: 16,
        percentage: 33,
    },
}

// Datos de tipos de casas
export interface HouseTypesData {
    total: number
    arrendadas: {
        count: number
        percentage: number
    }
    residenciales: {
        count: number
        percentage: number
    }
}

export const houseTypes: HouseTypesData = {
    total: 48,
    arrendadas: {
        count: 29,
        percentage: 60,
    },
    residenciales: {
        count: 19,
        percentage: 40,
    },
}
