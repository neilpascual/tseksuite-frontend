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
        className="flex items-center justify-center sm:justify-between cursor-pointer sm:bg-[#2E99B0] rounded-xl py-3 lg:pl-3"
        onClick={handleLogout}
      >
        <div className="flex sm:hidden items-center justify-center gap-2 bg-cyan-700 px-4 py-2 rounded-lg w-[30%]">
          <LogOut className="h-5 w-5 text-white" />
          <span className="text-white text-sm">Logout</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 pl-2">
          <img
            src="/assets/Logo.png"
            alt="SuiteTest Logo"
            className="h-5 w-5"
          />
          <span className="text-white text-sm sm:ml-9 lg:ml-4">Logout</span>
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
