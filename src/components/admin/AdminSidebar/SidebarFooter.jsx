import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";

const SidebarFooter = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="mt-auto w-full px-3">
      <div
        className="flex items-center justify-center sm:justify-between bg-[#2E99B0] cursor-pointer rounded-xl py-3 lg:pl-3"
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5 text-white sm:hidden" />
        <div className="hidden sm:flex items-center gap-3 px-3">
          <img
            src="/assets/Logo.png"
            alt="SuiteTest Logo"
            className="h-5 w-5"
          />
          <span className="text-white text-sm sm:ml-10 lg:ml-5">Logout</span>
          <button>
            <img
              src="/assets/Launchpad.png"
              alt="Rocket Logo"
              className="h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
export default SidebarFooter;
