import { type PropsWithChildren } from "react";
import { NavLink } from "react-router";

const NavItem = ({ to, children }: PropsWithChildren<{ to: string }>) => {
  return (
    <NavLink to={to}>
      {({ isActive }) => (
        <span
          className={`${isActive ? "text-petrol-500" : ""} hover:text-petrol-400 `}
        >
          {children}
        </span>
      )}
    </NavLink>
  );
};
export default NavItem;
