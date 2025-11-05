const SidebarSubmenu = ({ isOpen, items }) => (
  <div
    className={`transition-all duration-300 ease-in-out overflow-hidden ${
      isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
    } flex flex-col gap-2 sm:pl-12 `}
  >
    {items.map(({ icon, label }, idx) => (
      <div key={idx} className="flex justify-center sm:items-center gap-2">
        {icon}
        <span className="text-sm lg:text-md mt-2 sm:mt-0">{label}</span>
      </div>
    ))}
  </div>
);
export default SidebarSubmenu;
