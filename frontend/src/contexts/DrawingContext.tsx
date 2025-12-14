import { createContext } from 'react'

export interface DrawingState {
  brushColor: string
  brushSize: number
  currentTool: 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line'
}

export interface DrawingContextType extends DrawingState {
  setBrushColor: (color: string) => void
  setBrushSize: (size: number) => void
  setCurrentTool: (tool: 'brush' | 'eraser' | 'rectangle' | 'circle' | 'line') => void
}

export const DrawingContext = createContext<DrawingContextType | undefined>(undefined)