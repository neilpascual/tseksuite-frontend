import { NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

const SidebarLink = ({ to, label, icon, isOpen, toggleOpen }) => {
  const baseClasses =
    "flex items-center justify-center sm:justify-between w-full cursor-pointer px-2 py-2 transition-colors";

  const activeClasses = "bg-[#2E99B0] text-white rounded-xl";
  const inactiveClasses = "hover:bg-gray-100 text-[#2E99B0]";

  const content = (active) => (
    <>
      <div className="flex items-center gap-2">
        {icon(active)}
        <span className="font-semibold text-sm lg:text-base">{label}</span>
      </div>
      {typeof isOpen === "boolean" &&
        (isOpen ? (
          <ChevronUp className="h-5 w-5 hidden sm:inline" />
        ) : (
          <ChevronDown className="h-5 w-5 hidden sm:inline" />
        ))}
    </>
  );

  return to ? (
    <NavLink
      to={to}
      replace
      onClick={toggleOpen}
      className={({ isActive, isPending }) =>
        `${baseClasses} ${
          isPending
            ? "text-gray-400"
            : isActive
            ? activeClasses
            : inactiveClasses
        }`
      }
    >
      {({ isActive }) => content(isActive)}
    </NavLink>
  ) : (
    <div
      onClick={toggleOpen}
      className={`${baseClasses} ${isOpen ? activeClasses : inactiveClasses}`}
    >
      {content(isOpen)}
    </div>
  );
};

export default SidebarLink;
