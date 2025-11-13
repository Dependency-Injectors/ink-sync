import { createBrowserRouter } from "react-router";
import testView from "../views/testView";
import RootLayout from "../layouts/RootLayout";
import Login from "../views/Login";
import Home from "../views/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: testView },
      { path: "login", Component: Login },
    ],
  },
]);
