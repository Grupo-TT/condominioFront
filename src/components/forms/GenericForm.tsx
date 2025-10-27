"use client"

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { FormInput, FormSelect, type SelectOption } from './'
import { TooltipProvider } from '@/components/ui/tooltip'

export interface FormFieldConfig {
  type: 'input' | 'select'
  name: string
  label: string
  required?: boolean
  description?: string
  placeholder?: string
  options?: SelectOption[]
  inputType?: 'text' | 'email' | 'tel' | 'password' | 'number'
  autoComplete?: string
  disabled?: boolean
}

interface GenericFormProps<T extends z.ZodType> {
  schema: T
  fields: FormFieldConfig[]
  onSubmit: (data: z.infer<T>) => void
  submitLabel?: string
  cancelLabel?: string
  onCancel?: () => void
  className?: string
  defaultValues?: Partial<z.infer<T>>
}

export function GenericForm<T extends z.ZodType>({
  schema,
  fields,
  onSubmit,
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  onCancel,
  className,
  defaultValues
}: GenericFormProps<T>) {
  const [showAllErrors, setShowAllErrors] = useState(false)

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: 'onChange',
    defaultValues: defaultValues as any
  })

  const handleFormSubmit = (data: z.infer<T>) => {
    onSubmit(data)
    form.reset()
    setShowAllErrors(false)
  }

  const handleFormSubmitAttempt = () => {
    setShowAllErrors(true)
    form.handleSubmit(handleFormSubmit)()
  }

  return (
    <TooltipProvider>
      <form 
        id="generic-form"
        onSubmit={handleFormSubmitAttempt} 
        className={`space-y-6 ${className || ''}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <Controller
              key={field.name}
              name={field.name as any}
              control={form.control}
              render={({ field: controllerField, fieldState }) => {
                const commonProps = {
                  name: field.name,
                  label: field.label,
                  required: field.required,
                  description: field.description,
                  invalid: fieldState.invalid,
                  error: fieldState.error?.message,
                  value: controllerField.value,
                  onChange: controllerField.onChange,
                  disabled: field.disabled
                }

                if (field.type === 'input') {
                  return (
                    <FormInput
                      {...commonProps}
                      type={field.inputType || 'text'}
                      placeholder={field.placeholder}
                      autoComplete={field.autoComplete}
                      showError={showAllErrors}
                    />
                  )
                }

                if (field.type === 'select') {
                  return (
                    <FormSelect
                      {...commonProps}
                      placeholder={field.placeholder}
                      options={field.options || []}
                      showError={showAllErrors}
                    />
                  )
                }

                return null
              }}
            />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          <Button type="submit">
            {submitLabel}
          </Button>
        </div>
      </form>
    </TooltipProvider>
  )
}
