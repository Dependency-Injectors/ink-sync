import { prisma } from "./db/db";
import type { DrawEvent } from "./routes/socketRoute";

export type StartDrawEvent = {
  type: "start";
  x: number;
  y: number;
  userId: string;
  strokeId: string;
  color: string;
  size: number;
};

export const createPath = async (
  drawEvent: StartDrawEvent,
  imageId: string
) => {
  const path = await prisma.path.create({
    data: {
      id: drawEvent.strokeId,
      color: drawEvent.color,
      strokeWidth: drawEvent.size,
      ImageId: imageId,
    },
  });

  const point = await prisma.point.create({
    data: {
      x: drawEvent.x,
      y: drawEvent.y,
      PathId: drawEvent.strokeId,
    },
  });
};

export const addPointToPath = async (drawEvent: DrawEvent) => {
  const point = await prisma.point.create({
    data: {
      x: drawEvent.x,
      y: drawEvent.y,
      PathId: drawEvent.strokeId,
    },
  });
};


// Retrieve all paths and their points for a given image and user also verifying user ownership
export const getPathsByImageId = async (
  imageId: string,
  userId: string
): Promise<
  { success: true; paths: any[] } | { success: false; message: string }
> => {
  const userImage = await prisma.userImage.findFirst({
    where: { UserId: userId, ImageId: imageId },
  });
  if (!userImage) {
    return { success: false, message: "Image not found for user" };
  }
  const paths = await prisma.path.findMany({
    where: { ImageId: imageId },
    include: { points: true },
  });
  console.log(paths);
  return { success: true, paths };
};
