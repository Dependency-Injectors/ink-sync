import jwt from "@elysiajs/jwt";
import Elysia, { t } from "elysia";
import { prisma } from "../db/db";
import { UserSchema } from "../types/authSchema";

const authRoutes = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "hello",
      exp: "1d", // 1 day
    })
  )
  .post(
    "/register",
    async ({ body, status }) => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: body.email },
        });
        if (user) {
          return status(409, "User already exists");
        }
        const { password } = body;
        const hashedPassword = await Bun.password.hash(password, {
          algorithm: "argon2id",
          memoryCost: Math.pow(2, 10) * 64, //64 MB
          timeCost: 3,
        });

        const newUser = await prisma.user.create({
          data: {
            email: body.email,
            password: hashedPassword,
          },
        });
        return "User registered successfully";
      } catch (error) {
        console.error("Error registering user:", error);
        throw error;
      }
    },
    {
      body: UserSchema,
    }
  )
  .post(
    "/login",
    async ({ jwt, body, cookie: { auth }, status }) => {
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (!user) {
        return status(404, { error: "Invalid password or email" });
      }
      const isPasswordValid = await Bun.password.verify(
        body.password,
        user.password
      );
      if (!isPasswordValid) {
        return status(401, { error: "Invalid password or email" });
      }

      const value = await jwt.sign({ id: user.id, email: user.email });

      auth.set({
        value,
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: false,
      });

      return { email: user.email };
    },
    {
      body: UserSchema,
      cookie: t.Cookie({
        auth: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/logout",
    ({ cookie: { auth } }) => {
      auth?.remove();
      return "Logged out successfully";
    },
    {
      // cookie: CookieSchema,
    }
  );
//
export { authRoutes };
