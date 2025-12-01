import Elysia, { t } from "elysia";
import { prisma } from "../db/db";
import jwt from "@elysiajs/jwt";
import { authMiddleware } from "../middleware/auth";

export const userImageRoute = new Elysia().group("/imageUser", (app) =>
  app
    .use(authMiddleware)
    .post(
      "/",
      async ({ body: { userEmail, imageId }, user }) => {
        const userImage = await prisma.userImage.findFirst({
          where: { UserId: user.id, ImageId: imageId },
        });
        if (!userImage) {
          throw new Error("Image not found or not co-owned by user");
        }
        const coOwner = await prisma.user.findUnique({
          where: { email: userEmail },
        });
        if (!coOwner) {
          throw new Error("Co-owner user not found");
        }
        const newUserImage = await prisma.userImage.create({
          data: {
            UserId: coOwner.id,
            ImageId: imageId,
          },
        });
        return newUserImage;
      },
      {
        body: t.Object({
          userEmail: t.String(),
          imageId: t.String(),
        }),
      }
    )
    .delete(
      "/",
      async ({ body: { imageId, userEmail }, user }) => {
        const userImage = await prisma.userImage.findFirst({
          where: { UserId: user.id, ImageId: imageId },
        });
        if (!userImage) {
          throw new Error("Image not found or not co-owned by user");
        }
        const coOwner = await prisma.user.findUnique({
          where: { email: userEmail },
        });
        if (!coOwner) {
          throw new Error("Co-owner user not found");
        }
        const deletedUserImage = await prisma.userImage.deleteMany({
          where: {
            UserId: coOwner.id,
            ImageId: imageId,
          },
        });
        return deletedUserImage;
      },
      {
        body: t.Object({
          userEmail: t.String(),
          imageId: t.String(),
        }),
      }
    )
);
