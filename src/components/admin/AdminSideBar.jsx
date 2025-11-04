import {
  ChevronDown,
  LayoutDashboard,
  ChevronUp,
  Layers2,
  NotepadText,
  Package,
  ArrowUpNarrowWide,
  Captions,
  User,
  ClipboardList,
  BrickWall,
  CreditCard,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { NavLink } from "react-router-dom";

const AdminSideBar = () => {
  const [openApplicants, setOpenApplicants] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };
  return (
    <div className="h-screen">
      <div className="h-full w-full max-w-[80px] sm:max-w-[200px] md:max-w-[200px] lg:max-w-[300px] flex flex-col gap-4 sm:gap-4 text-[#2E99B0] border-r-2 border-gray-300 shadow-2xl py-6 items-center sm:items-start">
        {/* Header */}

        <div className="px-3">
          <div className="w-full flex items-center gap-3 sm:bg-[#2E99B0] rounded-full sm:rounded-3xl sm:px-3 sm:py-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
              <img
                src="/assets/sampleImage.png"
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="hidden sm:flex flex-col gap-1">
              <div className="text-white text-sm font-semibold">
                Neil Pascual
              </div>
              <div className="h-px w-full bg-white opacity-30" />
              <div className="text-white text-xs font-light">
                Software Engineer
              </div>
            </div>
          </div>
        </div>
        {/* Dashboard */}
        <div className="w-full mt-10">
          <NavLink
            to="/admin/dashboard"
            replace
            className={({ isActive, isPending }) =>
              `flex items-center justify-center sm:justify-normal gap-2 py-2 px-4 w-full transition-colors ${
                isPending
                  ? "text-gray-400"
                  : isActive
                  ? "bg-[#2E99B0] text-white"
                  : "hover:bg-gray-100"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <LayoutDashboard
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-[#2E99B0]"
                  }`}
                />
                <span className="font-bold text-sm sm:text-base hidden sm:inline">
                  Dashboard
                </span>
              </>
            )}
          </NavLink>
        </div>

        {/* Section: Applicants */}
        <NavLink
          to="/admin/applicants"
          replace
          onClick={() => setOpenApplicants(!openApplicants)}
          className={({ isActive, isPending }) =>
            `flex items-center justify-center sm:justify-between w-full cursor-pointer px-4 py-2  transition-colors ${
              isPending
                ? "text-gray-400"
                : isActive
                ? "bg-[#2E99B0] text-white"
                : "hover:bg-gray-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-2">
                <User
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-[#2E99B0]"
                  }`}
                />
                <span className="font-bold text-sm sm:text-base hidden sm:inline">
                  Applicants
                </span>
              </div>
              {openApplicants ? (
                <ChevronUp className="h-5 w-5 hidden sm:inline" />
              ) : (
                <ChevronDown className="h-5 w-5 hidden sm:inline" />
              )}
            </>
          )}
        </NavLink>

        {openApplicants && (
          <div className="flex flex-col  sm:pl-6">
            {/* Toggle Chevron */}
            <div className="flex justify-center">
              <button
                onClick={() => setOpenApplicants(!openApplicants)}
                className="transition-transform duration-300"
              >
                {openApplicants ? (
                  <ChevronUp className="h-4 w-4 sm:hidden" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:hidden" />
                )}
              </button>
            </div>

            {/* Animated Submenu */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openApplicants
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              } flex flex-col gap-2 sm:pl-6`}
            >
              <div className="flex justify-center sm:items-center gap-2">
                <Layers2 className="h-4 w-4 hidden sm:flex lg:h-5 lg:w-5" />
                <span className="text-sm lg:text-md xl:text-lg mt-2 sm:mt-0">
                  Tests
                </span>
              </div>
              <div className="flex justify-center sm:items-center gap-2 sm:ml-2">
                <NotepadText className="h-4 w-4 hidden sm:flex lg:h-5 lg:w-5" />
                <span className="text-sm lg:text-md xl:text-lg">Results</span>
              </div>
            </div>
          </div>
        )}
        {/* Section: Trainings */}
        <NavLink
          to="/admin/trainings"
          replace
          onClick={() => setOpenTrainings(!openTrainings)}
          className={({ isActive, isPending }) =>
            `flex items-center justify-center sm:justify-between w-full cursor-pointer px-4 py-2  transition-colors ${
              isPending
                ? "text-gray-400"
                : isActive
                ? "bg-[#2E99B0] text-white"
                : "hover:bg-gray-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-2">
                <Captions
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-[#2E99B0]"
                  }`}
                />
                <span className="font-bold text-sm sm:text-base hidden sm:inline">
                  Trainings
                </span>
              </div>
              {openTrainings ? (
                <ChevronUp className="h-5 w-5 hidden sm:inline" />
              ) : (
                <ChevronDown className="h-5 w-5 hidden sm:inline" />
              )}
            </>
          )}
        </NavLink>

        {openTrainings && (
          <div className="flex flex-col sm:pl-6 ">
            {/* Toggle Chevron */}
            <div className="flex justify-center">
              <button
                onClick={() => setOpenTrainings(!openTrainings)}
                className="transition-transform duration-300"
              >
                {openTrainings ? (
                  <ChevronUp className="h-4 w-4 sm:hidden" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:hidden" />
                )}
              </button>
            </div>

            {/* Animated Submenu */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openTrainings
                  ? "max-h-[500px] opacity-100"
                  : "max-h-0 opacity-0"
              } flex flex-col gap-2 sm:pl-6`}
            >
              <div className="flex justify-center sm:items-center gap-2">
                <Package className="h-4 w-4 hidden sm:flex lg:h-5 lg:w-5" />
                <span className="text-sm lg:text-md xl:text-lg mt-2 sm:mt-0">
                  Modules
                </span>
              </div>
              <div className="flex justify-center sm:items-center gap-2">
                <NotepadText className="h-4 w-4 hidden sm:flex lg:h-5 lg:w-5" />
                <span className="text-sm  lg:text-md xl:text-lg">Tests</span>
              </div>
              <div className="flex justify-center sm:items-center gap-2">
                <ArrowUpNarrowWide className="h-4 w-4 hidden sm:flex lg:h-5 lg:w-5" />
                <span className="text-sm  lg:text-md xl:text-lg">Progress</span>
              </div>
            </div>
          </div>
        )}
        {/* Section: Assessments */}
        <NavLink
          to="/admin/assesments"
          replace
          onClick={() => setOpenAssessments(!openAssessments)}
          className={({ isActive, isPending }) =>
            `flex items-center justify-center sm:justify-between w-full cursor-pointer px-4 py-2  transition-colors ${
              isPending
                ? "text-gray-400"
                : isActive
                ? "bg-[#2E99B0] text-white"
                : "hover:bg-gray-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className="flex items-center gap-2">
                <ClipboardList
                  className={`h-5 w-5 ${
                    isActive ? "text-white" : "text-[#2E99B0]"
                  }`}
                />
                <span className="font-bold text-sm sm:text-base hidden sm:inline">
                  Assessments
                </span>
              </div>
              {openAssessments ? (
                <ChevronUp className="h-5 w-5 hidden sm:inline" />
              ) : (
                <ChevronDown className="h-5 w-5 hidden sm:inline" />
              )}
            </>
          )}
        </NavLink>

        {openAssessments && (
          <div className="flex flex-col sm:pl-6">
            {/* Toggle Chevron */}
            <div className="flex justify-center">
              <button
                onClick={() => setOpenAssessments(!openAssessments)}
                className="transition-transform duration-300"
              >
                {openAssessments ? (
                  <ChevronUp className="h-4 w-4 sm:hidden" />
                ) : (
                  <ChevronDown className="h-4 w-4 sm:hidden" />
                )}
              </button>
            </div>

            {/* Animated Submenu */}
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                openAssessments
                  ? "max-h-[500px] opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              } flex flex-col gap-2 sm:pl-6`}
            >
              <div className="flex justify-center sm:items-center gap-2">
                <CreditCard className="h-4 w-4 hidden sm:flex lg:h-5 lg:w-5" />
                <span className="text-sm lg:text-md xl:text-lg mt-2 sm:mt-0">
                  Test Bank
                </span>
              </div>
              <div className="flex sm:items-center ml-3 sm:ml-0 gap-2">
                <BrickWall className="h-4 w-4 hidden sm:flex lg:h-5 lg:w-5" />
                <span className="text-sm lg:text-md xl:text-lg">
                  Test Builder
                </span>
              </div>
            </div>
          </div>
        )}
        {/* Footer */}
        <div className="mt-auto w-full px-3">
          <div
            className="flex items-center justify-center sm:justify-between bg-[#2E99B0] rounded-xl py-3 lg:pl-3"
            onClick={handleLogout}
          >
            <LogOut
              className="h-5 w-5 text-white sm:hidden"
              // onClick={handleLogout}
            />
            <div className="hidden sm:flex items-center gap-3 px-3 ">
              <img
                src="/assets/Logo.png"
                alt="SuiteTest Logo"
                className="h-5 w-5"
              />
              <span className="text-white text-sm sm:ml-10 lg:ml-20 xl:ml-5xl:text-lg">
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
      </div>
    </div>
  );
};
export default AdminSideBar;
