import jwt from "@elysiajs/jwt";
import Elysia from "elysia";
import { prisma } from "../db/db";
import { CookieSchema } from "../types/schema";
import {
  UserPlain,
  UserPlainInputCreate,
} from "../../generated/prismabox/User";

const authRoutes = new Elysia()
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "hello",
      exp: "1d" // 1 day
    })
  )
  .post(
    "/register",
    async ({ body }) => {
      try {
        const { password } = body;
        const hashedPassword = await Bun.password.hash(password, {
          algorithm: "argon2id",
          memoryCost: Math.pow(2, 10) * 64, //64 MB
          timeCost: 3,
        });

        const user = await prisma.user.create({
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
      body: UserPlainInputCreate,
    }
  )
  .post(
    "/login",
    async ({ jwt, body, cookie: { auth } }) => {
      const user = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isPasswordValid = await Bun.password.verify(
        body.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }

      const value = await jwt.sign({ id: user.id, email: user.email });
      // if (!auth) throw new Error("No auth cookie");
      auth.set({
        value,
        httpOnly: true,
        maxAge: 60 * 60 * 24,
        secure: false,
      });
      return user;
    },
    {
      cookie: CookieSchema,
      body: UserPlainInputCreate,
    }
  )
  .get(
    "/profile",
    async ({ jwt, cookie: { auth } }) => {
      if (!auth) throw new Error("No auth cookie");
      const token = await jwt.verify(auth.value);
      if (!token) throw new Error("Invalid token");
      const users = await prisma.user.findMany();
      return users;
    },
    {
      cookie: CookieSchema,
      response: [UserPlain],
    }
  );
//
export { authRoutes };
