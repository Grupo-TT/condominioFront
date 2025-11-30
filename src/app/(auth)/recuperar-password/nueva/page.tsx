'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { HugeiconsIcon } from '@hugeicons/react';
import { LockPasswordIcon, ResetPasswordIcon, ViewIcon, ViewOffIcon } from '@hugeicons/core-free-icons';
import { Building2, Loader2 } from 'lucide-react';
import { usePasswordRecovery } from '@/contexts/PasswordRecoveryContext';

const mainRequirement = { regex: /.{8,}/, text: 'Debe tener al menos 8 caracteres.' };
const suggestionRequirements = [
  { regex: /(?=.*[a-z])(?=.*[A-Z])/, text: 'Usa letras mayúsculas y minúsculas' },
  { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/, text: 'Incluye un símbolo (#$&)' },
  { regex: /.{12,}/, text: 'Prefiere una contraseña más larga' },
];

export default function RecoverNewPasswordPage() {
  const router = useRouter();
  const { tempCode, tempToken, resetRecovery } = usePasswordRecovery();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const headlineMet = useMemo(() => mainRequirement.regex.test(newPassword), [newPassword]);

  const suggestionChecks = useMemo(() => (
    suggestionRequirements.map((requirement) => ({
      text: requirement.text,
      met: requirement.regex.test(newPassword),
    }))
  ), [newPassword]);

  const suggestionsScore = useMemo(
    () => suggestionChecks.filter((item) => item.met).length,
    [suggestionChecks]
  );

  const barColor = useMemo(() => {
    if (!newPassword) return 'bg-gray-200';
    if (!headlineMet) return 'bg-red-400';
    if (suggestionsScore <= 1) return 'bg-amber-400';
    if (suggestionsScore === 2) return 'bg-yellow-400';
    return 'bg-green-600';
  }, [headlineMet, newPassword, suggestionsScore]);

  const strengthLabel = useMemo(() => {
    if (!newPassword) return 'Empieza a escribir tu contraseña';
    if (!headlineMet) return 'Contraseña muy corta';
    if (suggestionsScore <= 1) return 'Contraseña básica';
    if (suggestionsScore === 2) return 'Contraseña aceptable';
    return 'Contraseña fuerte';
  }, [headlineMet, newPassword, suggestionsScore]);

  const passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  const canSubmit = headlineMet && passwordsMatch && !isLoading;

  const apiUrl = useMemo(() => process.env.NEXT_PUBLIC_API_URL || '', []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (!tempCode || !tempToken) {
      setError('Tu sesión de recuperación expiró. Inicia nuevamente el proceso.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden. Verifica e intenta nuevamente.');
      return;
    }

    setIsLoading(true);
    try {
      await axios.put(
        `${apiUrl}/user/update-password`,
        {
          currentPassword: tempCode,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );
      toast.success('¡Contraseña actualizada correctamente!');
      setTimeout(() => {
        resetRecovery();
        router.push('/login');
      }, 1200);
    } catch (err) {
      const message =
        err && typeof err === 'object' && 'response' in err &&
        (err as { response?: { data?: { message?: string } } }).response?.data?.message
          ? (err as { response?: { data?: { message?: string } } }).response!.data!.message!
          : 'No pudimos actualizar tu contraseña. Intenta nuevamente.';
      setError(message);
    } finally {
      setIsLoading(false);
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
                  <HugeiconsIcon icon={ResetPasswordIcon} size={26} strokeWidth={1.5} />
                </div>
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Crea tu nueva contraseña</h1>
                <p className="text-muted-foreground text-sm">
                  Define una contraseña segura para acceder nuevamente al portal del condominio.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <FieldGroup className="space-y-0">
                  <Field className="mb-0 gap-2">
                    <FieldLabel className="font-normal text-gray-600" htmlFor="new-password">
                      Nueva contraseña
                    </FieldLabel>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HugeiconsIcon icon={LockPasswordIcon} size={20} className="text-gray-400" strokeWidth={1.5} />
                      </div>
                      <Input
                        id="new-password"
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(event) => setNewPassword(event.target.value)}
                        placeholder="Ingresa tu nueva contraseña"
                        required
                        disabled={isLoading}
                        className="h-12 text-sm pl-10 pr-10 bg-white/30 border-[1.5px] border-gray-300/70 rounded-xl focus:ring-2 focus:ring-primary/50 focus:ring-offset-0 shadow-none"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        disabled={isLoading}
                      >
                        <HugeiconsIcon
                          icon={showNewPassword ? ViewOffIcon : ViewIcon}
                          size={20}
                          className="text-gray-400 hover:text-foreground transition-colors"
                          strokeWidth={1.5}
                        />
                      </button>

                      <div className="absolute z-20 mt-3 w-full rounded-2xl border border-white/70 bg-white/95 p-4 text-left text-sm text-gray-600 shadow-xl backdrop-blur group-focus-within:opacity-100 group-focus-within:translate-y-0 group-focus-within:pointer-events-auto opacity-0 translate-y-2 pointer-events-none transition-all duration-200 lg:left-[calc(100%+1rem)] lg:top-0 lg:mt-0 lg:w-80">
                        <p className="text-sm font-semibold text-gray-900 mb-2">{strengthLabel}</p>
                        <div className="flex gap-1 mb-3">
                          {Array.from({ length: 4 }).map((_, index) => (
                            <span
                              key={index}
                              className={`h-1 flex-1 rounded-full ${index < (headlineMet ? suggestionsScore + 1 : 1)
                                ? barColor
                                : 'bg-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="mb-1 text-xs font-semibold text-gray-700">
                          {headlineMet ? 'Mejora tu contraseña con:' : mainRequirement.text}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">También es mejor que tenga:</p>
                        <ul className="space-y-2 text-sm">
                          {suggestionChecks.map((item) => (
                            <li key={item.text} className="flex items-start gap-2">
                              <span className={`mt-1 h-2 w-2 rounded-full ${item.met ? 'bg-blue-500' : 'bg-gray-300'}`} />
                              <span className={item.met ? 'text-gray-400 line-through' : 'text-gray-700'}>
                                {item.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Field>

                  <Field className="mt-0 gap-2">
                    <FieldLabel className="font-normal text-gray-600" htmlFor="confirm-password">
                      Repite tu nueva contraseña
                    </FieldLabel>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HugeiconsIcon icon={LockPasswordIcon} size={20} className="text-gray-400" strokeWidth={1.5} />
                      </div>
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Repite tu nueva contraseña"
                        required
                        disabled={isLoading}
                        className={`h-12 text-sm pl-10 pr-10 bg-white/30 border-[1.5px] ${!passwordsMatch && confirmPassword ? 'border-red-400/80 focus:ring-red-400/50' : 'border-gray-300/70 focus:ring-primary/50'} rounded-xl focus:ring-2 focus:ring-offset-0 shadow-none`}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        disabled={isLoading}
                      >
                        <HugeiconsIcon
                          icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                          size={20}
                          className="text-gray-400 hover:text-foreground transition-colors"
                          strokeWidth={1.5}
                        />
                      </button>
                    </div>
                    {!passwordsMatch && confirmPassword && (
                      <p className="mt-0 text-xs text-red-500">Las contraseñas deben ser iguales.</p>
                    )}
                  </Field>
                </FieldGroup>

                <Button
                  type="submit"
                  className="w-full py-4 h-12 text-base rounded-xl"
                  disabled={!canSubmit}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando cambios...
                    </>
                  ) : (
                    'Actualizar contraseña'
                  )}
                </Button>
              </form>

              <div className="text-center text-sm text-muted-foreground">
                ¿Necesitas ayuda?{' '}
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=condflordelcampo@gmail.com&su=Necesito%20ayuda%20en%20Flor%20Digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  Contacta al administrador (condflordelcampo@gmail.com)
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute inset-3 rounded-xl overflow-hidden">
            <Image src="/loginImg.svg" alt="Ilustración nueva contraseña" fill priority className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
