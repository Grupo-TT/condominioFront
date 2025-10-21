import { z } from 'zod'

// Schema de validación para el formulario de nuevo propietario
export const propietarioSchema = z.object({
  primerNombre: z
    .string()
    .min(1, "Primer nombre es obligatorio")
    .min(1, "Primer nombre debe tener al menos 1 caracter")
    .max(25, "Primer nombre debe tener máximo 25 caracteres")
    .regex(/^[A-Za-z]+$/, "Primer nombre solo puede contener letras sin espacios"),

  segundoNombre: z
    .string()
    .max(25, "Segundo nombre debe tener máximo 25 caracteres")
    .regex(/^[A-Za-z\s]*$/, "Segundo nombre solo puede contener letras y espacios")
    .optional()
    .or(z.literal("")),

  primerApellido: z
    .string()
    .min(1, "Primer apellido es obligatorio")
    .min(1, "Primer apellido debe tener al menos 1 caracter")
    .max(25, "Primer apellido debe tener máximo 25 caracteres")
    .regex(/^[A-Za-z]+$/, "Primer apellido solo puede contener letras sin espacios"),

  segundoApellido: z
    .string()
    .max(25, "Segundo apellido debe tener máximo 25 caracteres")
    .regex(/^[A-Za-z]+$/, "Segundo apellido solo puede contener letras sin espacios")
    .optional()
    .or(z.literal("")),

  tipoDocumento: z
    .union([z.string(), z.undefined()])
    .transform((val) => val === undefined ? "" : val)
    .pipe(
      z.string()
        .min(1, "Debe seleccionar un tipo de documento")
        .refine((val) => val === "CEDULA_DE_CIUDADANIA" || val === "CEDULA_DE_EXTRANJERIA", {
          message: "Debe seleccionar un tipo de documento válido"
        })
    ),

  numeroDocumento: z
    .string()
    .min(1, "El número de documento es obligatorio")
    .regex(/^\d+$/, "El número de documento solo puede contener números")
    .min(7, "El número de documento debe tener mínimo 7 dígitos")
    .max(11, "El número de documento debe tener máximo 11 dígitos"),

  email: z
    .string()
    .min(1, "Correo electrónico es obligatorio")
    .email("Debe ingresar un correo electrónico válido")
    .max(100, "Correo electrónico debe tener máximo 100 caracteres"),

  telefono: z
    .string()
    .min(1, "Teléfono es obligatorio")
    .regex(/^\d+$/, "Teléfono solo puede contener números")
    .refine((val) => val.length === 7 || val.length === 10, {
      message: "Teléfono debe tener 7 o 10 dígitos"
    }),

  rolEnCasa: z
    .union([z.string(), z.undefined()])
    .transform((val) => val === undefined ? "" : val)
    .pipe(
      z.string()
        .min(1, "Debe seleccionar un rol en la casa")
        .refine((val) => val === "PROPIETARIO" || val === "ARRENDATARIO", {
          message: "Debe seleccionar un rol válido"
        })
    ),


  idCasa: z
    .union([z.string(), z.undefined()])
    .transform((val) => val === undefined ? "" : val)
    .pipe(
      z.string()
        .min(1, "Debe seleccionar una casa")
        .refine((val) => ["1", "2", "3", "4", "5"].includes(val), {
          message: "Debe seleccionar una casa válida"
        })
    ),
})

// Tipo inferido del schema
export type PropietarioFormData = z.infer<typeof propietarioSchema>