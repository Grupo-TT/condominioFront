"use client"

import React from 'react'
import { Field, FieldLabel, FieldDescription } from '@/components/ui/field'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

interface FormFieldWithTooltipProps {
  children: React.ReactElement
  label: string
  required?: boolean
  description?: string
  invalid?: boolean
  error?: string
  className?: string
}

export function FormFieldWithTooltip({
  children,
  label,
  required = false,
  description,
  invalid = false,
  error,
  className
}: FormFieldWithTooltipProps) {
  const enhancedChildren = React.cloneElement(children, {
    ...children.props,
    'aria-invalid': invalid,
  })

  return (
    <Field data-invalid={invalid} className={className}>
      <FieldLabel>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </FieldLabel>
      {description && (
        <FieldDescription>{description}</FieldDescription>
      )}
      
      <Tooltip>
        <TooltipTrigger asChild>
          {enhancedChildren}
        </TooltipTrigger>
        {invalid && error && (
          <TooltipContent>
            <p>{error}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </Field>
  )
}
