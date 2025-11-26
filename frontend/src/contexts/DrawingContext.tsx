import { createContext } from 'react'

export interface DrawingState {
  brushColor: string
  brushSize: number
  currentTool: 'brush' | 'eraser'
}

export interface DrawingContextType extends DrawingState {
  setBrushColor: (color: string) => void
  setBrushSize: (size: number) => void
  setCurrentTool: (tool: 'brush' | 'eraser') => void
}

export const DrawingContext = createContext<DrawingContextType | undefined>(undefined)