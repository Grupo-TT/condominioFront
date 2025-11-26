'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import { motion } from 'motion/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { HugeiconsIcon } from '@hugeicons/react'
import { Alert02Icon } from '@hugeicons/core-free-icons'
import { FileText } from 'lucide-react'
import { ObligacionesTab } from './ObligacionesTab'
import { MultasTab } from './MultasTab'

export function FinanzasSection() {
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
          <ObligacionesTab />
        </TabsContent>

        <TabsContent value="multas" className="mt-6">
          <MultasTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

