import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const SidebarLink = ({ to, label, icon, isOpen, toggleOpen }) => (
  <NavLink
    to={to}
    replace
    onClick={toggleOpen}
    className={({ isActive, isPending }) =>
      `flex items-center justify-center sm:justify-between w-full cursor-pointer px-4 py-2 transition-colors ${
        isPending
          ? "text-gray-400"
          : isActive
          ? "bg-[#2E99B0] text-white"
          : "hover:bg-gray-100 text-[#2E99B0]"
      }`
    }
  >
    {({ isActive }) => (
      <>
        <div className="flex items-center gap-2">
          {icon(isActive)}
          <span className="font-bold text-sm sm:text-base hidden sm:inline">
            {label}
          </span>
        </div>
        {typeof isOpen === "boolean" &&
          (isOpen ? (
            <ChevronUp className="h-5 w-5 hidden sm:inline" />
          ) : (
            <ChevronDown className="h-5 w-5 hidden sm:inline" />
          ))}
      </>
    )}
  </NavLink>
);
export default SidebarLink;
