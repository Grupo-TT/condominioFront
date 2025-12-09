import { useState, useCallback } from 'react'
import { comunicadosService } from '@/services/comunicados.service'
import {
    PersonaResponse,
    ComunicadoResponse,
    DestinatarioCorreo,
    SendEmailRequest,
    PersonaSeleccionable,
    ComunicadoUI,
} from '@/types/comunicados.types'

// Adapter: Convert API PersonaResponse to UI-compatible PersonaSeleccionable
function adaptPersonaToUI(persona: PersonaResponse, index: number): PersonaSeleccionable {
    return {
        id: `${persona.idCasa ?? 'unknown'}-${index}`,
        nombreCompleto: persona.nombreCompleto,
        correo: persona.correo,
        telefono: persona.telefono,
        roles: persona.roles,
        idCasa: persona.idCasa,
    }
}

// Adapter: Convert API ComunicadoResponse to UI-compatible ComunicadoUI
function adaptComunicadoToUI(comunicado: ComunicadoResponse): ComunicadoUI {
    // Parse destinatarios JSON string to get the count
    let destinatariosCount = 0

    try {
        const parsed = JSON.parse(comunicado.destinatarios)
        if (Array.isArray(parsed)) {
            destinatariosCount = parsed.length
        }
    } catch {
        // If parsing fails, count is 0
    }

    return {
        id: comunicado.id.toString(),
        asunto: comunicado.titulo,
        mensaje: comunicado.cuerpo,
        fechaEnvio: comunicado.fechaEnvio,
        destinatarios: `${destinatariosCount} destinatario${destinatariosCount !== 1 ? 's' : ''}`,
        destinatariosCount,
        estado: 'enviado',
    }
}

export function useComunicados() {
    // State for personas/recipients
    const [personas, setPersonas] = useState<PersonaSeleccionable[]>([])
    const [loadingPersonas, setLoadingPersonas] = useState(false)
    const [errorPersonas, setErrorPersonas] = useState<string | null>(null)

    // State for comunicados history
    const [comunicados, setComunicados] = useState<ComunicadoUI[]>([])
    const [loadingComunicados, setLoadingComunicados] = useState(false)
    const [errorComunicados, setErrorComunicados] = useState<string | null>(null)

    // State for destinatarios of a specific comunicado
    const [destinatarios, setDestinatarios] = useState<DestinatarioCorreo[]>([])
    const [loadingDestinatarios, setLoadingDestinatarios] = useState(false)

    // State for sending email
    const [sendingEmail, setSendingEmail] = useState(false)
    const [errorSending, setErrorSending] = useState<string | null>(null)

    // State for deleting comunicado
    const [deletingId, setDeletingId] = useState<string | null>(null)

    /**
     * Fetch all personas (recipients)
     */
    const fetchPersonas = useCallback(async () => {
        try {
            setLoadingPersonas(true)
            setErrorPersonas(null)
            const data = await comunicadosService.getPersonas()
            setPersonas(data.map(adaptPersonaToUI))
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar los destinatarios'
            setErrorPersonas(message)
            console.error('Error fetching personas:', err)
        } finally {
            setLoadingPersonas(false)
        }
    }, [])

    /**
     * Fetch all comunicados (history)
     */
    const fetchComunicados = useCallback(async () => {
        try {
            setLoadingComunicados(true)
            setErrorComunicados(null)
            const data = await comunicadosService.getComunicados()
            // Sort by date descending (newest first)
            const sorted = data.sort((a, b) =>
                new Date(b.fechaEnvio).getTime() - new Date(a.fechaEnvio).getTime()
            )
            setComunicados(sorted.map(adaptComunicadoToUI))
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al cargar los comunicados'
            setErrorComunicados(message)
            console.error('Error fetching comunicados:', err)
        } finally {
            setLoadingComunicados(false)
        }
    }, [])

    /**
     * Fetch destinatarios for a specific comunicado
     */
    const fetchDestinatarios = useCallback(async (idCorreo: string) => {
        try {
            setLoadingDestinatarios(true)
            setDestinatarios([])
            const data = await comunicadosService.getDestinatarios(parseInt(idCorreo, 10))
            setDestinatarios(data)
        } catch (err) {
            console.error('Error fetching destinatarios:', err)
            setDestinatarios([])
        } finally {
            setLoadingDestinatarios(false)
        }
    }, [])

    /**
     * Send email to selected recipients
     */
    const enviarEmail = useCallback(async (request: SendEmailRequest, file?: File): Promise<boolean> => {
        try {
            setSendingEmail(true)
            setErrorSending(null)
            await comunicadosService.sendEmail(request, file)
            // Refresh comunicados list after successful send
            await fetchComunicados()
            return true
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Error al enviar el comunicado'
            setErrorSending(message)
            console.error('Error sending email:', err)
            return false
        } finally {
            setSendingEmail(false)
        }
    }, [fetchComunicados])

    /**
     * Delete a comunicado by ID
     */
    const eliminarComunicado = useCallback(async (id: string): Promise<boolean> => {
        try {
            setDeletingId(id)
            await comunicadosService.deleteComunicado(parseInt(id, 10))
            // Remove from local state immediately
            setComunicados(prev => prev.filter(c => c.id !== id))
            return true
        } catch (err) {
            console.error('Error deleting comunicado:', err)
            return false
        } finally {
            setDeletingId(null)
        }
    }, [])

    return {
        // Personas state
        personas,
        loadingPersonas,
        errorPersonas,
        fetchPersonas,

        // Comunicados state
        comunicados,
        loadingComunicados,
        errorComunicados,
        fetchComunicados,

        // Destinatarios state
        destinatarios,
        loadingDestinatarios,
        fetchDestinatarios,

        // Send email
        sendingEmail,
        errorSending,
        enviarEmail,

        // Delete comunicado
        deletingId,
        eliminarComunicado,
    }
}
