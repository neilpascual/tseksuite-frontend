import {
  LayoutDashboardIcon,
  User2Icon,
  LibraryBigIcon,
  LogOutIcon,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";

function BottomNavLink({
    link, 
    icon, 
    title,
    showModal = false
}) {
 
  const isActive = (path) => location.pathname === path;
  const navigate = useNavigate();
  const location = useLocation();
  
  const icons = {
    'dashboard' : <LayoutDashboardIcon className="w-5 h-5" />,
    'examinees' : <User2Icon className="w-5 h-5" /> ,
    'test' : <LibraryBigIcon className="w-5 h-5" />,
    'logout' : <LogOutIcon className="w-5 h-5" />
  }

  const handleOnClick = () => {
        if (link === "auth/logout") {
          if (showModal) showModal();
          return;
        }
        navigate(`/admin/${link}`)
    }

  return (
    <> 
    <button
            onClick={ handleOnClick }
            className={`flex items-center gap-2 px-5 py-4 rounded-full transition-all ${
              isActive(`/admin/${link}`)
                ? "bg-[#3A91AC] text-white"
                : "text-[#3A91AC] hover:bg-[#3A91AC]/10"
            }`}
          >
            {icons[icon]}
            <span className="hidden sm:inline text-sm font-medium">{title}</span>
    </button></>
  )
}

export default BottomNavLink
