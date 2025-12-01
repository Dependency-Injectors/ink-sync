import Elysia from "elysia";
import { prisma } from "../db/db";
import jwt from "@elysiajs/jwt";
import { ImagePlainInputCreate } from "../../generated/prismabox/Image";
import { authMiddleware } from "../middleware/auth";

export const imageRoutes = new Elysia().group("/images", (app) =>
  app
    .use(authMiddleware)

    //CRUD operations for images
    .get("/", async ({ user }) => {
      const userImages = await prisma.userImage.findMany({
        where: { UserId: user.id },
        include: { image: true },
      });
      return userImages.map((userImage) => userImage.image);
    })
    .get("/users/:imageId", async ({ params }) => {
      const userImages = await prisma.userImage.findMany({
        where: { ImageId: params.imageId },
        include: { user: true },
      });
      return userImages.map((userImage) => ({
        id: userImage.user.id,
        email: userImage.user.email,
      }));
    })
    .get("/:id", async ({ params, user, status }) => {
      const userImage = await prisma.userImage.findFirst({
        where: { UserId: user.id, ImageId: params.id },
      });
      if (!userImage) {
        return status(404, { error: "Image not found or not owned by user" });
      }
      const image = await prisma.image.findUnique({
        where: { id: params.id },
      });
      return image;
    })
    .post(
      "/",
      async ({ body: { width, height }, user }) => {
        const newImage = await prisma.image.create({
          data: {
            width,
            height,
          },
        });
        await prisma.userImage.create({
          data: {
            UserId: user.id,
            ImageId: newImage.id,
          },
        });

        return newImage;
      },
      { body: ImagePlainInputCreate }
    )
    .delete("/:id", async ({ params, user, status }) => {
      // TODO: right now images can be deleted by all users, need to restrict to owner
      const userImage = await prisma.userImage.findFirst({
        where: { UserId: user.id, ImageId: params.id },
      });
      if (!userImage) {
        return status(404, { error: "Image not found or not owned by user" });
      }
      await prisma.image.delete({
        where: { id: params.id },
      });
      return { message: "Image deleted successfully" };
    })
);
