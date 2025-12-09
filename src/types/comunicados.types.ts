// Types for Comunicados module API

// GET /persona/all - Response for recipients list
export interface PersonaResponse {
    nombreCompleto: string
    telefono: number
    correo: string
    roles: string[]
    idCasa: number
}

export interface PersonasApiResponse {
    message: string
    data: PersonaResponse[]
}

// GET /comunicados - Response for communications history
export interface ComunicadoResponse {
    id: number
    titulo: string
    cuerpo: string
    fechaEnvio: string // ISO date string
    destinatarios: string
}

// GET /destinatarios/{idCorreo} - Response for email recipients
export interface DestinatarioCorreo {
    nombreCompleto: string
    idCasa: number
    email: string
}

// POST /email/send-many - Request body
export interface SendEmailRequest {
    emails: string[]
    subject: string
    message: string
    file?: string // Base64 encoded file or file URL
}

export interface SendEmailApiResponse {
    message: string
    data: string
}

// DELETE /comunicados/{id} - Response
export interface DeleteComunicadoResponse {
    message: string
    data: Record<string, unknown>
}

// Adapted type for UI component compatibility
export interface PersonaSeleccionable {
    id: string
    nombreCompleto: string
    correo: string
    telefono: number
    roles: string[]
    idCasa: number
}

// Adapted type for UI component compatibility (comunicado history)
export interface ComunicadoUI {
    id: string
    asunto: string
    mensaje: string
    fechaEnvio: string
    destinatarios: string
    destinatariosCount?: number
    estado: 'enviado' | 'pendiente' | 'error'
}
