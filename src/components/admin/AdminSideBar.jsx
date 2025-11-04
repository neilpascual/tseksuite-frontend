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
import { NavLink } from "react-router-dom";

const AdminSideBar = () => {
  const [openApplicants, setOpenApplicants] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);
  return (
    <div className="h-screen">
      <div className="h-full w-full max-w-[100px] sm:max-w-[200px] md:max-w-[200px] lg:max-w-[300px] flex flex-col gap-6 text-[#2E99B0] border-r-2 border-gray-300 shadow-2xl py-6 px-4 sm:px-6 items-center sm:items-start">
        {/* Header */}
        <div className="w-full flex items-center gap-3 sm:bg-[#2E99B0] rounded-full sm:rounded-3xl sm:px-3 sm:py-6">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden aspect-square">
            <img
              src="/assets/sampleImage.png"
              alt="Avatar"
              className="w-full h-full object-cover "
            />
          </div>
          <div className="hidden sm:flex flex-col gap-1">
            <div className="text-white text-sm font-semibold">Neil Pascual</div>
            <div className="h-px w-full bg-white opacity-30" />
            <div className="text-white text-xs font-light">
              Software Engineer
            </div>
          </div>
        </div>

        {/* Dashboard */}
        <div className="flex items-center gap-2 mt-10">
          <LayoutDashboard className="h-5 w-5" />
          <span className="text-[#2E99B0] font-bold text-sm sm:text-base hidden sm:inline">
            Dashboard
          </span>
        </div>

        {/* Section: Applicants */}
        <div
          onClick={() => setOpenApplicants(!openApplicants)}
          className="flex items-center  justify-center sm:justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <span className="text-[#2E99B0] font-bold text-sm sm:text-base hidden sm:inline">
              Applicants
            </span>
          </div>
          {openApplicants ? (
            <ChevronUp className="h-5 w-5 hidden sm:inline" />
          ) : (
            <ChevronDown className="h-5 w-5 hidden sm:inline" />
          )}
        </div>
        {openApplicants && (
          <div className="flex flex-col gap-2 sm:pl-6 pl-2">
            <div className="flex items-center gap-2">
              <Layers2 className="h-4 w-4" />
              <span className="text-sm">Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <NotepadText className="h-4 w-4" />
              <span className="text-sm">Results</span>
            </div>
          </div>
        )}

        {/* Section: Trainings */}
        <div
          onClick={() => setOpenTrainings(!openTrainings)}
          className="flex items-center justify-center sm:justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Captions className="h-5 w-5" />
            <span className="text-[#2E99B0] font-bold text-sm sm:text-base  hidden sm:inline">
              Trainings
            </span>
          </div>
          {openTrainings ? (
            <ChevronUp className="h-5 w-5  hidden sm:inline" />
          ) : (
            <ChevronDown className="h-5 w-5  hidden sm:inline" />
          )}
        </div>
        {openTrainings && (
          <div className="flex flex-col gap-2 sm:pl-6 pl-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="text-sm">Modules</span>
            </div>
            <div className="flex items-center gap-2">
              <NotepadText className="h-4 w-4" />
              <span className="text-sm">Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpNarrowWide className="h-4 w-4" />
              <span className="text-sm">Progress</span>
            </div>
          </div>
        )}

        {/* Section: Assessments */}
        <div
          onClick={() => setOpenAssessments(!openAssessments)}
          className="flex items-center justify-center sm:justify-between w-full cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            <span className="text-[#2E99B0] font-bold text-sm sm:text-base  hidden sm:inline">
              Assessments
            </span>
          </div>
          {openAssessments ? (
            <ChevronUp className="h-5 w-5  hidden sm:inline" />
          ) : (
            <ChevronDown className="h-5 w-5  hidden sm:inline" />
          )}
        </div>
        {openAssessments && (
          <div className="flex flex-col gap-2 sm:pl-6 pl-2">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="text-sm">Test Bank</span>
            </div>
            <div className="flex items-center gap-2">
              <BrickWall className="h-4 w-4" />
              <span className="text-sm">Test Builder</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto  w-full flex items-center justify-center sm:justify-between bg-[#2E99B0] rounded-xl px-4 py-3">
          <LogOut
            className="h-5 w-5 text-white sm:hidden"
            onClick={() => console.log("Logout clicked")}
          />
          <div className="hidden sm:flex items-center gap-3">
            <img src="/assets/Logo.png" alt="SuiteTest Logo" className="h-5" />
            <span className="text-white text-sm lg:ml-25">Logout</span>
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
  );
};
export default AdminSideBar;
