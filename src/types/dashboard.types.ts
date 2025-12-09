export interface DashboardSummary {
    ingresos: number
    egresos: number
    balance: number
    saldoActual: number
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
