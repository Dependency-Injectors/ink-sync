import { Link } from "react-router";
import NavItem from "./NavItem";
import { useCurrentUser } from "../lib/useCurrentUser";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

const Navbar = () => {
  const { user, setUser } = useCurrentUser();

  const logout = async () => {
    try {
      const res = await axiosInstance.get("/logout");

      if (res.status !== 200) {
        toast.error("Logout failed. Please try again.");
        return;
      }
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error(String(error));
    }
  };

  return (
    <div className="bg-gray-900 border-b border-petrol-500">
      <nav className="flex justify-between items-center p-4 text-white max-w-[1200px] mx-auto">
        <div>
          <Link to="/">Ink-Sync</Link>
        </div>
        <ul className="flex gap-6">
          <li>
            <NavItem to="/">Home</NavItem>
          </li>
          <li>
            <NavItem to="/draw">Draw</NavItem>
          </li>
          <li>
            <NavItem to="/about">About</NavItem>
          </li>
          
          <li>
            {user ? (
              <button
                className="hover:text-petrol-400 cursor-pointer"
                onClick={logout}
              >
                Logout
              </button>
            ) : (
              <NavItem to="/login">Login</NavItem>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;
