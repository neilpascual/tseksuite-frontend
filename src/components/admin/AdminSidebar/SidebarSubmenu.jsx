import { NavLink } from "react-router-dom";

const SidebarSubmenu = ({ isOpen, items }) => (
  <div
    className={`transition-all duration-300 ease-in-out overflow-hidden ${
      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
    } flex flex-col gap-2   w-full`}
  >
    {items.map(({ icon, label, to }, idx) => (
      <NavLink
        key={idx}
        to={to}
        end
        className={({ isActive }) =>
          `flex items-center justify-center gap-2 px-3 py-1 text-sm cursor-pointer ${
            isActive
              ? "bg-[#2E99B0] text-white rounded-2xl"
              : "text-gray-500 hover:bg-gray-100 "
          }`
        }
      >
        {icon}
        <span>{label}</span>
      </NavLink>
    ))}
  </div>
);

export default SidebarSubmenu;
