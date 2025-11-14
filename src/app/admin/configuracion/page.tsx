'use client'

import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { FormInput, FormSelect, PasswordStrengthInput, type SelectOption } from '@/components/forms'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Scrollspy } from '@/components/ui/scrollspy'
import { ArrowRight } from 'lucide-react'
import { HugeiconsIcon } from '@hugeicons/react'
import { ResetPasswordIcon, SquareLockPasswordIcon, PassportIcon, UserListIcon, TelephoneIcon, MailAtSign01Icon, Profile02Icon, Door01Icon, Edit02Icon } from '@hugeicons/core-free-icons'
import { useAuth } from '@/contexts/AuthContext'

// Esquemas de validación
const personalInfoSchema = z.object({
  primerNombre: z.string().min(1, 'El primer nombre es requerido'),
  segundoNombre: z.string().optional(),
  primerApellido: z.string().min(1, 'El primer apellido es requerido'),
  segundoApellido: z.string().optional(),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  correo: z.string().email('Correo electrónico inválido'),
  tipoDocumento: z.string().min(1, 'El tipo de documento es requerido'),
  numeroDocumento: z.string().min(1, 'El número de documento es requerido'),
})

const passwordSchema = z.object({
  contraseñaActual: z.string().min(1, 'La contraseña actual es requerida'),
  nuevaContraseña: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/[A-Z]/, 'Debe incluir al menos una letra mayúscula')
    .regex(/[0-9]/, 'Debe incluir al menos un número')
    .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, 'Debe incluir al menos un carácter especial'),
  confirmarContraseña: z.string().min(1, 'Debe confirmar la nueva contraseña'),
}).refine((data) => data.nuevaContraseña === data.confirmarContraseña, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmarContraseña'],
})

type PersonalInfoFormData = z.infer<typeof personalInfoSchema>
type PasswordFormData = z.infer<typeof passwordSchema>

