'use client'

import { Loader2 } from 'lucide-react'

export function LoadingState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <p className="text-sm text-gray-500">Cargando reservas...</p>
      </div>
    </div>
  )
}

