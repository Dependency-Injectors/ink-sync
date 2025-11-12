import { Elysia, t } from "elysia";

import { authRoutes } from "./routes/authRoute";



const healthRoute = new Elysia().get("/health", "OK");


const app = new Elysia().use(healthRoute).use(authRoutes).listen(3000);

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
