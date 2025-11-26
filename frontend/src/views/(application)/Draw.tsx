import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDrawing } from '../../hooks/useDrawing';

interface DrawEvent {
  type: 'start' | 'draw' | 'end';
  x: number;
  y: number;
  userId: string;
  strokeId: string;
  color?: string;
  size?: number;
}

interface ActiveStroke {
  strokeId: string;
  userId: string;
  points: { x: number; y: number }[];
  color: string;
  size: number;
  lastPoint?: { x: number; y: number };
}

const Draw = () => {
  const { brushColor, brushSize } = useDrawing();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [user] = useState(() => `user-${Math.random().toString(36).substr(2, 9)}`);
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);
  const activeStrokes = useRef<Map<string, ActiveStroke>>(new Map());

  useEffect(() => {
    const handleDrawEvent = (event: DrawEvent) => {
      const strokes = activeStrokes.current;

      if (event.type === 'start') {
        strokes.set(event.strokeId, {
          strokeId: event.strokeId,
          userId: event.userId,
          points: [{ x: event.x, y: event.y }],
          color: event.color || (event.userId === user ? brushColor : '#dc2626'),
          size: event.size || (event.userId === user ? brushSize : 2)
        });
      } else if (event.type === 'draw') {
        const stroke = strokes.get(event.strokeId);
        if (stroke) {
          stroke.points.push({ x: event.x, y: event.y });
        }
      } else if (event.type === 'end') {
        console.log(`Stroke ${event.strokeId} completed`);
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      strokes.forEach(stroke => {
        if (stroke.points.length < 2) return;
        
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
        
        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }
        
        ctx.stroke();
      });
    };
  
    const websocket = new WebSocket(`ws://localhost:1337/draw?id=${user}`);
    
    websocket.onopen = () => {
      console.log('Connected to drawing server');
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Received WebSocket message:', data);

        if (data.type === 'connected') {
          console.log('Connection confirmed, connected users:', data.connectedCount);
          return;
        }

        if (data.type === 'start' || data.type === 'draw' || data.type === 'end') {
          handleDrawEvent(data);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    return () => websocket.close();
  }, [user, brushColor, brushSize]);

  // Resize canvas to match window size
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    
    // Redraw all active strokes
    activeStrokes.current.forEach(stroke => {
      if (stroke.points.length < 2) return;
      
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      
      ctx.stroke();
    });
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get the actual display size
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    // Set the internal size to match the display size
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    // Scale the context to match device pixel ratio
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Redraw all strokes after resize
    redrawCanvas();
  }, [redrawCanvas]);

  useEffect(() => {
    // Initial resize
    resizeCanvas();

    // Add resize listener
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [resizeCanvas]);

  const sendDrawEvent = (type: DrawEvent['type'], x: number, y: number, strokeId: string) => {
    const message = {
      type,
      x,
      y,
      userId: user,
      strokeId,
      color: brushColor,
      size: brushSize
    };
    
    console.log('Sending draw event:', message);
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not ready, state:', ws?.readyState);
    }
  };

  const handleLocalDrawEvent = (event: DrawEvent) => {
    console.log('handleLocalDrawEvent called with:', event);
    const strokes = activeStrokes.current;
    console.log('Current strokes before update:', Array.from(strokes.keys()));

    if (event.type === 'start') {
      strokes.set(event.strokeId, {
        strokeId: event.strokeId,
        userId: event.userId,
        points: [{ x: event.x, y: event.y }],
        color: event.color || (event.userId === user ? brushColor : '#dc2626'),
        size: event.size || (event.userId === user ? brushSize : 2)
      });
      console.log(`Added new stroke ${event.strokeId} for user ${event.userId}`);
    } else if (event.type === 'draw') {
      const stroke = strokes.get(event.strokeId);
      if (stroke) {
        stroke.points.push({ x: event.x, y: event.y });
        console.log(`Added point to stroke ${event.strokeId}, total points: ${stroke.points.length}`);
      } else {
        console.warn(`Stroke ${event.strokeId} not found for draw event`);
      }
    } else if (event.type === 'end') {
      console.log(`Stroke ${event.strokeId} completed`);
    
    }

    console.log('Current strokes after update:', Array.from(strokes.keys()));

    // Use the shared redrawCanvas function
    redrawCanvas();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const strokeId = `${user}-${Date.now()}`;
    
    setIsDrawing(true);
    setCurrentStrokeId(strokeId);
    sendDrawEvent('start', x, y, strokeId);
    handleLocalDrawEvent({ type: 'start', x, y, userId: user, strokeId });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentStrokeId) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    sendDrawEvent('draw', x, y, currentStrokeId);
    handleLocalDrawEvent({ type: 'draw', x, y, userId: user, strokeId: currentStrokeId });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!currentStrokeId) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsDrawing(false);
    sendDrawEvent('end', x, y, currentStrokeId);
    handleLocalDrawEvent({ type: 'end', x, y, userId: user, strokeId: currentStrokeId });
    setCurrentStrokeId(null);
  };

  return (
    <div className="min-h-screen w-full overflow-auto bg-gray-900 ml-16">
    
        <div className="text-sm text-gray-300 p-4">
          User ID: {user} | Drawing: {isDrawing ? 'Yes' : 'No'} | Color: {brushColor} | Size: {brushSize}px
        </div>
    
      
   
      <div className="p-4">
        <div className="border-2 border-gray-600 rounded-lg overflow-hidden shadow-2xl">
          <canvas
            ref={canvasRef}
            width={2400}
            height={1600}
            className="cursor-crosshair bg-gray-800 block"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={() => setIsDrawing(false)}
          />
        </div>
      </div>
    </div>
  );
};

export default Draw;