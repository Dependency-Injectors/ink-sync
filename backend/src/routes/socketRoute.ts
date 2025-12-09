import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { CookieSchema } from "../types/cookieSchema";
import { addPointToPath, createPath, type StartDrawEvent } from "../pathController";

export type DrawEvent =
  | {
      type: "draw" | "end";
      x: number;
      y: number;
      userId: string;
      strokeId: string;
    }
  | StartDrawEvent;

const drawingClients = new Map<string, any>();

export const socketRoute = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "hello",
      exp: "1d",
    })
  )
  .ws("/draw", {
    cookie: CookieSchema,
    query: t.Object({
      id: t.String(),
    }),
    store: t.Object({
      userId: t.Optional(t.String()),
    }),
    beforeHandle: async ({ jwt, cookie: { auth }, store }) => {
      if (!auth) throw new Error("Unauthorized"); // TODO: handle errors better

      const token = await jwt.verify(auth.value as string);

      if (!token) throw new Error("Unauthorized"); // TODO: handle errors better
      // store.userId = token.id;
    },
    open: (ws) => {
      // console.log(ws.data.store.userId);
      const { id } = ws.data.query;
      drawingClients.set(id, ws);
      console.log(
        `Drawing client ${id} connected. Total drawing clients: ${drawingClients.size}`
      );

      ws.send(
        JSON.stringify({
          type: "connected",
          id,
          connectedCount: drawingClients.size,
          time: Date.now(),
        })
      );
    },
    close(ws) {
      const { id } = ws.data.query;
      if (drawingClients.get(id) === ws) {
        drawingClients.delete(id);
        console.log(
          `Drawing client ${id} disconnected. Total drawing clients: ${drawingClients.size}`
        );
      }
    },
    message(ws, message) {
      const { id } = ws.data.query;

      try {
        const drawEvent: DrawEvent = message as DrawEvent;
        if (!drawEvent.type || !drawEvent.userId || !drawEvent.strokeId) {
          throw new Error("Invalid draw event structure"); // TODO: handle errors better
        }

        // Convert back to string for broadcasting
        const messageStr = JSON.stringify(drawEvent);

        // Broadcast drawing event to all other clients (not sender)
        drawingClients.forEach((client, clientId) => {
          // TODO: i seem to remember there being a better way of doing this
          if (clientId !== id && client.readyState === 1) {
            console.log(`Broadcasting to client ${clientId}: ${messageStr}`);
            client.send(messageStr);
          }
        });

        console.log(
          `Drawing event from ${id}: ${drawEvent.type} stroke ${drawEvent.strokeId} at (${drawEvent.x}, ${drawEvent.y})`
        );
        console.log(
          `Total clients: ${drawingClients.size}, Broadcasting to: ${Array.from(
            drawingClients.keys()
          )
            .filter((cId) => cId !== id)
            .join(", ")}`
        );

        // TODO: Store completed strokes in database
        if (drawEvent.type === "end" || drawEvent.type === "draw") {
          addPointToPath(drawEvent);
          // await saveStroke(drawEvent.strokeId, drawEvent);
        } else if (drawEvent.type === "start") {
          //createPath(drawEvent, imageId); // TODO: get imageId from somewhere 
        }
      } catch (error) {
        console.error("Invalid drawing event:", error, "Message:", message);
      }
    },
  });
