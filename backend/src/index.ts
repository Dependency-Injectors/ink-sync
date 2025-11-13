import { Elysia } from "elysia";

import cors from "@elysiajs/cors";
import { authRoutes } from "./routes/authRoute";
import { healthRoute } from "./routes/healthRoute";

const app = new Elysia()
  .use(cors())
  .use(healthRoute)
  .use(authRoutes)
  .listen(3000);

console.log(
  `🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`
);

// app
//   .handle(
//     new Request("http://localhost:3000/auth/login", {
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
