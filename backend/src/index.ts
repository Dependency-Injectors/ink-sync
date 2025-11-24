import { Elysia } from "elysia";

import cors from "@elysiajs/cors";
import { authRoutes } from "./routes/authRoute";
import { healthRoute } from "./routes/healthRoute";
import { imageRoutes } from "./routes/ImageRoute";

const app = new Elysia()
  .use(cors())
  .use(healthRoute)
  .use(authRoutes)
  .use(imageRoutes)
  .listen(process.env.PORT || 1337);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

// app
//   .handle(
//     new Request("http://localhost:1337/auth/login", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: "user2@example.com",
//         password: "password123",
//       }),
//     })
//   )
//   .then((response) => {
//     response.json().then((data) => {
//       console.log("Register Response:", data);
//     });
//   });
