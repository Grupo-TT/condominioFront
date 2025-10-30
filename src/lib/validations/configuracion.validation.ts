import { z } from 'zod'

export const configuracionValorSchema = z.object({
  valor: z
    .number()
    .min(0, 'El valor no puede ser negativo')
    .positive('El valor debe ser mayor a 0'),
  fechaAplicacion: z.date().optional(),
})

export type ConfiguracionValorFormData = z.infer<typeof configuracionValorSchema>

