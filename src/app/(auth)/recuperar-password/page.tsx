'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { HugeiconsIcon } from '@hugeicons/react';
import { Mail02Icon, RecoveryMailIcon } from '@hugeicons/core-free-icons';
import { Building2, Loader2 } from 'lucide-react';

export default function RecoverPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      return 'El correo es obligatorio.';
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    return emailRegex.test(value) ? '' : 'Ingresa un correo electrónico válido.';
  };

  const canSubmit = useMemo(() => {
    return !validateEmail(email) && !isLoading;
  }, [email, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const emailValidation = validateEmail(email);
    setEmailTouched(true);
    setEmailError(emailValidation);

    if (emailValidation) {
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push('/recuperar-password/otp');
    }, 800);
  };

  return (
    <div className="relative min-h-screen">
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
            objectFit: 'cover',
          }}
        >
          <source src="/videos/gradient-bg.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>
      </div>

      <div className="grid min-h-screen lg:grid-cols-2">
        <div className="flex flex-col gap-6 p-8 md:p-12 lg:p-16 text-base md:text-lg">
          <div className="flex justify-center gap-2 md:justify-start">
            <a href="/login" className="flex items-center gap-3 text-foreground font-normal">
              <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
                <Building2 className="size-6" />
              </div>
              <span className="text-base md:text-lg font-medium text-gray-600">Flor Digital</span>
            </a>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="w-full max-w-sm space-y-6">
              <div className="space-y-4 text-center mb-8">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm">
                  <HugeiconsIcon icon={RecoveryMailIcon} size={26} strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Recupera tu contraseña</h1>
                <p className="text-muted-foreground text-sm">
                  Ingresa el correo asociado a tu cuenta. Te enviaremos un código de verificación para continuar.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <FieldGroup className="space-y-0">
                  <Field className="mb-0">
                    <FieldLabel className="font-normal text-gray-600" htmlFor="recovery-email">
                      Correo electrónico
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HugeiconsIcon icon={Mail02Icon} size={20} className="text-gray-400" strokeWidth={1.5} />
                      </div>
                      <Input
                        id="recovery-email"
                        type="email"
                        placeholder="usuario@example.com"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          if (!emailTouched) {
                            setEmailTouched(true);
                          }
                          if (emailTouched) {
                            setEmailError(validateEmail(event.target.value));
                          }
                        }}
                        onBlur={() => {
                          setEmailTouched(true);
                          setEmailError(validateEmail(email));
                        }}
                        required
                        disabled={isLoading}
                        className={`h-12 text-sm pl-10 bg-white/30 border-[1.5px] ${emailError && emailTouched ? 'border-red-400 focus:ring-red-400/60' : 'border-gray-300/70 focus:ring-primary/50'} rounded-xl focus:ring-2 focus:ring-offset-0 shadow-none`}
                      />
                    </div>
                    {emailError && emailTouched && (
                      <p className="text-xs text-red-500 -mt-1" role="alert">
                        {emailError}
                      </p>
                    )}
                  </Field>
                </FieldGroup>

                <Button type="submit" className="w-full py-4 h-12 text-base rounded-xl" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando código...
                    </>
                  ) : (
                    'Enviar código'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                ¿Recordaste tu contraseña?{' '}
                <a href="/login" className="underline underline-offset-4">
                  Volver al inicio de sesión
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-3 rounded-xl overflow-hidden">
            <Image src="/loginImg.svg" alt="Ilustración de recuperación" fill priority className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
