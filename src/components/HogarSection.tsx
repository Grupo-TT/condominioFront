'use client'

import { useState, useRef, useLayoutEffect } from 'react'
import { motion } from 'motion/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Users, PawPrint } from 'lucide-react'
import { MiembrosTab } from './MiembrosTab'
import { MascotasTab } from './MascotasTab'

export function HogarSection() {
  const [activeTab, setActiveTab] = useState('miembros')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    const tabs = ['miembros', 'mascotas']
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
              value="miembros"
              ref={el => {
                tabRefs.current[0] = el
              }}
              className="relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent rounded-none border-0 data-[state=active]:shadow-none"
            >
              <Users className="w-4 h-4" />
              Miembros
            </TabsTrigger>
            <TabsTrigger 
              value="mascotas"
              ref={el => {
                tabRefs.current[1] = el
              }}
              className="relative z-10 flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 data-[state=active]:text-green-800 data-[state=active]:bg-transparent rounded-none border-0 data-[state=active]:shadow-none"
            >
              <PawPrint className="w-4 h-4" />
              Mascotas
            </TabsTrigger>
            
            <motion.div
              className="absolute bottom-0 z-20 h-0.5 bg-green-800"
              layoutId="hogar-underline"
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
        
        <TabsContent value="miembros" className="mt-6">
          <MiembrosTab />
        </TabsContent>

        <TabsContent value="mascotas" className="mt-6">
          <MascotasTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}

