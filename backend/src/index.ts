import { Elysia } from "elysia";

import cors from "@elysiajs/cors";
import { authRoutes } from "./routes/authRoute";
import { healthRoute } from "./routes/healthRoute";
import { imageRoutes } from "./routes/ImageRoute";
import { socketRoute } from "./routes/socketRoute";
import { userImageRoute } from "./routes/userImageRoute";
import { usersRoute } from "./routes/usersRoute";


const app = new Elysia()
  .use(cors())
  .use(healthRoute)
  .use(authRoutes)
  .use(imageRoutes)
  .use(socketRoute)
  .use(userImageRoute)
  .use(usersRoute)
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
