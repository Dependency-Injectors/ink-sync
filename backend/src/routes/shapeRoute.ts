import Elysia, { t } from "elysia";
import { prisma } from "../db/db";
import { authMiddleware } from "../middleware/auth";

export const shapeRoutes = new Elysia().group("/shapes", (app) =>
  app
    .use(authMiddleware)

    // Get all shapes for an image
    .get("/:imageId", async ({ params, user, status }) => {
      const userImage = await prisma.userImage.findFirst({
        where: { ImageId: params.imageId, UserId: user.id },
      });
      if (!userImage) {
        return status(404, { error: "Image not found or access denied" });
      }
      
      const shapes = await prisma.shape.findMany({
        where: { imageId: params.imageId },
        orderBy: { createdAt: "asc" },
      });
      
      return shapes;
    })

    // Create a new shape
    .post(
      "/",
      async ({ body, user, status }) => {
        // Verify user has access to the image
        const userImage = await prisma.userImage.findFirst({
          where: { ImageId: body.imageId, UserId: user.id },
        });
        if (!userImage) {
          return status(404, { error: "Image not found or access denied" });
        }

        const shape = await prisma.shape.create({
          data: {
            type: body.type,
            startX: body.startX,
            startY: body.startY,
            endX: body.endX,
            endY: body.endY,
            color: body.color,
            strokeWidth: body.strokeWidth,
            imageId: body.imageId,
            userId: user.id,
          },
        });

        return shape;
      },
      {
        body: t.Object({
          type: t.String(),
          startX: t.Number(),
          startY: t.Number(),
          endX: t.Number(),
          endY: t.Number(),
          color: t.String(),
          strokeWidth: t.Number(),
          imageId: t.String(),
        }),
      }
    )

    // Delete a shape (only creator can delete)
    .delete("/:id", async ({ params, user, status }) => {
      const shape = await prisma.shape.findUnique({
        where: { id: params.id },
      });

      if (!shape) {
        return status(404, { error: "Shape not found" });
      }

      if (shape.userId !== user.id) {
        return status(403, { error: "You can only delete your own shapes" });
      }

      await prisma.shape.delete({
        where: { id: params.id },
      });

      return { message: "Shape deleted successfully" };
    })
);
