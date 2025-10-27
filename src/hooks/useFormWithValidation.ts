import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

interface UseFormWithValidationProps<T extends z.ZodType> extends Omit<UseFormProps<z.infer<T>>, 'resolver'> {
  schema: T
  mode?: 'onChange' | 'onBlur' | 'onSubmit' | 'onTouched' | 'all'
}

export function useFormWithValidation<T extends z.ZodType>({
  schema,
  mode = 'onChange',
  ...formProps
}: UseFormWithValidationProps<T>): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
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
