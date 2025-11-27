import React, { useState } from 'react'
import type { ReactNode } from 'react'
import { DrawingContext, type DrawingContextType } from '../contexts/DrawingContext'

interface DrawingProviderProps {
  children: ReactNode
}

const DrawingProvider: React.FC<DrawingProviderProps> = ({ children }) => {
  const [brushColor, setBrushColor] = useState('#2563eb')
  const [brushSize, setBrushSize] = useState(2)
  const [currentTool, setCurrentTool] = useState<'brush' | 'eraser'>('brush')

  const value: DrawingContextType = {
    brushColor,
    brushSize,
    currentTool,
    setBrushColor,
    setBrushSize,
    setCurrentTool
  }

  return (
    <DrawingContext.Provider value={value}>
      {children}
    </DrawingContext.Provider>
  )
}

export default DrawingProvider