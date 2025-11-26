import React, { useRef, useEffect, useState } from "react";

interface DrawEvent {
  type: "start" | "draw" | "end";
  x: number;
  y: number;
  userId: string;
  strokeId: string;
  color?: string;
}

interface ActiveStroke {
  strokeId: string;
  userId: string;
  points: { x: number; y: number }[];
  color: string;
  lastPoint?: { x: number; y: number };
}

const Draw = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const userId = useRef(`user-${Math.random().toString(36).substring(2, 9)}`);
  const [currentStrokeId, setCurrentStrokeId] = useState<string | null>(null);
  const activeStrokes = useRef<Map<string, ActiveStroke>>(new Map());

  useEffect(() => {
    const handleDrawEvent = (event: DrawEvent) => {
      const strokes = activeStrokes.current;

      if (event.type === "start") {
        strokes.set(event.strokeId, {
          strokeId: event.strokeId,
          userId: event.userId,
          points: [{ x: event.x, y: event.y }],
          color: event.userId === userId.current ? "#2563eb" : "#dc2626",
        });
      } else if (event.type === "draw") {
        const stroke = strokes.get(event.strokeId);
        if (stroke) {
          stroke.points.push({ x: event.x, y: event.y });
        }
      } else if (event.type === "end") {
        console.log(`Stroke ${event.strokeId} completed`);
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      strokes.forEach((stroke) => {
        if (stroke.points.length < 2) return;

        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

        for (let i = 1; i < stroke.points.length; i++) {
          ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
        }

        ctx.stroke();
      });
    };

    const websocket = new WebSocket(
      `${import.meta.env.VITE_WS_URL}/draw?id=${userId.current}`,
    );

    websocket.onopen = () => {
      console.log("Connected to drawing server");
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
  }, []);

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
      userId: userId.current,
      strokeId,
      color: "#2563eb",
    };

    console.log("Sending draw event:", message);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket not ready, state:", ws?.readyState);
    }
  };

  const handleLocalDrawEvent = (event: DrawEvent) => {
    console.log("handleLocalDrawEvent called with:", event);
    const strokes = activeStrokes.current;
    console.log("Current strokes before update:", Array.from(strokes.keys()));

    if (event.type === "start") {
      strokes.set(event.strokeId, {
        strokeId: event.strokeId,
        userId: event.userId,
        points: [{ x: event.x, y: event.y }],
        color: event.userId === userId.current ? "#2563eb" : "#dc2626",
      });
      console.log(
        `Added new stroke ${event.strokeId} for user ${event.userId}`,
      );
    } else if (event.type === "draw") {
      const stroke = strokes.get(event.strokeId);
      if (stroke) {
        stroke.points.push({ x: event.x, y: event.y });
        console.log(
          `Added point to stroke ${event.strokeId}, total points: ${stroke.points.length}`,
        );
      } else {
        console.warn(`Stroke ${event.strokeId} not found for draw event`);
      }
    } else if (event.type === "end") {
      console.log(`Stroke ${event.strokeId} completed`);
    }

    console.log("Current strokes after update:", Array.from(strokes.keys()));

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) {
      console.warn("Canvas or context not available");
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let drawnStrokes = 0;
    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.stroke();
      drawnStrokes++;
    });

    console.log(`Redrawn ${drawnStrokes} strokes on canvas`);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const strokeId = `${userId.current}-${Date.now()}`;

    setIsDrawing(true);
    setCurrentStrokeId(strokeId);
    sendDrawEvent("start", x, y, strokeId);
    handleLocalDrawEvent({
      type: "start",
      x,
      y,
      userId: userId.current,
      strokeId,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !currentStrokeId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sendDrawEvent("draw", x, y, currentStrokeId);
    handleLocalDrawEvent({
      type: "draw",
      x,
      y,
      userId: userId.current,
      strokeId: currentStrokeId,
    });
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!currentStrokeId) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(false);
    sendDrawEvent("end", x, y, currentStrokeId);
    handleLocalDrawEvent({
      type: "end",
      x,
      y,
      userId: userId.current,
      strokeId: currentStrokeId,
    });
    setCurrentStrokeId(null);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Collaborative Drawing</h1>
      <div className="border-2 border-gray-300 inline-block">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDrawing(false)}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600">
        User ID: {userId.current} | Drawing: {isDrawing ? "Yes" : "No"}
      </div>
    </div>
  );
};

export default Draw;
