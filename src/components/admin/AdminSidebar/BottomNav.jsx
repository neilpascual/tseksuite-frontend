import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboardIcon,
  User2Icon,
  LibraryBigIcon,
  LogOutIcon,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";
import toast from "react-hot-toast";
import ConfirmationModal from "../../ConfimationModal";

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  // Determine active tab based on current route
  const isActive = (path) => location.pathname === path;
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
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2
          w-auto
          h-16
          rounded-full
          bg-white/10 backdrop-blur-xl
          border border-[#3A91AC]/40
          shadow-lg
          flex items-center justify-center px-2"
      >
        <div className="flex items-center justify-around w-full gap-4">
          {/* Dashboard */}
          <button
            onClick={() => navigate("/admin/dashboard")}
            className={`flex items-center gap-2 px-5 py-4 rounded-full transition-all ${
              isActive("/admin/dashboard")
                ? "bg-[#3A91AC] text-white"
                : "text-[#3A91AC] hover:bg-[#3A91AC]/10"
            }`}
          >
            <LayoutDashboardIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">
              Dashboard
            </span>
          </button>
          {/* Examinees */}
          <button
            onClick={() => navigate("/admin/examiners/exams")}
            className={`flex items-center gap-2 px-5 py-4 rounded-full transition-all ${
              isActive("/admin/examiners/exams")
                ? "bg-[#3A91AC] text-white"
                : "text-[#3A91AC] hover:bg-[#3A91AC]/10"
            }`}
          >
            <User2Icon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">
              Examinees
            </span>
          </button>
          {/* Test Bank */}
          <button
            onClick={() => navigate("/admin/assessments/test-bank")}
            className={`flex items-center gap-1 px-5 py-4 rounded-full transition-all ${
              isActive("/admin/assessments/test-bank")
                ? "bg-[#3A91AC] text-white"
                : "text-[#3A91AC] hover:bg-[#3A91AC]/10"
            }`}
          >
            <LibraryBigIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Test</span>
            <span className="hidden sm:inline text-sm font-medium">Bank</span>
          </button>
          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 px-5 py-4 rounded-full text-[#3A91AC] hover:bg-[#3A91AC]/10 transition-all"
          >
            <LogOutIcon className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default BottomNav;