const tipoDocumentoOptions: SelectOption[] = [
  { value: 'CEDULA_DE_CIUDADANIA', label: 'Cédula de Ciudadanía' },
  { value: 'CEDULA_DE_EXTRANJERIA', label: 'Cédula de Extranjería' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
]

// Datos mock (se reemplazarán con datos reales de la API)
const mockAdminData = {
  primerNombre: 'Juan',
  segundoNombre: 'Carlos',
  primerApellido: 'Pérez',
  segundoApellido: 'García',
  telefono: '3001234567',
  correo: 'juan.perez@admin.com',
  tipoDocumento: 'CEDULA_DE_CIUDADANIA',
  numeroDocumento: '1234567890',
  ultimaModificacionContraseña: '15 de marzo de 2024',
}

export default function ConfiguracionPage() {
  const { logout } = useAuth()
  const parentRef = useRef<HTMLDivElement | null>(null)
  const [isPersonalInfoSheetOpen, setIsPersonalInfoSheetOpen] = useState(false)
  const [isPasswordSheetOpen, setIsPasswordSheetOpen] = useState(false)
  const [showPersonalInfoErrors, setShowPersonalInfoErrors] = useState(false)
  const [showPasswordErrors, setShowPasswordErrors] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const nav = [
    {
      id: 'informacion-personal',
      label: 'Información Personal',
    },
    {
      id: 'seguridad',
      label: 'Seguridad',
    },
  ]

  // Formulario de información personal
  const personalInfoForm = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    mode: 'onChange',
    defaultValues: {
      primerNombre: mockAdminData.primerNombre,
      segundoNombre: mockAdminData.segundoNombre,
      primerApellido: mockAdminData.primerApellido,
      segundoApellido: mockAdminData.segundoApellido,
      telefono: mockAdminData.telefono,
      correo: mockAdminData.correo,
      tipoDocumento: mockAdminData.tipoDocumento,
      numeroDocumento: mockAdminData.numeroDocumento,
    },
  })

  // Formulario de contraseña
  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    mode: 'onChange',
    defaultValues: {
      contraseñaActual: '',
      nuevaContraseña: '',
      confirmarContraseña: '',
    },
  })

  const handlePersonalInfoSubmit = (data: PersonalInfoFormData) => {
    // Aquí se integrará con la API
    console.log('Datos de información personal:', data)
    setIsPersonalInfoSheetOpen(false)
    setShowPersonalInfoErrors(false)
  }

  const handlePasswordSubmit = (data: PasswordFormData) => {
    // Aquí se integrará con la API
    console.log('Datos de contraseña:', data)
    setIsPasswordSheetOpen(false)
    setShowPasswordErrors(false)
    passwordForm.reset()
  }

  const getTipoDocumentoLabel = (value: string) => {
    return tipoDocumentoOptions.find(opt => opt.value === value)?.label || value
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/admin/dashboard">
                  Dashboard Admin
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Configuración</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex flex-1 flex-col gap-6 p-6 overflow-hidden min-h-0">
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
            </div>
          </div>

          <div className="flex grow gap-6 overflow-hidden min-h-0">
            {/* Navegación lateral */}
            <div className="flex flex-col w-[200px] flex-shrink-0">
              <Scrollspy offset={50} targetRef={parentRef} className="flex flex-col gap-2.5">
                {nav.map((item) => (
                  <Button
                    key={item.id}
                    variant="ghost"
                    data-scrollspy-anchor={item.id}
                    className="w-full justify-start h-10 px-3 text-sm font-normal cursor-pointer hover:bg-gray-50"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'inherit',
                    }}
                    data-active-style="true"
                    type="button"
                  >
                    {item.label}
                  </Button>
                ))}
              </Scrollspy>
            </div>

            <Separator orientation="vertical" className="h-auto" />

            {/* Contenido scrollable */}
            <div className="grow overflow-hidden min-h-0">
              <ScrollArea className="h-full pe-5 -me-5" viewportRef={parentRef}>
                <div className="space-y-8">
                  {/* Sección de Información Personal */}
                  <div id="informacion-personal" className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">Información Personal</h2>
                      <p className="text-sm text-gray-500">
                        Gestiona tu información personal y de contacto.
                      </p>
                    </div>
                    <Card className="gap-3">
                      <CardHeader className="!py-0">
                        <div className="flex items-center justify-between">
                          <CardTitle>Mi Perfil</CardTitle>
                          <Button
                            variant="outline"
                            onClick={() => setIsPersonalInfoSheetOpen(true)}
                            className="gap-2 h-10"
                          >
                            <HugeiconsIcon icon={Edit02Icon} size={18} className="text-gray-700" />
                            Editar
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Nombre Completo */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100/90 flex items-center justify-center flex-shrink-0">
                              <HugeiconsIcon icon={UserListIcon} size={20} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-gray-900 mb-1">
                                {mockAdminData.primerNombre}
                                {mockAdminData.segundoNombre && ` ${mockAdminData.segundoNombre}`}
                                {` ${mockAdminData.primerApellido}`}
                                {mockAdminData.segundoApellido && ` ${mockAdminData.segundoApellido}`}
                              </p>
                              <p className="text-sm text-gray-500">Nombre Completo</p>
                            </div>
                          </div>

                          {/* Teléfono */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100/90 flex items-center justify-center flex-shrink-0">
                              <HugeiconsIcon icon={TelephoneIcon} size={20} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-gray-900 mb-1">{mockAdminData.telefono}</p>
                              <p className="text-sm text-gray-500">Teléfono</p>
                            </div>
                          </div>

                          {/* Correo Electrónico */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100/90 flex items-center justify-center flex-shrink-0">
                              <HugeiconsIcon icon={MailAtSign01Icon} size={20} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-gray-900 mb-1">{mockAdminData.correo}</p>
                              <p className="text-sm text-gray-500">Correo Electrónico</p>
                            </div>
                          </div>

                          {/* Documento */}
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-lg bg-gray-100/90 flex items-center justify-center flex-shrink-0">
                              <HugeiconsIcon icon={Profile02Icon} size={20} className="text-gray-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-base font-semibold text-gray-900 mb-1">
                                {getTipoDocumentoLabel(mockAdminData.tipoDocumento)} - {mockAdminData.numeroDocumento}
                              </p>
                              <p className="text-sm text-gray-500">Documento</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sección de Seguridad */}
                  <div id="seguridad" className="space-y-6">
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-gray-900">Seguridad</h2>
                      <p className="text-sm text-gray-500">
                        Gestiona la seguridad de tu cuenta y contraseña.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      {/* Modificar Contraseña */}
                      <Card 
                        className="cursor-pointer shadow-none hover:shadow-sm transition-shadow border border-gray-200"
                        onClick={() => setIsPasswordSheetOpen(true)}
                      >
                        <CardContent className="p-0 px-5">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <HugeiconsIcon icon={ResetPasswordIcon} size={23} className="text-gray-700 flex-shrink-0" />
                                <h3 className="text-base font-bold text-gray-900">Modificar Contraseña</h3>
                              </div>
                              <p className="text-sm text-gray-500">
                                Actualiza tu contraseña para mantener tu cuenta segura.{' '}
                                <span className="font-semibold" style={{ color: '#4C6C5A' }}>Última modificación: {mockAdminData.ultimaModificacionContraseña}</span>
                              </p>
                            </div>
                            <ArrowRight className="w-6 h-5 text-gray-500 flex-shrink-0 mr-2" strokeWidth={2} />
                          </div>
                        </CardContent>
                      </Card>

                      {/* Cerrar Sesión */}
                      <Card 
                        className="cursor-pointer shadow-none hover:shadow-sm transition-shadow border border-gray-200"
                        onClick={() => setShowLogoutDialog(true)}
                      >
                        <CardContent className="p-0 px-5">
                          <div className="flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <HugeiconsIcon icon={Door01Icon} size={23} className="text-red-800 flex-shrink-0" />
                                <h3 className="text-base font-bold text-red-800">Cerrar Sesión</h3>
                              </div>
                              <p className="text-sm text-gray-500">
                                Cierra tu sesión actual y regresa a la pantalla de inicio de sesión.
                              </p>
                            </div>
                            <ArrowRight className="w-6 h-5 text-gray-500 flex-shrink-0 mr-2" strokeWidth={2} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </div>

      {/* Sheet para editar información personal */}
      <Sheet open={isPersonalInfoSheetOpen} onOpenChange={setIsPersonalInfoSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 !rounded-lg !top-2 !bottom-2 !right-2 !h-[calc(100vh-1rem)] overflow-hidden"
          style={{ 
            width: '600px', 
            maxWidth: 'none'
          }}
        >
          <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                <HugeiconsIcon icon={PassportIcon} size={28} style={{ color: '#4C6C5A' }} />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  Editar Información Personal
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  Modifica tu información personal y de contacto.
                </SheetDescription>
              </div>
            </div>
          </div>

          <TooltipProvider>
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto">
                <form
                  id="personal-info-form"
                  onSubmit={personalInfoForm.handleSubmit(handlePersonalInfoSubmit)}
                  className="space-y-6 px-6 pt-6"
                >
                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-gray-500">Información Personal</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <Controller
                        name="primerNombre"
                        control={personalInfoForm.control}
                        render={({ field, fieldState }) => (
                          <FormInput
                            {...field}
                            name="primerNombre"
                            label="Primer Nombre"
                            required={true}
                            placeholder="Ej: Juan"
                            type="text"
                            autoComplete="given-name"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPersonalInfoErrors}
                          />
                        )}
                      />

                      <Controller
                        name="segundoNombre"
                        control={personalInfoForm.control}
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
                            showError={showPersonalInfoErrors}
                          />
                        )}
                      />

                      <Controller
                        name="primerApellido"
                        control={personalInfoForm.control}
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
                            showError={showPersonalInfoErrors}
                          />
                        )}
                      />

                      <Controller
                        name="segundoApellido"
                        control={personalInfoForm.control}
                        render={({ field, fieldState }) => (
                          <FormInput
                            {...field}
                            name="segundoApellido"
                            label="Segundo Apellido"
                            placeholder="Ej: García"
                            type="text"
                            autoComplete="family-name"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPersonalInfoErrors}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-gray-500">Información de Contacto</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <Controller
                        name="telefono"
                        control={personalInfoForm.control}
                        render={({ field, fieldState }) => (
                          <FormInput
                            {...field}
                            name="telefono"
                            label="Teléfono"
                            required={true}
                            placeholder="Ej: 3001234567"
                            type="number"
                            autoComplete="tel"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPersonalInfoErrors}
                            className="[&_input]:[-moz-appearance:textfield] [&_input]:[&::-webkit-outer-spin-button]:appearance-none [&_input]:[&::-webkit-inner-spin-button]:appearance-none"
                          />
                        )}
                      />

                      <Controller
                        name="correo"
                        control={personalInfoForm.control}
                        render={({ field, fieldState }) => (
                          <FormInput
                            {...field}
                            name="correo"
                            label="Correo Electrónico"
                            required={true}
                            placeholder="Ej: juan.perez@email.com"
                            type="email"
                            autoComplete="email"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPersonalInfoErrors}
                            disabled={true}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div className="space-y-6">
                    <h3 className="text-sm font-medium text-gray-500">Documento de Identidad</h3>
                    <div className="grid grid-cols-2 gap-6">
                      <Controller
                        name="tipoDocumento"
                        control={personalInfoForm.control}
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
                            showError={showPersonalInfoErrors}
                          />
                        )}
                      />

                      <Controller
                        name="numeroDocumento"
                        control={personalInfoForm.control}
                        render={({ field, fieldState }) => (
                          <FormInput
                            {...field}
                            name="numeroDocumento"
                            label="Número de Documento"
                            required={true}
                            placeholder="Ej: 1234567890"
                            type="text"
                            autoComplete="off"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPersonalInfoErrors}
                          />
                        )}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                <Button
                  variant="outline"
                  className="flex-1 h-10 font-medium"
                  onClick={() => setIsPersonalInfoSheetOpen(false)}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="personal-info-form"
                  className="flex-1 h-10 font-medium"
                  onClick={() => setShowPersonalInfoErrors(true)}
                >
                  Guardar Cambios
                </Button>
              </SheetFooter>
            </div>
          </TooltipProvider>
        </SheetContent>
      </Sheet>

      {/* Sheet para modificar contraseña */}
      <Sheet open={isPasswordSheetOpen} onOpenChange={setIsPasswordSheetOpen}>
        <SheetContent
          side="right"
          className="data-[state=open]:duration-300 data-[state=closed]:duration-250 flex flex-col p-0 !rounded-lg !top-2 !bottom-2 !right-2 !h-[calc(100vh-1rem)] overflow-hidden"
          style={{ 
            width: '520px', 
            maxWidth: 'none'
          }}
        >
          {/* Header con icono */}
          <div className="px-6 pt-6 pb-5 border-b border-gray-100 rounded-t-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center flex-shrink-0 shadow-sm">
                <HugeiconsIcon icon={ResetPasswordIcon} size={28} style={{ color: '#4C6C5A' }} />
              </div>
              <div className="flex-1">
                <SheetTitle className="text-base font-semibold text-gray-900 mb-1">
                  Modificar Contraseña
                </SheetTitle>
                <SheetDescription className="text-sm text-gray-500">
                  Actualiza tu contraseña para mantener tu cuenta segura.
                </SheetDescription>
              </div>
            </div>
          </div>

          <TooltipProvider>
            <div className="flex flex-col flex-1 min-h-0">
              <div className="flex-1 overflow-y-auto">
                <form
                  id="password-form"
                  onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
                  className="px-6 pt-6 pb-4"
                >
                  <div className="space-y-5">
                    {/* Sección de contraseña actual */}
                    <div className="space-y-2">
                      <Controller
                        name="contraseñaActual"
                        control={passwordForm.control}
                        render={({ field, fieldState }) => (
                          <FormInput
                            {...field}
                            name="contraseñaActual"
                            label="Contraseña Actual"
                            required={true}
                            placeholder="Ingresa tu contraseña actual"
                            type="password"
                            autoComplete="current-password"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPasswordErrors}
                            startIcon={<HugeiconsIcon icon={SquareLockPasswordIcon} size={16} />}
                          />
                        )}
                      />
                    </div>

                    <Separator className="my-6" />

                    {/* Sección de nueva contraseña */}
                    <div className="space-y-2">
                      <Controller
                        name="nuevaContraseña"
                        control={passwordForm.control}
                        render={({ field, fieldState }) => (
                          <PasswordStrengthInput
                            {...field}
                            name="nuevaContraseña"
                            label="Nueva Contraseña"
                            required={true}
                            placeholder="Ingresa tu nueva contraseña"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPasswordErrors}
                            startIcon={<HugeiconsIcon icon={SquareLockPasswordIcon} size={16} />}
                          />
                        )}
                      />
                    </div>

                    {/* Sección de confirmar contraseña */}
                    <div className="space-y-2 pt-2">
                      <Controller
                        name="confirmarContraseña"
                        control={passwordForm.control}
                        render={({ field, fieldState }) => (
                          <FormInput
                            {...field}
                            name="confirmarContraseña"
                            label="Confirmar Nueva Contraseña"
                            required={true}
                            placeholder="Confirma tu nueva contraseña"
                            type="password"
                            autoComplete="new-password"
                            invalid={fieldState.invalid}
                            error={fieldState.error?.message}
                            showError={showPasswordErrors}
                            startIcon={<HugeiconsIcon icon={SquareLockPasswordIcon} size={16} />}
                          />
                        )}
                      />
                    </div>
                  </div>
                </form>
              </div>

              <SheetFooter className="flex flex-row gap-3 mt-auto px-6 py-5 border-t border-gray-100 bg-gray-50/50 rounded-b-lg">
                <Button
                  variant="outline"
                  className="flex-1 h-10 font-medium"
                  onClick={() => {
                    setIsPasswordSheetOpen(false)
                    passwordForm.reset()
                  }}
                  type="button"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="password-form"
                  className="flex-1 h-10 font-medium"
                  onClick={() => setShowPasswordErrors(true)}
                >
                  Cambiar Contraseña
                </Button>
              </SheetFooter>
            </div>
          </TooltipProvider>
        </SheetContent>
      </Sheet>

      {/* Diálogo de confirmación para cerrar sesión */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Cerrar sesión?</AlertDialogTitle>
            <AlertDialogDescription>
              Estás a punto de cerrar tu sesión actual. Serás redirigido a la pantalla de inicio de sesión.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={logout} className="bg-red-600 hover:bg-red-800 text-white transition-colors">
              Cerrar Sesión
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

