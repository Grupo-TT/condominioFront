'use client'

import { useEffect, useRef, useState } from 'react'

interface TabSliderIndicatorProps {
  /** El valor del tab activo (debe coincidir con el value del TabsTrigger) */
  activeTab: string
  /** Clase CSS adicional para personalizar el estilo del indicador */
  className?: string
}

/**
 * Componente de indicador deslizante para tabs
 * 
 * Crea un indicador que se desliza suavemente hasta el tab activo.
 * 
 * @example
 * <TabsList className="relative [&_[data-state=active]]:bg-transparent [&_[data-state=active]]:shadow-none">
 *   <TabSliderIndicator activeTab={activeTabValue} />
 *   <TabsTrigger value="tab1" data-tab-value="tab1">Tab 1</TabsTrigger>
 *   <TabsTrigger value="tab2" data-tab-value="tab2">Tab 2</TabsTrigger>
 * </TabsList>
 */
export function TabSliderIndicator({ activeTab, className = '' }: TabSliderIndicatorProps) {
  const [indicatorStyle, setIndicatorStyle] = useState<{ 
    left: number
    width: number
    height: number
    top: number
  }>({ 
    left: 0, 
    width: 0, 
    height: 0,
    top: 0 
  })
  const indicatorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const updateIndicatorPosition = () => {
      // Encontrar el TabsList (el padre del indicador)
      const tabsList = indicatorRef.current?.parentElement as HTMLElement
      if (!tabsList) return

      // Buscar el tab activo usando el atributo data-tab-value
      const activeButton = tabsList.querySelector(
        `[data-tab-value="${activeTab}"]`
      ) as HTMLElement
      
      if (!activeButton) return

      // Calcular posiciones relativas
      const tabsListRect = tabsList.getBoundingClientRect()
      const activeButtonRect = activeButton.getBoundingClientRect()

      setIndicatorStyle({
        left: activeButtonRect.left - tabsListRect.left,
        width: activeButtonRect.width,
        height: activeButtonRect.height,
        top: activeButtonRect.top - tabsListRect.top,
      })
    }

    // Actualizar posición inicial
    updateIndicatorPosition()

    // Actualizar en resize de ventana
    window.addEventListener('resize', updateIndicatorPosition)
    
    // Pequeño delay para asegurar que el DOM esté completamente renderizado
    const timeout = setTimeout(updateIndicatorPosition, 10)

    return () => {
      window.removeEventListener('resize', updateIndicatorPosition)
      clearTimeout(timeout)
    }
  }, [activeTab])

  return (
    <div
      ref={indicatorRef}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    >
      <div
        className={`absolute bg-background rounded-md shadow-xs shadow-black/5 transition-all duration-300 ease-in-out z-0 ${className}`}
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          height: `${indicatorStyle.height}px`,
          top: `${indicatorStyle.top}px`,
        }}
      />
    </div>
  )
}

