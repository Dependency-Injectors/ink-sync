import { RouterProvider } from "react-router";
import { router } from "./lib/router";
import { useTheme } from "./lib/useTheme";

const App = () => {
  const { theme } = useTheme();
  return (
    <div data-theme={theme}>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
