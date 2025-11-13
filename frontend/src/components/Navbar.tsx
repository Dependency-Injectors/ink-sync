import { Link } from "react-router";
import NavItem from "./NavItem";

const Navbar = () => {
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
            <NavItem to="/login">Login</NavItem >
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;
