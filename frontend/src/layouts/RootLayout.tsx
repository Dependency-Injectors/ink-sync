import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-gray-50">
      <Navbar />
      <div className="max-w-[1200px] mx-auto p-4 lg:py-20">
        <Outlet />
      </div>
    </div>
  );
};
export default RootLayout;
