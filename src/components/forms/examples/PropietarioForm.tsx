"use client"

import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { propietarioSchema, PropietarioFormData } from '@/lib/validations/propietario.validation'
import { FormInput, FormSelect, type SelectOption } from '../'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { SheetFooter } from '@/components/ui/sheet'
import { TooltipProvider } from '@/components/ui/tooltip'

interface PropietarioFormProps {
  onSubmit: (data: PropietarioFormData) => void
  onCancel?: () => void
}

const tipoDocumentoOptions: SelectOption[] = [
  { value: "CEDULA_DE_CIUDADANIA", label: "Cédula de Ciudadanía" },
  { value: "CEDULA_DE_EXTRANJERIA", label: "Cédula de Extranjería" }
]

const rolOptions: SelectOption[] = [
  { value: "PROPIETARIO", label: "Propietario" },
  { value: "ARRENDATARIO", label: "Arrendatario" }
]

const casaOptions: SelectOption[] = [
  { value: "1", label: "Casa 1" },
  { value: "2", label: "Casa 2" },
  { value: "3", label: "Casa 3" },
  { value: "4", label: "Casa 4" },
  { value: "5", label: "Casa 5" }
]

export function PropietarioForm({ onSubmit, onCancel }: PropietarioFormProps) {
  const [showAllErrors, setShowAllErrors] = useState(false)

  const form = useForm<PropietarioFormData>({
    resolver: zodResolver(propietarioSchema),
    mode: "onChange",
    defaultValues: {
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      tipoDocumento: '',
      numeroDocumento: '',
      correoElectronico: '',
      telefono: '',
      rolEnCasa: '',
      casaAsociada: '',
    }
  })

  const handleFormSubmit = (data: PropietarioFormData) => {
    console.log(data)
    onSubmit(data)
    form.reset()
    setShowAllErrors(true)
  }


  return (
    <TooltipProvider>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <form 
            id="propietario-form"
            onSubmit={form.handleSubmit(handleFormSubmit)} 
            className="space-y-6 px-4"
          >
            {/* Información Personal */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-500">Información Personal</h3>
              <div className="grid grid-cols-2 gap-6">
                <Controller
                  name="primerNombre"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="primerNombre"
                      label="Primer Nombre"
                      required={true}
                      placeholder="Ej: José"
                      type="text"
                      autoComplete="given-name"
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />

                <Controller
                  name="segundoNombre"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="segundoNombre"
                      label="Segundo Nombre"
                      placeholder="Ej: Carlos"
                      type="text"
                      autoComplete="additional-name"
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />

                <Controller
                  name="primerApellido"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="primerApellido"
                      label="Primer Apellido"
                      required={true}
                      placeholder="Ej: Pérez"
                      type="text"
                      autoComplete="family-name"
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />

                <Controller
                  name="segundoApellido"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="segundoApellido"
                      label="Segundo Apellido"
                      placeholder="Ej: Hurtado"
                      type="text"
                      autoComplete="family-name"
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />

                <Controller
                  name="tipoDocumento"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormSelect
                      {...field}
                      name="tipoDocumento"
                      label="Tipo de Documento"
                      required={true}
                      placeholder="Seleccionar tipo"
                      options={tipoDocumentoOptions}
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />

                <Controller
                  name="numeroDocumento"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="numeroDocumento"
                      label="Número de Documento"
                      required={true}
                      placeholder="Ej: 12345678"
                      type="text"
                      autoComplete="off"
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Información de Contacto */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-500">Información de Contacto</h3>
              <div className="grid grid-cols-1 gap-6">
                <Controller
                  name="correoElectronico"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="correoElectronico"
                      label="Correo Electrónico"
                      required={true}
                      placeholder="Ej: jose.perez@email.com"
                      type="email"
                      autoComplete="email"
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />

                <Controller
                  name="telefono"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="telefono"
                      label="Teléfono"
                      required={true}
                      placeholder="Ej: 3001234567"
                      type="tel"
                      autoComplete="tel"
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Información de Propiedad */}
            <div className="space-y-6">
              <h3 className="text-sm font-medium text-gray-500">Información de Propiedad</h3>
              <div className="grid grid-cols-2 gap-6">
                <Controller
                  name="rolEnCasa"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormSelect
                      {...field}
                      name="rolEnCasa"
                      label="Rol en la Casa"
                      required={true}
                      placeholder="Seleccionar rol"
                      options={rolOptions}
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />

                <Controller
                  name="casaAsociada"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormSelect
                      {...field}
                      name="casaAsociada"
                      label="Casa Asociada"
                      required={true}
                      placeholder="Seleccionar casa"
                      options={casaOptions}
                      invalid={fieldState.invalid}
                      error={fieldState.error?.message}
                      showError={showAllErrors}
                    />
                  )}
                />
              </div>
            </div>
          </form>
        </div>
        
        {/* Botones del footer del Sheet */}
        <SheetFooter className="flex flex-row gap-3 mt-auto px-4 pb-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="propietario-form"
            className="flex-1"
            onClick={() => setShowAllErrors(true)}
          >
            Crear Propietario
          </Button>
        </SheetFooter>
      </div>
    </TooltipProvider>
  )
}
