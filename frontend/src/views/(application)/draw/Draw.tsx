import React, { useRef, useEffect, useState, useCallback } from "react";
import { useParams } from "react-router";
import { useDrawing } from "../../../hooks/useDrawing";
import { axiosInstance } from "../../../lib/axios";

type DrawEvent =
  | {
      type: "draw" | "end";
      x: number;
      y: number;
      userId: string;
      strokeId: string;
    }
  | {
      type: "start";
      x: number;
      y: number;
      userId: string;
      strokeId: string;
      color: string;
      size: number;
    };

interface ActiveStroke {
  strokeId: string;
  // userId: string; // Not used currently might be useful later
  points: { x: number; y: number }[];
  color: string;
  size: number;
}

interface Shape {
  id?: string;
  type: 'rectangle' | 'circle' | 'line';
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  color: string;
  strokeWidth: number;
}

interface ImageData {
  id: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

const Draw = () => {
  const { id: imageId } = useParams<{ id: string }>();
  const { brushColor, brushSize, currentTool } = useDrawing();
  const canvasRef = useRef<HTMLCanvasElement>(null); // For strokes
  const shapeCanvasRef = useRef<HTMLCanvasElement>(null); // For shapes
  const [isDrawing, setIsDrawing] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [user] = useState(
    () => `user-${Math.random().toString(36).substr(2, 9)}`,
  );
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);
  const activeStrokes = useRef<Map<string, ActiveStroke>>(new Map());
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [currentShape, setCurrentShape] = useState<Shape | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Fetch image data
  useEffect(() => {
    const fetchImage = async () => {
      if (!imageId) {
        setError("No image ID provided");
        setLoading(false);
        return;
      }

      try {
        const response = await axiosInstance.get(`/images/${imageId}`);
        setImageData(response.data);
        setError(null);
      } catch (err: unknown) {
        console.error("Error fetching image:", err);

        // Type guard for axios error
        const isAxiosError = (
          error: unknown,
        ): error is {
          response?: { status?: number; data?: { error?: string } };
          message?: string;
        } => {
          return typeof error === "object" && error !== null;
        };

        const statusCode = isAxiosError(err) ? err.response?.status : undefined;
        const errorMessage = isAxiosError(err)
          ? err.response?.data?.error || err.message || "Failed to load image"
          : "Failed to load image";

        if (statusCode === 401) {
          setError(
            "Authentication required (401): Please log in to access this image",
          );
        } else if (statusCode === 404) {
          setError(
            "Image not found (404): This image does not exist or you do not have access",
          );
        } else {
          setError(`Failed to load image: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [imageId]);

  // Fetch shapes for the image
  useEffect(() => {
    const fetchShapes = async () => {
      if (!imageId) return;

      try {
        const response = await axiosInstance.get(`/shapes/${imageId}`);
        setShapes(response.data);
      } catch (err) {
        console.error("Error fetching shapes:", err);
      }
    };

    fetchShapes();
  }, [imageId]);

  const drawShape = useCallback((ctx: CanvasRenderingContext2D, shape: Shape) => {
    ctx.strokeStyle = shape.color;
    ctx.lineWidth = shape.strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    const width = shape.endX - shape.startX;
    const height = shape.endY - shape.startY;

    ctx.beginPath();
    if (shape.type === 'rectangle') {
      ctx.rect(shape.startX, shape.startY, width, height);
    } else if (shape.type === 'circle') {
      const centerX = (shape.startX + shape.endX) / 2;
      const centerY = (shape.startY + shape.endY) / 2;
      const radius = Math.sqrt(width * width + height * height) / 2;
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    } else if (shape.type === 'line') {
      ctx.moveTo(shape.startX, shape.startY);
      ctx.lineTo(shape.endX, shape.endY);
    }
    ctx.stroke();
  }, []);

  // Redraw shape canvas (permanent shapes + preview)
  const redrawShapeCanvas = useCallback(() => {
    const canvas = shapeCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw all permanent shapes
    shapes.forEach((shape) => {
      drawShape(ctx, shape);
    });

    // Redraw current shape preview
    if (currentShape) {
      drawShape(ctx, currentShape);
    }
  }, [shapes, currentShape, drawShape]);

  // Redraw shapes whenever they change
  useEffect(() => {
    redrawShapeCanvas();
  }, [redrawShapeCanvas]);

  useEffect(() => {
    const handleDrawEvent = (event: DrawEvent) => {
      const strokes = activeStrokes.current;
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      if (event.type === "start") {
        strokes.set(event.strokeId, {
          strokeId: event.strokeId,
          // userId: event.userId, // Not used currently might be useful later
          points: [{ x: event.x, y: event.y }],
          color: event.color,
          size: event.size,
        });
      } else if (event.type === "draw") {
        const stroke = strokes.get(event.strokeId);
        if (!stroke) {
          console.warn(`Stroke ${event.strokeId} not found for event`, event); // basic error handling
          return;
        }

        if (stroke.points.length > 0) {
          const lastPoint = stroke.points[stroke.points.length - 1];
          stroke.points.push({ x: event.x, y: event.y });

          // Draw only the new segment for efficiency
          ctx.strokeStyle = stroke.color;
          ctx.lineWidth = stroke.size;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.beginPath();
          ctx.moveTo(lastPoint.x, lastPoint.y);
          ctx.lineTo(event.x, event.y);
          ctx.stroke();
        }
      } else if (event.type === "end") {
        console.log(`Stroke ${event.strokeId} completed`);
      }
    };

    if (!imageId) return; // Don't connect if no imageId

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3000";
    const websocket = new WebSocket(`${wsUrl}/draw?imageId=${imageId}`);

    websocket.onopen = (event: Event) => {
      console.log("WebSocket connection opened:", event);
      console.log("Connected to drawing server for image:", imageId);
      setWs(websocket);
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received WebSocket message:", data);

        if (data.type === "connected") {
          console.log(
            "Connection confirmed, connected users:",
            data.connectedCount,
          );
          const tempMap = new Map<string, ActiveStroke>();
          data.paths.forEach((stroke: ActiveStroke) => {
            tempMap.set(stroke.strokeId, stroke);
          });
          activeStrokes.current = tempMap;
          // Load shapes from connected message
          if (data.shapes) {
            setShapes(data.shapes);
          }
          // Redraw strokes on stroke canvas
          const canvas = canvasRef.current;
          const ctx = canvas?.getContext("2d");
          if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            activeStrokes.current.forEach((stroke) => {
              if (stroke.points.length < 2) return;
              ctx.strokeStyle = stroke.color;
              ctx.lineWidth = stroke.size;
              ctx.lineCap = "round";
              ctx.lineJoin = "round";
              ctx.beginPath();
              ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
              for (let i = 1; i < stroke.points.length; i++) {
                ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
              }
              ctx.stroke();
            });
          }
          return;
        }

        if (
          data.type === "start" ||
          data.type === "draw" ||
          data.type === "end"
        ) {
          handleDrawEvent(data);
        }

        if (data.type === "shape") {
          console.log("Received shape event:", data.shape);
          setShapes((prev) => [...prev, data.shape]);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => websocket.close();
  }, [imageId, user]);

  const sendDrawEvent = (
    type: DrawEvent["type"],
    x: number,
    y: number,
    strokeId: string,
  ) => {
    const message =
      type === "start"
        ? {
            type,
            x,
            y,
            userId: user, // Not used currently might be useful later also currently required in backend
            strokeId,
            color: brushColor,
            size: brushSize,
          }
        : {
            type,
            x,
            y,
            strokeId,
            userId: user, // Not used currently might be useful later also currently required in backend
          };

    console.log("Sending draw event:", message);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not ready, state:", ws?.readyState);
    }
  };

  // This might be useful later for local handling before sending to server without lag
  // const handleLocalDrawEvent = (event: DrawEvent) => {
  //   console.log("handleLocalDrawEvent called with:", event);
  //   const strokes = activeStrokes.current;
  //   console.log("Current strokes before update:", Array.from(strokes.keys()));

  //   if (event.type === "start") {
  //     strokes.set(event.strokeId, {
  //       strokeId: event.strokeId,
  //       userId: event.userId,
  //       points: [{ x: event.x, y: event.y }],
  //       color: event.color || (event.userId === user ? brushColor : "#dc2626"),
  //       size: event.size || (event.userId === user ? brushSize : 2),
  //     });
  //     console.log(
  //       `Added new stroke ${event.strokeId} for user ${event.userId}`,
  //     );
  //   } else if (event.type === "draw") {
  //     const stroke = strokes.get(event.strokeId);
  //     if (stroke) {
  //       stroke.points.push({ x: event.x, y: event.y });
  //       console.log(
  //         `Added point to stroke ${event.strokeId}, total points: ${stroke.points.length}`,
  //       );
  //     } else {
  //       console.warn(`Stroke ${event.strokeId} not found for draw event`);
  //     }
  //   } else if (event.type === "end") {
  //     console.log(`Stroke ${event.strokeId} completed`);
  //   }

  //   console.log("Current strokes after update:", Array.from(strokes.keys()));

  //   // Use the shared redrawCanvas function
  //   redrawCanvas();
  // };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    // Handle shape tools
    if (currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'line') {
      setCurrentShape({
        type: currentTool,
        startX: x,
        startY: y,
        endX: x,
        endY: y,
        color: brushColor,
        strokeWidth: brushSize,
      });
    } else {
      // Handle brush/eraser - original WebSocket-based approach
      const strokeId = `${user}-${Date.now()}`;
      setCurrentStrokeId(strokeId);
      sendDrawEvent("start", x, y, strokeId);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Handle shape preview
    if (currentShape) {
      setCurrentShape({
        ...currentShape,
        endX: x,
        endY: y,
      });
      
      // Throttle redraws using requestAnimationFrame
      if (rafIdRef.current === null) {
        rafIdRef.current = requestAnimationFrame(() => {
          redrawShapeCanvas();
          rafIdRef.current = null;
        });
      }
    } else if (currentStrokeId) {
      // Handle brush/eraser - original WebSocket approach
      sendDrawEvent("draw", x, y, currentStrokeId);
    }
  };

  const handleMouseUp = async (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(false);

    // Handle shape completion
    if (currentShape) {
      const completedShape = {
        ...currentShape,
        endX: x,
        endY: y,
      };

      try {
        // Save shape to backend
        const response = await axiosInstance.post('/shapes', {
          imageId,
          ...completedShape,
        });

        const savedShape = response.data;
        
        // Send shape via WebSocket
        if (ws && ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({
            type: 'shape',
            shape: savedShape,
          }));
        }

        // Add to local state
        setShapes((prev) => [...prev, savedShape]);
      } catch (err) {
        console.error("Error saving shape:", err);
      }

      setCurrentShape(null);
    } else if (currentStrokeId) {
      // Handle brush/eraser completion
      sendDrawEvent("end", x, y, currentStrokeId);
      setCurrentStrokeId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 ml-16">
        <div className="text-white text-xl">Loading image...</div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 ml-16 gap-4">
        <div className="text-red-500 text-xl">{error || "Image not found"}</div>
        {error?.includes("401") || error?.includes("Unauthorized") ? (
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-400">
              Please log in to access this drawing room
            </p>
            <a
              href="/login"
              className="px-4 py-2 bg-petrol-600 hover:bg-petrol-500 text-white rounded-md transition-colors"
            >
              Go to Login
            </a>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div className="overflow-auto ml-16 flex items-center justify-center min-h-screen">
      <div className="p-4">
        <div className="max-w-[90vw] max-h-screen overflow-auto rounded-lg border-2 border-gray-600 shadow-2xl">
          <div className="relative inline-block">
            <canvas
              ref={canvasRef}
              width={imageData.width}
              height={imageData.height}
              className="bg-white block rounded-lg"
            />
            <canvas
              ref={shapeCanvasRef}
              width={imageData.width}
              height={imageData.height}
              className="block rounded-lg absolute top-0 left-0"
              style={{ pointerEvents: 'none' }}
            />
            <canvas
              width={imageData.width}
              height={imageData.height}
              className="cursor-crosshair block rounded-lg absolute top-0 left-0"
              style={{ backgroundColor: 'transparent', pointerEvents: 'auto' }}
              onPointerDown={handleMouseDown}
              onPointerMove={handleMouseMove}
              onPointerUp={handleMouseUp}
              onPointerLeave={() => setIsDrawing(false)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Draw;
