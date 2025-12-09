import jwt from "@elysiajs/jwt";
import { Elysia, t } from "elysia";
import { CookieSchema } from "../types/cookieSchema";
import {
  addPointToPath,
  createPath,
  getPathsByImageId,
  type StartDrawEvent,
} from "../pathController";
import { prisma } from "../db/db";

export type DrawEvent =
  | {
      type: "draw" | "end";
      x: number;
      y: number;
      userId: string;
      strokeId: string;
    }
  | StartDrawEvent;

const drawingRooms = new Map<string, Set<any>>();

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
      imageId: t.Optional(t.String()),
      id: t.Optional(t.String()),
    }),
    store: t.Object({
      userId: t.Optional(t.String()),
      imageId: t.Optional(t.String()),
    }),
    beforeHandle: async ({ jwt, cookie: { auth }, store, query }) => {
      if (!auth) throw new Error("Unauthorized"); // TODO: handle errors better

      const token = (await jwt.verify(auth.value as string)) as {
        id: string;
        email?: string;
      };

      if (!token) throw new Error("Unauthorized"); // TODO: handle errors better

      const imageId = (query as any).imageId || (query as any).id;
      if (!imageId) throw new Error("Missing imageId in query");

      const userHasImage = await prisma.userImage.findFirst({
        where: { ImageId: imageId, UserId: token.id },
      });
      if (!userHasImage) throw new Error("Unauthorized: no access to image");

      (store as any).userId = token.id;
      (store as any).imageId = imageId;
    },
    open: async (ws) => {
      const imageId =
        (ws.data.store as any).imageId ||
        ws.data.query.imageId ||
        ws.data.query.id;

      if (!imageId) {
        ws.close();
        return;
      }

      let room = drawingRooms.get(imageId);
      if (!room) {
        room = new Set();
        drawingRooms.set(imageId, room);
      }
      room.add(ws);

      const total = room.size;
      console.log(`Client connected to image ${imageId}. Room size: ${total}`);

      const res = await getPathsByImageId(
        imageId,
        (ws.data.store as any).userId
      );

      if (!res.success) {
        ws.close(4001, "Unauthorized: " + res.message);
        return;
      }

      ws.send(
        JSON.stringify({
          type: "connected",
          imageId,
          paths: res.paths,
          connectedCount: total,
          time: Date.now(),
        })
      );
    },
    close(ws) {
      const imageId =
        (ws.data.store as any).imageId ||
        ws.data.query.imageId ||
        ws.data.query.id;
      if (!imageId) return;

      const room = drawingRooms.get(imageId);
      if (!room) return;

      room.delete(ws);
      if (room.size === 0) drawingRooms.delete(imageId);

      console.log(
        `Client disconnected from image ${imageId}. Room size: ${room.size}`
      );
    },
    async message(ws, message) {
      const imageId =
        (ws.data.store as any).imageId ||
        ws.data.query.imageId ||
        ws.data.query.id;
      if (!imageId) return;

      try {
        const drawEvent: DrawEvent = message as DrawEvent;
        if (!drawEvent.type || !drawEvent.userId || !drawEvent.strokeId) {
          throw new Error("Invalid draw event structure"); // TODO: handle errors better
        }

        const senderId = (ws.data.store as any).userId as string | undefined;
        if (senderId && drawEvent.userId !== senderId) {
          drawEvent.userId = senderId;
        }

        const messageStr = JSON.stringify(drawEvent);

        const room = drawingRooms.get(imageId);
        if (!room) return;

        room.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(messageStr);
          }
        });

        console.log(
          `Drawing event in image ${imageId}: ${drawEvent.type} stroke ${drawEvent.strokeId} by ${drawEvent.userId} at (${drawEvent.x}, ${drawEvent.y})`
        );
        // console.log(
        //   `Total clients: ${drawingClients.size}, Broadcasting to: ${Array.from(
        //     drawingClients.keys()
        //   )
        //     .filter((cId) => cId !== id)
        //     .join(", ")}`
        // );

        if (drawEvent.type === "end" || drawEvent.type === "draw") {
          await addPointToPath(drawEvent);
        } else if (drawEvent.type === "start") {
          await createPath(drawEvent, imageId); 
        }
      } catch (error) {
        console.error("Invalid drawing event:", error, "Message:", message);
      }
    },
  });
