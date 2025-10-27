"use client"

import React from 'react'
import { Input } from '@/components/ui/input'
import { FormFieldWithTooltip } from './FormField'
import { cn } from '@/lib/utils'

interface FormInputProps {
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
  showError = false
}: FormInputProps) {
  return (
    <FormFieldWithTooltip
      label={label}
      required={required}
      description={description}
      invalid={invalid}
      error={showError ? error : undefined}
      className={className}
    >
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        autoComplete={autoComplete}
        disabled={disabled}
        className={cn(
          "w-full",
          invalid && "border-red-500 focus:border-red-500"
        )}
      />
    </FormFieldWithTooltip>
  )
}
