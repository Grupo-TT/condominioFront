import { z } from "zod"

// Validaciones comunes reutilizables
export const commonValidations = {
  // Texto requerido con longitud mínima y máxima
  requiredText: (min: number = 1, max: number = 100, fieldName: string) =>
    z.string()
      .min(min, `${fieldName} debe tener al menos ${min} caracteres`)
      .max(max, `${fieldName} debe tener máximo ${max} caracteres`),

  // Texto opcional con longitud máxima
  optionalText: (max: number = 100, fieldName: string) =>
    z.string()
      .max(max, `${fieldName} debe tener máximo ${max} caracteres`)
      .optional()
      .or(z.literal("")),

  // Solo letras sin espacios
  lettersOnly: (fieldName: string) =>
    z.string().regex(/^[A-Za-z]+$/, `${fieldName} solo puede contener letras sin espacios`),

  // Solo letras con espacios permitidos
  lettersWithSpaces: (fieldName: string) =>
    z.string().regex(/^[A-Za-z\s]*$/, `${fieldName} solo puede contener letras y espacios`),

  // Solo números
  numbersOnly: (fieldName: string) =>
    z.string().regex(/^\d+$/, `${fieldName} solo puede contener números`),

  // Email válido
  email: (fieldName: string = "Correo electrónico") =>
    z.string()
      .min(1, `${fieldName} es obligatorio`)
      .email(`Debe ingresar un ${fieldName.toLowerCase()} válido`)
      .max(100, `${fieldName} debe tener máximo 100 caracteres`),

  // Teléfono con longitud específica
  phone: (lengths: number[], fieldName: string = "Teléfono") =>
    z.string()
      .min(1, `${fieldName} es obligatorio`)
      .regex(/^\d+$/, `${fieldName} solo puede contener números`)
      .refine((val) => lengths.includes(val.length), {
        message: `${fieldName} debe tener ${lengths.join(' o ')} dígitos`
      }),

  // Selección requerida
  requiredSelection: (options: string[], fieldName: string) =>
    z.string()
      .min(1, `Debe seleccionar un ${fieldName.toLowerCase()}`)
      .refine((val) => options.includes(val), {
        message: `Debe seleccionar un ${fieldName.toLowerCase()} válido`
      }),

  // Documento con longitud específica
  document: (minLength: number, maxLength: number, fieldName: string = "documento") =>
    z.string()
      .min(1, `El ${fieldName} es obligatorio`)
      .regex(/^\d+$/, `El ${fieldName} solo puede contener números`)
      .min(minLength, `El ${fieldName} debe tener mínimo ${minLength} dígitos`)
      .max(maxLength, `El ${fieldName} debe tener máximo ${maxLength} dígitos`)
}

// Builder de schemas para formularios comunes
export class FormSchemaBuilder {
  private schema: Record<string, z.ZodTypeAny> = {}

  addRequiredText(fieldName: string, min: number = 1, max: number = 100, lettersOnly: boolean = false) {
    const baseValidation = commonValidations.requiredText(min, max, fieldName)
    this.schema[fieldName] = lettersOnly 
      ? baseValidation.pipe(commonValidations.lettersOnly(fieldName))
      : baseValidation
    return this
  }

  addOptionalText(fieldName: string, max: number = 100, lettersOnly: boolean = false, allowSpaces: boolean = false) {
    const baseValidation = commonValidations.optionalText(max, fieldName)
    if (lettersOnly) {
      this.schema[fieldName] = allowSpaces
        ? baseValidation.pipe(commonValidations.lettersWithSpaces(fieldName))
        : baseValidation.pipe(commonValidations.lettersOnly(fieldName))
    } else {
      this.schema[fieldName] = baseValidation
    }
    return this
  }

  addEmail(fieldName: string = "correoElectronico") {
    this.schema[fieldName] = commonValidations.email()
    return this
  }

  addPhone(fieldName: string = "telefono", lengths: number[] = [7, 10]) {
    this.schema[fieldName] = commonValidations.phone(lengths)
    return this
  }

  addDocument(fieldName: string = "numeroDocumento", minLength: number = 7, maxLength: number = 11) {
    this.schema[fieldName] = commonValidations.document(minLength, maxLength)
    return this
  }

  addRequiredSelection(fieldName: string, options: string[]) {
    this.schema[fieldName] = commonValidations.requiredSelection(options, fieldName)
    return this
  }

  build(): z.ZodObject<Record<string, z.ZodTypeAny>> {
    return z.object(this.schema)
  }
}
