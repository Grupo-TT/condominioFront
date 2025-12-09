/**
 * Utilidades para manejo de horas en reservas
 */

/**
 * Normaliza una hora en formato "HH:mm" a "HH:mm:ss"
 * Valida el input y devuelve "00:00:00" si es inválido
 */
export function normalizeHora(hora: string): string {
    if (!hora || typeof hora !== 'string') {
        return '00:00:00'
    }

    const parts = hora.split(':')
    const hour = parseInt(parts[0] ?? '', 10)
    const minute = parseInt(parts[1] ?? '', 10)

    // Validar que sean números válidos
    if (isNaN(hour) || isNaN(minute) || hour < 0 || hour > 23 || minute < 0 || minute > 59) {
        return '00:00:00'
    }

    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`
}

/**
 * Formatea una hora (string "HH:mm:ss" u objeto Hora) a formato "HH:mm"
 */
export function formatTime(time: string | { hour?: number; minute?: number } | null | undefined): string {
    // Caso 1: string "HH:mm:ss" o "HH:mm"
    if (typeof time === 'string') {
        const parts = time.split(':').map(Number)
        const hour = parts[0] ?? 0
        const minute = parts[1] ?? 0
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }

    // Caso 2: objeto Hora
    if (time && typeof time === 'object') {
        const hour = Number(time.hour ?? 0)
        const minute = Number(time.minute ?? 0)
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
    }

    return '00:00'
}

/**
 * Parsea una fecha en formato ISO (YYYY-MM-DD) a Date
 * Maneja tanto formato con T como sin T
 */
export function parseFecha(fechaStr: string): Date {
    const dateOnly = fechaStr.split('T')[0]
    const [year, month, day] = dateOnly.split('-').map(Number)
    return new Date(year, month - 1, day)
}
