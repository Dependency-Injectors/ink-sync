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

interface ImageData {
  id: string;
  width: number;
  height: number;
  createdAt: string;
  updatedAt: string;
}

const Draw = () => {
  const { id: imageId } = useParams<{ id: string }>();
  const { brushColor, brushSize } = useDrawing();
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Redraw all active strokes
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
  }, []);

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
      } else {
        const stroke = strokes.get(event.strokeId);
        if (stroke && stroke.points.length > 0) {
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
      }
      if (event.type === "end") {
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
          redrawCanvas();
          return;
        }

        if (
          data.type === "start" ||
          data.type === "draw" ||
          data.type === "end"
        ) {
          handleDrawEvent(data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    return () => websocket.close();
  }, [imageId, user, redrawCanvas]);

  const sendDrawEvent = (
    type: DrawEvent["type"],
    x: number,
    y: number,
    strokeId: string,
  ) => {
    const message = {
      type,
      x,
      y,
      userId: user,
      strokeId,
      color: brushColor,
      size: brushSize,
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

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const strokeId = `${user}-${Date.now()}`;

    setIsDrawing(true);
    setCurrentStrokeId(strokeId);
    sendDrawEvent("start", x, y, strokeId);
    // handleLocalDrawEvent({ type: "start", x, y, userId: user, strokeId });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentStrokeId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sendDrawEvent("draw", x, y, currentStrokeId);
    // handleLocalDrawEvent({
    //   type: "draw",
    //   x,
    //   y,
    //   userId: user,
    //   strokeId: currentStrokeId,
    // });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!currentStrokeId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(false);
    sendDrawEvent("end", x, y, currentStrokeId);
    // handleLocalDrawEvent({
    //   type: "end",
    //   x,
    //   y,
    //   userId: user,
    //   strokeId: currentStrokeId,
    // });
    setCurrentStrokeId(null);
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
    <div className=" overflow-auto ml-16 flex items-center justify-center min-h-screen">
      <div className="p-4">
        <div className="">
          <canvas
            ref={canvasRef}
            width={imageData.width}
            height={imageData.height}
            className="cursor-crosshair bg-gray-800 block border-2 border-gray-600 rounded-lg overflow-scroll shadow-2xl max-w-[90vw] max-h-s"
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
