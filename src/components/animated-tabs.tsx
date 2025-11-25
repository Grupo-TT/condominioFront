'use client'

import { ReactNode } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabSliderIndicator } from '@/components/ui/tab-slider-indicator'

interface TabItem {
  value: string
  label: string
  content: ReactNode
}

interface AnimatedTabsProps {
  /** Valor del tab activo */
  value: string
  /** Callback cuando cambia el tab */
  onValueChange: (value: string) => void
  /** Array de tabs con su contenido */
  tabs: TabItem[]
  /** Contenido adicional que aparece junto a las tabs (filtros, botones, etc.) */
  rightContent?: ReactNode
  /** Clase CSS adicional para el contenedor de tabs */
  className?: string
}

/**
 * Componente de tabs con animación de indicador deslizante
 * 
 * @example
 * <AnimatedTabs
 *   value={activeTab}
 *   onValueChange={setActiveTab}
 *   tabs={[
 *     { value: 'tab1', label: 'Tab 1', content: <div>Content 1</div> },
 *     { value: 'tab2', label: 'Tab 2', content: <div>Content 2</div> }
 *   ]}
 *   rightContent={<Button>Action</Button>}
 * />
 */
export function AnimatedTabs({
  value,
  onValueChange,
  tabs,
  rightContent,
  className = 'space-y-4',
}: AnimatedTabsProps) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <div className="flex items-center justify-between">
        <TabsList className="relative [&_[data-state=active]]:bg-transparent [&_[data-state=active]]:shadow-none [&_[role=tab]]:relative [&_[role=tab]]:z-10">
          <TabSliderIndicator activeTab={value} />
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} data-tab-value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {rightContent && (
          <div className="flex items-center gap-3">
            {rightContent}
          </div>
        )}
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

