import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import SideBar from "../../components/ui/SideBar";

const RootLayout = () => {
  return (
    <div className="dark:bg-gray-950 min-h-screen text-gray-950 bg-gray-50 dark:text-gray-50 max-w-screen">
      <Toaster />
      <SideBar />
      <Outlet />
    </div>
  );
};
export default RootLayout;
