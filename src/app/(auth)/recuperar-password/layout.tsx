'use client';

import { PasswordRecoveryProvider } from '@/contexts/PasswordRecoveryContext';

export default function RecoverPasswordLayout({ children }: { children: React.ReactNode }) {
  return <PasswordRecoveryProvider>{children}</PasswordRecoveryProvider>;
}
