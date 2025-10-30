import { useForm, UseFormProps, UseFormReturn, FieldValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface UseFormWithValidationProps<T extends z.ZodType<FieldValues>> extends Omit<UseFormProps<z.infer<T>>, 'resolver'> {
  schema: T
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all'
}

export function useFormWithValidation<T extends z.ZodType<FieldValues>>({
  schema,
  mode = 'onChange',
  ...formProps
}: UseFormWithValidationProps<T>) {
  return useForm<z.infer<T>>({
    // @ts-expect-error - Generic type complexity with zodResolver
    resolver: zodResolver(schema),
    mode,
    ...formProps
  })
}

// Hook para manejar envío de formularios
export function useFormSubmission<T>(
  onSubmit: (data: T) => void,
  onError?: (errors: unknown) => void
) {
  const handleSubmit = (data: T) => {
    try {
      onSubmit(data)
    } catch (error) {
      onError?.(error)
    }
  }

  return { handleSubmit }
}
