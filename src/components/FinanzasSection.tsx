'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import { motion } from 'motion/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HugeiconsIcon } from '@hugeicons/react'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { FileText } from 'lucide-react'
import { ObligacionesTab } from './ObligacionesTab'
import { MultasTab } from './MultasTab'
import { MultaPropietario, ObligacionPendiente } from '@/types/casa.types'

interface FinanzasSectionProps {
  obligaciones?: ObligacionPendiente[],
  multas?: MultaPropietario[],
  loading?: boolean
}

function TableSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-6">
        <Skeleton className="h-10 w-full max-w-sm" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="border rounded-lg">
        <div className="border-b p-4 bg-gray-50 flex gap-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-4 border-b last:border-0 flex gap-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function FinanzasSection({
  obligaciones = [], multas = [], loading = false
}: FinanzasSectionProps) {
  const [activeTab, setActiveTab] = useState('obligaciones')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const tabs = ['obligaciones', 'multas']
    const activeIndex = tabs.findIndex(tab => tab === activeTab)
    const activeTabElement = tabRefs.current[activeIndex]

    if (activeTabElement) {
      const { offsetLeft, offsetWidth } = activeTabElement

      setUnderlineStyle({
        left: offsetLeft,
        width: offsetWidth
      })
    }
  }, [activeTab])

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b border-gray-200">
          <TabsList className="h-auto bg-transparent p-0 relative rounded-none border-0">
            <TabsTrigger
              value="obligaciones"
              ref={el => {
                tabRefs.current[0] = el
              }}
              className="relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent rounded-none border-0 data-[state=active]:shadow-none"
            >
              <FileText className="w-4 h-4" />
              Obligaciones
            </TabsTrigger>
            <TabsTrigger
              value="multas"
              ref={el => {
                tabRefs.current[1] = el
              }}
              className="relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent rounded-none border-0 data-[state=active]:shadow-none"
            >
              <HugeiconsIcon icon={Alert02Icon} className="w-4 h-4" />
              Multas
            </TabsTrigger>

            <motion.div
              className="absolute bottom-0 z-20 h-0.5 bg-green-800"
              layoutId="finanzas-underline"
              style={{
                left: underlineStyle.left,
                width: underlineStyle.width
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 40
              }}
            />
          </TabsList>
        </div>

        <TabsContent value="obligaciones" className="mt-6">
          {loading ? (
            <TableSkeleton />
          ) : (
            <ObligacionesTab obligaciones={obligaciones} />
          )}
        </TabsContent>

        <TabsContent value="multas" className="mt-6">
          {loading ? (
            <TableSkeleton />
          ) : (
            <MultasTab multas={multas} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

