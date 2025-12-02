import Elysia from "elysia";
import { jwt } from "@elysiajs/jwt";
import { prisma } from "../db/db";

export const authMiddleware = new Elysia({
  name: "authMiddleware",
})
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "hello",
      exp: "1d", // It uses a time stamp or a string describing a time span eg. "1d", "20h", "60m", idk what time spans are supported
    })
  )
  .resolve({ as: "global" }, async ({ jwt, cookie: { auth }, status }) => {
    if (!auth) return status(401, { error: "Unauthorized" });
    const token = (await jwt.verify(auth.value as string)) as {
      id: string;
      email: string;
    };
    if (!token) return status(401, { error: "Unauthorized: Invalid token" });
    const user = await prisma.user.findUnique({ where: { id: token.id } });
    if (!user) return status(401, { error: "Unauthorized: User not found" });
    return {
      user: {
        id: user.id,
        email: user.email,
      },
    }; // apparently needed to return an object
  });
