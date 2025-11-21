import { Link } from "react-router";
import NavItem from "./NavItem";
import { useCurrentUser } from "../lib/useCurrentUser";

const Navbar = () => {
  const { user } = useCurrentUser();
  const logout = async () => {
    const res = await fetch("http://localhost:3000/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) {
      alert("Logout failed. Please try again.");
      return;
    };
    useCurrentUser.getState().setUser(null);
  };
  return (
    <div className="bg-gray-900 shadow-md shadow-petrol-500">
      <nav className="flex justify-between items-center p-4 text-white max-w-[1200px] mx-auto">
        <div>
          <Link to="/">Ink-Sync</Link>
        </div>
        <ul className="flex gap-6">
          <li>
            <NavItem to="/">Home</NavItem>
          </li>
          <li>
            <NavItem to="/about">About</NavItem>
          </li>
          <li>
            {user ? (
              <button className="hover:text-petrol-400 cursor-pointer" onClick={logout}>
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
