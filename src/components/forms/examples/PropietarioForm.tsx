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
  onSubmit: (data: PropietarioFormData) => Promise<boolean> | boolean
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
  { value: "5", label: "Casa 5" },
  { value: "6", label: "Casa 6" },
  { value: "7", label: "Casa 7" },
  { value: "8", label: "Casa 8" },
  { value: "9", label: "Casa 9" },
  { value: "10", label: "Casa 10" },
  { value: "11", label: "Casa 11" },
  { value: "12", label: "Casa 12" },
  { value: "13", label: "Casa 13" },
  { value: "14", label: "Casa 14" },
  { value: "15", label: "Casa 15" },
  { value: "16", label: "Casa 16" },
  { value: "17", label: "Casa 17" },
  { value: "18", label: "Casa 18" },
  { value: "19", label: "Casa 19" },
  { value: "20", label: "Casa 20" },
  { value: "21", label: "Casa 21" },
  { value: "22", label: "Casa 22" }
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
      email: '',
      telefono: '',
      rolEnCasa: '',
      idCasa: '',
    }
  })

  const selectedRol = form.watch('rolEnCasa')
  const submitLabel = selectedRol === 'ARRENDATARIO'
    ? 'Crear arrendatario'
    : selectedRol === 'PROPIETARIO'
      ? 'Crear propietario'
      : 'Registrar persona'

  const handleFormSubmit = async (data: PropietarioFormData) => {
    const result = await onSubmit(data)
    // Solo resetear el formulario si el submit fue exitoso
    if (result !== false) {
      form.reset()
      setShowAllErrors(false)
    }
  }


  return (
    <TooltipProvider>
      <div className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto">
          <form
            id="propietario-form"
            onSubmit={form.handleSubmit(handleFormSubmit)}
            className="space-y-6 px-6 pt-2"
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
                      inputFilter="letters-only"
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
                      inputFilter="letters-only"
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
                      inputFilter="letters-only"
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
                      inputFilter="letters-only"
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
                      inputFilter="numbers-only"
                    />
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Información de Contacto */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormInput
                      {...field}
                      name="email"
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
                      inputFilter="numbers-only"
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
                  name="idCasa"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <FormSelect
                      {...field}
                      name="idCasa"
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
        <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
          <Button
            variant="outline"
            className="flex-1 h-10 font-medium"
            onClick={onCancel}
            type="button"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="propietario-form"
            className="flex-1 h-10 font-medium"
            onClick={() => setShowAllErrors(true)}
          >
            {submitLabel}
          </Button>
        </SheetFooter>
      </div>
    </TooltipProvider>
  )
}
