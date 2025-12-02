import Elysia, { t } from "elysia";
import { authMiddleware } from "../middleware/auth";
import { CookieSchema } from "../types/cookieSchema";
import { prisma } from "../db/db";

export const usersRoute = new Elysia().use(authMiddleware).get(
  "/users",
  async () => {
    const users = await prisma.user.findMany();
    const usersWithoutPasswords = users.map((user) => ({
      id: user.id,
      email: user.email,
    }));
    return usersWithoutPasswords;
  },
  {
    cookie: CookieSchema,
    response: t.Array(
      t.Object({
        id: t.String(),
        email: t.String(),
      })
    ),
  }
);
