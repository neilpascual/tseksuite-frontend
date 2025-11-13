import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";
import { useAuth } from "../../../hooks/useAuth";
import toast from "react-hot-toast";
import { useState } from "react";
import ConfirmationModal from "../../ConfimationModal";

const SidebarFooter = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully", {
      style: { width: "300px" },
    });

    navigate("/auth/login");
  };

  return (
    <>
      {showLogoutModal && (
        <ConfirmationModal
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          confirmLabel="Logout"
          cancelLabel="Cancel"
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          confirmColor="red"
        />
      )}

      <div className="mt-auto w-full px-3">
        <div
          className="flex items-center justify-center sm:justify-between cursor-pointer sm:bg-[#2E99B0] rounded-xl py-3 lg:pl-3  "
          onClick={() => setShowLogoutModal(true)}
        >
          <div className="flex sm:hidden items-center justify-center gap-2 bg-cyan-700 px-3 py-2 rounded-lg w-[30%]">
            <LogOut className="h-5 w-5 text-white hidden sm:flex" />
            <span className="text-white text-sm">Logout</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 md:gap-2 lg:gap-3 lg:pl-1 pl-2">
            <img
              src="/assets/Logo.png"
              alt="SuiteTest Logo"
              className="h-5 w-5"
            />
            <span className="text-white text-sm sm:ml-6 md:ml-4 lg:ml-4">
              Logout
            </span>
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
    </>
  );
};
export default SidebarFooter;
