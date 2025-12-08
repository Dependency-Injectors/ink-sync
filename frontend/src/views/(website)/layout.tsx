import { Outlet } from "react-router";
import Navbar from "../../components/Navbar";
import { Toaster } from "react-hot-toast";

const RootLayout = () => {
  return (
    <div className="min-h-screen relative flex flex-col">
      <Toaster />
      <Navbar />
      <Outlet />
    </div>
  );
};
export default RootLayout;
