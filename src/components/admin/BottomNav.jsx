import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BottomNavLink from "./BottomNavLink";
import { useAuth } from "../../hooks/useAuth";
import toast from "react-hot-toast";
import ConfirmationModal from "../ConfimationModal";
import { useNavigate } from "react-router-dom";

const BottomNav = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("You have been logged out successfully", {
      style: { width: "300px" },
    });

    navigate("/auth/login");

    setTimeout(() => {
      window.location.reload();
    }, 1000);
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
          <BottomNavLink
            icon={"dashboard"}
            title={"Dashboard"}
            link={"dashboard"}
            showModal={() => setShowLogoutModal(false)}
          />
          <BottomNavLink
            icon={"examinees"}
            title={"Examinees"}
            link={"examiners/exams"}
            showModal={() => setShowLogoutModal(false)}
          />
          <BottomNavLink
            icon={"test"}
            title={"Test Bank"}
            link={"assessments/test-bank"}
            showModal={() => setShowLogoutModal(false)}
          />
          <BottomNavLink
            icon={"logout"}
            title={"Logout"}
            link={"auth/logout"}
            showModal={() => setShowLogoutModal(true)}
          />
        </div>
      </div>
    </>
  );
};

export default BottomNav;
