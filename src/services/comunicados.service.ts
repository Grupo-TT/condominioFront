import { apiClient } from '../lib/config/axios.config'
import {
    PersonaResponse,
    PersonasApiResponse,
    ComunicadoResponse,
    DestinatarioCorreo,
    SendEmailRequest,
    SendEmailApiResponse,
    DeleteComunicadoResponse,
} from '../types/comunicados.types'

export const comunicadosService = {
    /**
     * Get all personas (recipients) for sending communications
     * GET /persona/all
     */
    async getPersonas(): Promise<PersonaResponse[]> {
        try {
            const response = await apiClient.get<PersonasApiResponse>('/persona/all')
            const body = response.data
            if (body && typeof body === 'object' && 'data' in body && Array.isArray(body.data)) {
                return body.data as PersonaResponse[]
            }
            if (Array.isArray(body)) return body as PersonaResponse[]
            return []
        } catch (error) {
            // Handle 404 as empty list
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } }
                if (axiosError.response?.status === 404) {
                    return []
                }
            }
            throw error
        }
    },

    /**
     * Get all sent communications
     * GET /comunicados
     * Note: Backend returns 404 when no comunicados exist
     */
    async getComunicados(): Promise<ComunicadoResponse[]> {
        try {
            const response = await apiClient.get<ComunicadoResponse[]>('/comunicados')
            const body = response.data
            if (Array.isArray(body)) return body as ComunicadoResponse[]
            if (body && typeof body === 'object' && 'data' in body && Array.isArray((body as { data: unknown }).data)) {
                return (body as { data: ComunicadoResponse[] }).data
            }
            return []
        } catch (error) {
            // Handle 404 as empty list (no comunicados exist yet)
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } }
                if (axiosError.response?.status === 404) {
                    return []
                }
            }
            throw error
        }
    },

    /**
     * Get recipients for a specific email/comunicado
     * GET /destinatarios/{idCorreo}
     */
    async getDestinatarios(idCorreo: number): Promise<DestinatarioCorreo[]> {
        try {
            const response = await apiClient.get<DestinatarioCorreo[]>(`/destinatarios/${idCorreo}`)
            const body = response.data
            if (Array.isArray(body)) return body as DestinatarioCorreo[]
            return []
        } catch (error) {
            // Handle 404 as empty list
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status?: number } }
                if (axiosError.response?.status === 404) {
                    return []
                }
            }
            throw error
        }
    },

    /**
     * Send email to multiple recipients
     * POST /email/send-many
     * Uses multipart/form-data when file is attached
     */
    async sendEmail(request: SendEmailRequest, file?: File): Promise<SendEmailApiResponse> {
        // If there's a file, use FormData (multipart/form-data)
        if (file) {
            const formData = new FormData()
            // Add emails - backend expects "emails" field
            formData.append('emails', request.emails.join(','))
            formData.append('subject', request.subject)
            formData.append('message', request.message)
            formData.append('file', file)

            const response = await apiClient.post<SendEmailApiResponse>('/email/send-many', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data
        }

        // Without file, use query params as before
        const response = await apiClient.post<SendEmailApiResponse>('/email/send-many', null, {
            params: {
                emails: request.emails,
                subject: request.subject,
                message: request.message
            }
        })
        return response.data
    },

    /**
     * Delete a communication by ID
     * DELETE /comunicados/{id}
     */
    async deleteComunicado(id: number): Promise<DeleteComunicadoResponse> {
        const response = await apiClient.delete<DeleteComunicadoResponse>(`/comunicados/${id}`)
        return response.data
    },
}
