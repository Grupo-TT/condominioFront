import { z } from "zod";

export const pagoSchema = z.object({
  obligacionId: z
    .string()
    .min(1, "Por favor, selecciona una obligación.")
    .max(30, "Máximo 30 caracteres"),
  tipoObligacion: z
  .string()
  .min(1, "Por favor, selecciona un tipo de obligación.")
  .max(30, "Máximo 30 caracteres"),
  monto: z
    .number()
    .refine((val) => typeof val === "number" && !isNaN(val), {
      message: "Ingresa un número válido",
    })
    .positive("Por favor, ingresa un valor válido")
    .max(999999999999, "Monto demasiado grande"),
});

export type PagoFormData = z.infer<typeof pagoSchema>;
