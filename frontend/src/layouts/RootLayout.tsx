import { Outlet } from "react-router";
import Navbar from "../components/Navbar";
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-gray-50">
      <Toaster />
      <Navbar />
      <Outlet />
    </div>
  );
};
export default RootLayout;
