'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp';
import { HugeiconsIcon } from '@hugeicons/react';
import { MailOpenIcon } from '@hugeicons/core-free-icons';
import { Building2, Loader2 } from 'lucide-react';
import { usePasswordRecovery } from '@/contexts/PasswordRecoveryContext';

export default function RecoverOtpPage() {
  const router = useRouter();
  const { recoveryEmail, setTempCode, setTempToken } = usePasswordRecovery();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasVerified, setHasVerified] = useState(false);

  useEffect(() => {
    if (!recoveryEmail) {
      router.replace('/recuperar-password');
    }
  }, [recoveryEmail, router]);

  const apiUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || '', []);

  const verifyCode = async (currentCode: string) => {
    if (!recoveryEmail || currentCode.length !== 6) return;
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${apiUrl}/auth/login`,
        { username: recoveryEmail, password: currentCode },
        { withCredentials: false }
      );

      if (!response.data?.token) {
        throw new Error('Respuesta inválida');
      }

      setTempCode(currentCode);
      setTempToken(response.data.token);
      setHasVerified(true);
      router.push('/recuperar-password/nueva');
    } catch (err) {
      toast.error('Código incorrecto');
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length === 6 && !isLoading) {
      await verifyCode(code);
    }
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
              <div className="space-y-3 text-center">
                <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white/80 text-primary shadow-sm">
                  <HugeiconsIcon icon={MailOpenIcon} size={26} strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Verifica tu código</h1>
                <p className="text-muted-foreground text-sm">
                  Hemos enviado un código de 6 dígitos a tu correo. Escríbelo para continuar con el proceso.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <FieldGroup>
                  <Field>
                    <FieldLabel className="sr-only">Código de verificación</FieldLabel>
                    <InputOTP
                      maxLength={6}
                      value={code}
                      onChange={(value) => setCode(value)}
                      disabled={isLoading}
                      containerClassName="flex items-center justify-center gap-4"
                    >
                      <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-gray-300/70 *:data-[slot=input-otp-slot]:bg-white/80 *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:font-semibold">
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator className="text-2xl text-gray-400" />
                      <InputOTPGroup className="gap-2.5 *:data-[slot=input-otp-slot]:h-16 *:data-[slot=input-otp-slot]:w-12 *:data-[slot=input-otp-slot]:rounded-lg *:data-[slot=input-otp-slot]:border *:data-[slot=input-otp-slot]:border-gray-300/70 *:data-[slot=input-otp-slot]:bg-white/80 *:data-[slot=input-otp-slot]:text-xl *:data-[slot=input-otp-slot]:font-semibold">
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </Field>
                </FieldGroup>

                <Button type="submit" className="w-full py-4 h-12 text-base rounded-xl" disabled={isLoading || code.length !== 6 || hasVerified}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verificando...
                    </>
                  ) : (
                    'Verificar código'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                ¿No recibiste el código?{' '}
                <button type="button" className="underline underline-offset-4 text-primary" disabled={isLoading}>
                  Reenviar código
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-3 rounded-xl overflow-hidden">
            <Image src="/loginImg.svg" alt="Ilustración verificación" fill priority className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
