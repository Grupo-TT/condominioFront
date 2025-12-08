'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PasswordRecoveryContextValue {
  recoveryEmail: string;
  setRecoveryEmail: (email: string) => void;
  tempCode: string;
  setTempCode: (code: string) => void;
  tempToken: string;
  setTempToken: (token: string) => void;
  resetRecovery: () => void;
}

const PasswordRecoveryContext = createContext<PasswordRecoveryContextValue | undefined>(undefined);

export function PasswordRecoveryProvider({ children }: { children: ReactNode }) {
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [tempCode, setTempCode] = useState('');
  const [tempToken, setTempToken] = useState('');

  const resetRecovery = () => {
    setRecoveryEmail('');
    setTempCode('');
    setTempToken('');
  };

  return (
    <PasswordRecoveryContext.Provider
      value={{ recoveryEmail, setRecoveryEmail, tempCode, setTempCode, tempToken, setTempToken, resetRecovery }}
    >
      {children}
    </PasswordRecoveryContext.Provider>
  );
}

export function usePasswordRecovery() {
  const context = useContext(PasswordRecoveryContext);
  if (!context) {
    throw new Error('usePasswordRecovery debe usarse dentro de PasswordRecoveryProvider');
  }
  return context;
}
