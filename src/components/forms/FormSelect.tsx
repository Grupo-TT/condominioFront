"use client"

import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FormFieldWithTooltip } from './FormField'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: string
}

interface FormSelectProps {
  name: string
  label: string
  required?: boolean
  description?: string
  placeholder?: string
  options: SelectOption[]
  invalid?: boolean
  error?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
  disabled?: boolean
  showError?: boolean
}

export function FormSelect({
  name,
  label,
  required = false,
  description,
  placeholder,
  options,
  invalid = false,
  error,
  value,
  onChange,
  className,
  disabled = false,
  showError = false
}: FormSelectProps) {
  return (
    <FormFieldWithTooltip
      label={label}
      required={required}
      description={description}
      invalid={invalid}
      error={showError ? error : undefined}
      className={className}
    >
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger 
          className={cn(
            "w-full text-left",
            invalid && "border-red-500 focus:border-red-500"
          )}
        >
          <SelectValue placeholder={placeholder} className="text-left" />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormFieldWithTooltip>
  )
}
