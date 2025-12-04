import { RouterProvider } from "react-router";
import { router } from "./lib/router";
import { useTheme } from "./lib/useTheme";

const App = () => {
  const { theme } = useTheme();
  return (
    <body data-theme={theme}>
      <RouterProvider router={router} />
    </body>
  );
};

export default App;
