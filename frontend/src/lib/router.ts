import { createBrowserRouter } from "react-router";
import testView from "../views/(website)/testView";
import RootLayout from "../layouts/RootLayout";
import WebsiteLayout from "../views/(website)/layout";
import Login from "../views/(website)/Login";
import Home from "../views/(website)/Home";
import DrawLayout from "../views/(application)/layout";
import Register from "../views/(website)/Register";
import Draw from "../views/(application)/draw/Draw";
import DrawingProvider from '../components/DrawingProvider';
import { createElement } from 'react';
import Images from "../views/Images";

const basename = import.meta.env.BASE_URL;

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        path: "/",
        Component: WebsiteLayout,
        children: [
          { index: true, Component: Home },
          { path: "about", Component: testView },
          { path: "images", Component: Images },
          { path: "login", Component: Login },
          { path: "register", Component: Register },
        ],
      },
      {
        path: "draw",
        element: createElement(DrawingProvider, { children: createElement(DrawLayout) }),
        children: [
          {
            path: ":id",
            Component: Draw,
          },
        ],
      },
    ],
  },
], {
  basename,
});
