'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Casa } from '@/types/casa.types';

interface CasaContextType {
  casaCache: Map<string, Casa>;
  setCasaInCache: (numeroCasa: string, casa: Casa) => void;
  getCasaFromCache: (numeroCasa: string) => Casa | undefined;
  clearCasaCache: (numeroCasa?: string) => void;
}

const CasaContext = createContext<CasaContextType | undefined>(undefined);

export function CasaProvider({ children }: { children: React.ReactNode }) {
  const [casaCache] = useState<Map<string, Casa>>(new Map());

  const setCasaInCache = useCallback((numeroCasa: string, casa: Casa) => {
    casaCache.set(numeroCasa, casa);
  }, [casaCache]);

  const getCasaFromCache = useCallback((numeroCasa: string): Casa | undefined => {
    return casaCache.get(numeroCasa);
  }, [casaCache]);

  const clearCasaCache = useCallback((numeroCasa?: string) => {
    if (numeroCasa) {
      casaCache.delete(numeroCasa);
    } else {
      casaCache.clear();
    }
  }, [casaCache]);

  return (
    <CasaContext.Provider
      value={{
        casaCache,
        setCasaInCache,
        getCasaFromCache,
        clearCasaCache,
      }}
    >
      {children}
    </CasaContext.Provider>
  );
}

export function useCasaContext() {
  const context = useContext(CasaContext);
  if (context === undefined) {
    throw new Error('useCasaContext debe ser usado dentro de un CasaProvider');
  }
  return context;
}

