// src/app/(auth)/login/page.tsx
'use client';

import Image from 'next/image';
import { useState } from 'react';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail02Icon, LockPasswordIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { Switch } from '@/components/ui/switch';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const { login } = useAuth();

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'El correo es obligatorio.';
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    return emailRegex.test(value) ? '' : 'Ingresa un correo electrónico válido.';
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      return 'La contraseña es obligatoria.';
    }
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const emailValidation = validateEmail(username);
    const passwordValidation = validatePassword(password);

    setEmailError(emailValidation);
    setPasswordError(passwordValidation);

    if (emailValidation || passwordValidation) {
      return;
    }

    setIsLoading(true);

    try {
      await login({ username, password, rememberMe });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Video de fondo que ocupa toda la pantalla */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover'
          }}
        >
          <source src="/videos/gradient-bg.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Left side - Login Form */}
        <div className="flex flex-col gap-6 p-8 md:p-12 lg:p-16 text-base md:text-lg">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="/login" className="flex items-center gap-3 text-foreground font-normal">
              <div className="flex size-9 items-center justify-center rounded-lg p-1.5" style={{ backgroundColor: '#445D4E' }}>
                <Image
                  src="/logoFondo.svg"
                  alt="Flor Digital Logo"
                  width={28}
                  height={28}
                  className="rounded-sm"
                />
              </div>
              <span className="text-base md:text-lg font-medium text-gray-600">Flor Digital</span>
            </a>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm space-y-4">
              <div className="space-y-4 text-center mb-8">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Accede al Portal del Condominio</h1>
                <p className="text-muted-foreground text-sm">
                  Consulta información, gestiona tus actividades y mantente conectado con tu comunidad.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FieldGroup className="space-y-0">

                  <Field className="mb-0 gap-2">
                    <FieldLabel className="font-normal text-gray-600" htmlFor="email">Correo electrónico</FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HugeiconsIcon icon={Mail02Icon} size={20} className="text-gray-400" strokeWidth={1.5} />
                      </div>
                      <Input
                        id="email"
                        type="email"
                        placeholder="usuario@example.com"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                        }}
                        required
                        disabled={isLoading}
                        className={`h-12 text-sm pl-10 bg-white/30 border-[1.5px] ${emailError ? 'border-red-400 focus:ring-red-400/60' : 'border-gray-300/70 focus:ring-primary/50'} rounded-xl focus:ring-2 focus:ring-offset-0 shadow-none`}
                      />
                    </div>
                    {emailError && (
                      <p className="text-xs text-red-500 -mt-1" role="alert">
                        {emailError}
                      </p>
                    )}
                  </Field>

                  <Field className="mt-0 gap-2">
                    <div className="flex items-center">
                      <FieldLabel className="font-normal text-gray-600" htmlFor="password">Contraseña</FieldLabel>
                      <a
                        href="/recuperar-password"
                        className="ml-auto text-sm text-primary underline-offset-4 hover:underline"
                      >
                        ¿Olvidaste tu contraseña?
                      </a>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HugeiconsIcon icon={LockPasswordIcon} size={20} className="text-gray-400" strokeWidth={1.5} />
                      </div>
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                        placeholder="Ingresa tu contraseña"
                        required
                        disabled={isLoading}
                        className={`h-12 text-sm pl-10 pr-10 bg-white/30 border-[1.5px] ${passwordError ? 'border-red-400 focus:ring-red-400/60' : 'border-gray-300/70 focus:ring-primary/50'} rounded-xl focus:ring-2 focus:ring-offset-0 shadow-none`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <HugeiconsIcon
                            icon={ViewOffIcon}
                            size={20}
                            className="text-gray-400 hover:text-foreground transition-colors"
                            strokeWidth={1.5}
                          />
                        ) : (
                          <HugeiconsIcon
                            icon={ViewIcon}
                            size={20}
                            className="text-gray-400 hover:text-foreground transition-colors"
                            strokeWidth={1.5}
                          />
                        )}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-xs text-red-500 -mt-1" role="alert">
                        {passwordError}
                      </p>
                    )}
                  </Field>
                  <div className="flex justify-between items-center w-full -mt-3 mb-4">
                    <label
                      htmlFor="rememberMe"
                      className={`text-sm cursor-pointer transition-colors ${rememberMe ? 'text-primary font-medium' : 'text-gray-700 opacity-80'}`}
                    >
                      Recordar mis datos de acceso
                    </label>
                    <Switch
                      id="rememberMe"
                      checked={rememberMe}
                      onCheckedChange={setRememberMe}
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full py-4 h-12 text-base rounded-xl"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      'Iniciar sesión'
                    )}
                  </Button>
                </FieldGroup>
              </form>

            </div>
          </div>
        </div>

        {/* Right side - Image Container */}
        <div className="relative hidden lg:block">
          <div className="absolute inset-3 rounded-xl overflow-hidden">

            <Image
              src="/loginImg.webp"
              alt="Ilustración de acceso"
              fill
              priority
              className="object-cover"
            />

          </div>
        </div>
      </div>
    </div>
  );
}