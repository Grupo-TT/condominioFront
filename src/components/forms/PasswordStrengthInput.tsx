'use client'

import { useId, useMemo, useState } from 'react'
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { FormFieldWithTooltip } from './FormField'
import { cn } from '@/lib/utils'

interface PasswordStrengthInputProps {
  name: string
  label: string
  required?: boolean
  description?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  invalid?: boolean
  error?: string
  showError?: boolean
  className?: string
  startIcon?: React.ReactNode
}

const requirements = [
  { regex: /.{8,}/, text: 'Mínimo 8 caracteres' },
  { regex: /[A-Z]/, text: 'Al menos una letra mayúscula' },
  { regex: /[0-9]/, text: 'Al menos un número' },
  {
    regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/,
    text: 'Al menos un carácter especial'
  }
]

export function PasswordStrengthInput({
  name,
  label,
  required = false,
  description,
  placeholder = 'Contraseña',
  value = '',
  onChange,
  invalid = false,
  error,
  showError = false,
  className,
  startIcon
}: PasswordStrengthInputProps) {
  const [isVisible, setIsVisible] = useState(false)
  const id = useId()

  const toggleVisibility = () => setIsVisible(prevState => !prevState)

  const strength = useMemo(() => {
    return requirements.map(req => ({
      met: req.regex.test(value),
      text: req.text
    }))
  }, [value])

  const strengthScore = useMemo(() => {
    return strength.filter(req => req.met).length
  }, [strength])

  const getColor = (score: number) => {
    if (score === 0) return 'bg-border'
    if (score <= 1) return 'bg-destructive'
    if (score <= 2) return 'bg-orange-500'
    if (score === 3) return 'bg-amber-500'
    return 'bg-green-500'
  }

  const getText = (score: number) => {
    if (score === 0) return 'Ingresa una contraseña'
    if (score <= 1) return 'Contraseña débil'
    if (score <= 2) return 'Contraseña media'
    if (score === 3) return 'Contraseña fuerte'
    return 'Contraseña muy fuerte'
  }

  const hasLabel = label && label.trim() !== ''

  const content = (
    <div className="space-y-3">
      <div className="relative">
        {startIcon && (
          <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50 z-10">
            {startIcon}
            <span className="sr-only">Icon</span>
          </div>
        )}
        <Input
          id={id}
          name={name}
          type={isVisible ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={e => {
            const newValue = e.target.value
            onChange?.(newValue)
          }}
          className={cn(
            'pr-9',
            startIcon && 'pl-9',
            invalid && 'border-red-500 focus:border-red-500'
          )}
          aria-invalid={invalid}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleVisibility}
          className="text-muted-foreground focus-visible:ring-ring/50 absolute inset-y-0 right-0 rounded-l-none hover:bg-transparent"
        >
          {isVisible ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
          <span className="sr-only">{isVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}</span>
        </Button>
      </div>

      <div className="flex h-1.5 w-full gap-1.5">
        {Array.from({ length: 4 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              'h-full flex-1 rounded-full transition-all duration-500 ease-out',
              index < strengthScore ? getColor(strengthScore) : 'bg-gray-200'
            )}
          />
        ))}
      </div>

      <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
        <p className="text-foreground text-xs font-medium mb-2.5">
          {getText(strengthScore)}. Debe contener:
        </p>
        <ul className="space-y-1.5">
          {strength.map((req, index) => (
            <li key={index} className="flex items-center gap-2">
              {req.met ? (
                <CheckIcon className="size-3.5 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <XIcon className="text-gray-400 size-3.5 flex-shrink-0" />
              )}
              <span
                className={cn(
                  'text-xs leading-relaxed',
                  req.met
                    ? 'text-green-700 dark:text-green-500 font-medium'
                    : 'text-gray-600'
                )}
              >
                {req.text}
                <span className="sr-only">
                  {req.met ? ' - Requisito cumplido' : ' - Requisito no cumplido'}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )

  if (!hasLabel) {
    return <div className={className}>{content}</div>
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
      {content}
    </FormFieldWithTooltip>
  )
}

