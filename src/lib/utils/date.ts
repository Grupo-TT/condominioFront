
/**
 * Utility functions for consistent date handling across the application.
 * Prevents UTC timezone shift issues when parsing "YYYY-MM-DD" strings.
 */

/**
 * Parses a date string safely into local time.
 * If the string is in "YYYY-MM-DD" format, it creates the Date object
 * using local time parts to avoid UTC shift.
 */
export function parseSafeDate(dateStr: string | Date | undefined): Date {
    if (!dateStr) return new Date();
    if (dateStr instanceof Date) return dateStr;

    const parts = dateStr.includes('T')
        ? dateStr.split('T')[0].split('-').map(Number)
        : dateStr.split('-').map(Number);

    if (parts.length === 3) {
        // constructor for new Date(year, monthIndex, day) uses local time
        return new Date(parts[0], parts[1] - 1, parts[2]);
    }

    return new Date(dateStr);
}

/**
 * Formats a date string or object consistently in Spanish (Colombia).
 */
export function formatDateShort(date: string | Date | undefined): string {
    if (!date) return '-';
    const fecha = parseSafeDate(date);

    return fecha.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Formats a date string or object as "DD/MM/YYYY".
 */
export function formatDateNumeric(date: string | Date | undefined): string {
    if (!date) return '-';
    const fecha = parseSafeDate(date);

    const day = fecha.getDate().toString().padStart(2, '0');
    const month = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const year = fecha.getFullYear();

    return `${day}/${month}/${year}`;
}
