"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { FormFieldWithTooltip } from './FormField'
import { cn } from '@/lib/utils'

type InputFilter = 'letters-only' | 'numbers-only' | 'none'

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  name: string
  label: string
  required?: boolean
  description?: string
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'password' | 'number'
  autoComplete?: string
  invalid?: boolean
  error?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
  showError?: boolean
  startIcon?: React.ReactNode
  /** Filtra caracteres permitidos: 'letters-only' solo letras y espacios, 'numbers-only' solo dígitos */
  inputFilter?: InputFilter
}

// Funciones para filtrar caracteres según el tipo
const filterValue = (value: string, filter: InputFilter): string => {
  switch (filter) {
    case 'letters-only':
      // Solo permite letras (mayúsculas, minúsculas, acentuadas, ñ) y espacios
      return value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿÑñ\s]/g, '')
    case 'numbers-only':
      // Solo permite dígitos numéricos
      return value.replace(/[^0-9]/g, '')
    default:
      return value
  }
}

export function FormInput({
  name,
  label,
  required = false,
  description,
  placeholder,
  type = 'text',
  autoComplete,
  invalid = false,
  error,
  value,
  onChange,
  className,
  disabled = false,
  showError = false,
  startIcon,
  inputFilter = 'none',
  ...inputProps
}: FormInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value
    const filteredValue = filterValue(rawValue, inputFilter)
    onChange?.(filteredValue)
  }

  return (
    <FormFieldWithTooltip
      label={label}
      required={required}
      description={description}
      invalid={invalid}
      error={showError ? error : undefined}
      className={className}
    >
      <div className="relative">
        {startIcon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
            {startIcon}
            <span className="sr-only">Icon</span>
          </div>
        )}
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          autoComplete={autoComplete}
          disabled={disabled}
          className={cn(
            "w-full",
            startIcon && "pl-9",
            invalid && "border-red-500 focus:border-red-500"
          )}
          {...inputProps}
        />
      </div>
    </FormFieldWithTooltip>
  )
}
