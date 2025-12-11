import { Link } from "react-router";
import NavItem from "./NavItem";
import { useCurrentUser } from "../lib/useCurrentUser";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useTheme } from "../lib/useTheme";
import { FaHamburger } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { IoCloseCircle } from "react-icons/io5";
import { BiMoon, BiSun } from "react-icons/bi";

const Navbar = () => {
  const { user, setUser } = useCurrentUser();
  const { theme, setTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div className="bg-gray-400 dark:bg-gray-900 border-b border-petrol-500">
      <nav className="flex justify-between items-center p-4 text-gray-900 dark:text-gray-300 max-w-[1200px] mx-auto">
        <div>
          <Link to="/">Ink-Sync</Link>
        </div>
        <button
          ref={buttonRef}
          className="md:hidden"
          onClick={() => setMenuOpen((cur) => !cur)}
        >
          <FaHamburger />
          {/* Actual Hamburger icon thought it was funny after i saw it */}
        </button>
        <ul
          ref={menuRef}
          className={`md:flex gap-6 ${menuOpen ? "grid" : "hidden"} absolute 
          items-center md:static top-16 left-0 z-50 w-full md:w-auto bg-gray-400 dark:bg-gray-900 p-4 md:p-0`}
        >
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-2 right-2 md:hidden"
          >
            <IoCloseCircle size={30} />
          </button>
          <li>
            <NavItem to="/">Home</NavItem>
          </li>
          {user && (
            <>
              {/* <li> */}
                {/* <NavItem to="/draw">Draw</NavItem> */}
              {/* </li> */}
              <li>
                <NavItem to="/images">Images</NavItem>
              </li>
            </>
          )}
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
          <li>
            <button
              onClick={() => setTheme()}
              className="hover:text-petrol-400 cursor-pointer text-lg flex items-center justify-center"
            >
              {theme === "light" ? <BiMoon /> : <BiSun />}
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;
