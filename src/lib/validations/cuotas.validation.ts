import { z } from 'zod'

// Schema de validación para el formulario de registro de pagos
export const pagoSchema = z.object({
  obligacionId: z
    .string()
    .min(1, "Debe seleccionar una obligación"),

  monto: z
    .number()
    .min(0.01, "Por favor, ingresa un valor válido.")
    .max(999999999999, "El monto no puede superar 12 dígitos"),
})

// Tipo inferido del schema
export type PagoFormData = z.infer<typeof pagoSchema>
