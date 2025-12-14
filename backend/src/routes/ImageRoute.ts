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
    .get("/users/:imageId", async ({ params, user, status }) => {
      const userImage = await prisma.userImage.findFirst({
        where: { ImageId: params.imageId, UserId: user.id },
      });
      if (!userImage) {
        return status(404, { error: "Image not found or not owned by user" });
      }
      const userImages = await prisma.userImage.findMany({
        where: { ImageId: params.imageId },
        include: { user: true },
      });
      return userImages.map((userImage) => ({
        id: userImage.user.id,
        email: userImage.user.email,
      }));
    })
    .get("/available-users/:imageId", async ({ params, user, status }) => {
      const userImage = await prisma.userImage.findFirst({
        where: { ImageId: params.imageId, UserId: user.id },
      });
      if (!userImage) {
        return status(404, { error: "Image not found or not owned by user" });
      }
      const allUsers = await prisma.user.findMany();
      const assignedUserImages = await prisma.userImage.findMany({
        where: { ImageId: params.imageId },
      });
      const assignedUserIds = assignedUserImages.map(
        (userImage) => userImage.UserId
      );
      const availableUsers = allUsers.map((u) => ({
        ...u,
        hasAccess: assignedUserIds.includes(u.id),
      }));
      return availableUsers.map((user) => ({
        id: user.id,
        email: user.email,
        hasAccess: user.hasAccess,
      }));
    })
    .get("/:id", async ({ params, user, status }) => {
      // Catch-all route - must be LAST
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
            ownerId: user.id,
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
      // Check if image exists and user has access
      const userImage = await prisma.userImage.findFirst({
        where: { UserId: user.id, ImageId: params.id },
      });
      if (!userImage) {
        return status(404, { error: "Image not found or not owned by user" });
      }
      
      // Check if user is the owner
      const image = await prisma.image.findUnique({
        where: { id: params.id },
      });
      if (!image) {
        return status(404, { error: "Image not found" });
      }
      if (image.ownerId !== user.id) {
        return status(403, { error: "Only the image owner can delete this image" });
      }
      
      await prisma.image.delete({
        where: { id: params.id },
      });
      return { message: "Image deleted successfully" };
    })
);
