import { Outlet } from "react-router";
import { Toaster } from "react-hot-toast";
import SideBar from "../../components/ui/SideBar";

const RootLayout = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-gray-50">
      <Toaster />
    <SideBar/>
      <Outlet />
    </div>
  );
};
export default RootLayout;
