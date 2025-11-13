import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const RootLayout = () => {
  return (
    <div className="bg-gray-950 min-h-screen text-gray-50">
      <Navbar />
      <Outlet />
    </div>
  );
};
export default RootLayout;
