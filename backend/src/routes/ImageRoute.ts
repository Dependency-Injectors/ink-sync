import Elysia from "elysia";
import { prisma } from "../db/db";
import jwt from "@elysiajs/jwt";
import { ImagePlainInputCreate } from "../../generated/prismabox/Image";

export const imageRoutes = new Elysia().group("/images", (app) =>
  app
    .use(
      jwt({
        name: "jwt",
        secret: process.env.JWT_SECRET || "hello",
        exp: "1d", // It uses a time stamp or a string describing a time span eg. "1d", "20h", "60m", idk what time spans are supported
      })
    )
    .resolve(async ({ jwt, cookie: { auth } }) => {
      if (!auth) throw new Error("Unauthorized");
      const token = (await jwt.verify(auth.value as string)) as {
        id: string;
        email: string;
      };
      const user = await prisma.user.findUnique({ where: { id: token.id } });
      if (!user) throw new Error("Unauthorized");
      return {
        user: {
          id: user.id,
          email: user.email,
        },
      }; // apparently needed to return an object
    })
    //CRUD operations for images
    .get("/", async ({ user }) => {
      const userImages = await prisma.userImage.findMany({
        where: { UserId: user.id },
        include: { image: true },
      });
      return userImages.map((userImage) => userImage.image);
    })
    .get("/:id", async ({ params, user }) => {
      const userImage = await prisma.userImage.findFirst({
        where: { UserId: user.id, ImageId: params.id },
      });
      if (!userImage) {
        throw new Error("Image not found or not owned by user");
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
    .delete("/:id", async ({ params, user }) => {
      // TODO: right now images can be deleted by all users, need to restrict to owner
      const userImage = await prisma.userImage.findFirst({
        where: { UserId: user.id, ImageId: params.id },
      });
      if (!userImage) {
        throw new Error("Image not found or not owned by user");
      }
      await prisma.image.delete({
        where: { id: params.id },
      });
      return { message: "Image deleted successfully" };
    })
    .put(
      "/:imageId/:userId/coown",
      async ({ params: { imageId, userId }, user }) => {
        // TODO: needs testing
        const userImage = await prisma.userImage.findFirst({
          where: { UserId: user.id, ImageId: imageId },
        });
        if (!userImage) {
          throw new Error("Image not found or not co-owned by user");
        }
        const coOwner = await prisma.user.findUnique({
          where: { id: userId },
        });
        if (!coOwner) {
          throw new Error("Co-owner user not found");
        }
        const newUserImage = await prisma.userImage.create({
          data: {
            UserId: userId,
            ImageId: imageId,
          },
        });
        return newUserImage;
      }
    )
);
