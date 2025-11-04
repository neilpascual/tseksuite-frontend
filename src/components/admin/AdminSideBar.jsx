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
} from "lucide-react";
import { useState } from "react";

const AdminSideBar = () => {
  const [openApplicants, setOpenApplicants] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);

  return (
    <div className="h-screen ">
      <div className="h-full max-w-[25%] flex flex-col gap-6 text-[#2E99B0]  border-r-2 border-gray-300 shadow-2xl p-6 ">
        <div className="w-full h-[12%] rounded-3xl bg-[#2E99B0] px-2 py-6 flex items-center gap-1">
          {/* Avatar on the left */}
          <div className="h-20 w-20 rounded-full ">
            <img
              src="/assets/sampleImage.png"
              alt="Avatar"
              className="h-full w-full rounded-full object-cover p-2"
            />
          </div>

          {/* Name and status on the right */}
          <div className="flex flex-col">
            <div className="text-lg font-sans text-white">Neil Pascual</div>
            <div className="w-full h-[1px] bg-white opacity-30" />
            <div className="text-sm font-extralight text-white">
              Software Engineer
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-10">
          <LayoutDashboard className="h-5 w-5" />{" "}
          <span className="text-[#2E99B0] text-lg font-bold">Dashboard</span>
        </div>
        {/* Applicant Section */}
        <div
          onClick={() => setOpenApplicants(!openApplicants)}
          className="flex items-center w-full cursor-pointer"
        >
          <User className="h-5 w-5" />
          <span className="text-[#2E99B0] text-lg font-bold ml-2">
            Applicants
          </span>
          {openApplicants ? (
            <ChevronUp className="ml-auto h-5 w-5 text-[#2E99B0]" />
          ) : (
            <ChevronDown className="ml-auto h-5 w-5 text-[#2E99B0]" />
          )}
        </div>

        {openApplicants && (
          <>
            <div className="flex items-center ml-15 text-[#2E99B0] font-medium">
              <Layers2 className="h-5 w-5 mr-2" />
              <span>Tests</span>
            </div>
            <div className="flex items-center ml-15 text-[#2E99B0] font-medium">
              <NotepadText className="h-5 w-5 mr-2" />
              <span>Results</span>
            </div>
          </>
        )}
        {/* Training Section */}
        <div
          onClick={() => setOpenTrainings(!openTrainings)}
          className="flex items-center w-full cursor-pointer"
        >
          <Captions className="h-5 w-5" />
          <span className="text-[#2E99B0] text-lg font-bold ml-2">
            Trainings
          </span>
          {openTrainings ? (
            <ChevronUp className="ml-auto h-5 w-5 text-[#2E99B0]" />
          ) : (
            <ChevronDown className="ml-auto h-5 w-5 text-[#2E99B0]" />
          )}
        </div>

        {openTrainings && (
          <>
            <div className="flex items-center ml-15 text-[#2E99B0] font-medium">
              <Package className="h-5 w-5 mr-2" />
              <span>Modules</span>
            </div>
            <div className="flex items-center ml-15 text-[#2E99B0] font-medium">
              <NotepadText className="h-5 w-5 mr-2" />
              <span>Tests</span>
            </div>
            <div className="flex items-center ml-15 text-[#2E99B0] font-medium">
              <ArrowUpNarrowWide className="h-5 w-5 mr-2" />
              <span>Progress</span>
            </div>
          </>
        )}
        {/* Assessments Section */}
        <div
          onClick={() => setOpenAssessments(!openAssessments)}
          className="flex items-center w-full cursor-pointer"
        >
          <ClipboardList className="h-5 w-5" />
          <span className="text-[#2E99B0] text-lg font-bold ml-2">
            Assessments
          </span>
          {openAssessments ? (
            <ChevronUp className="ml-auto h-5 w-5 text-[#2E99B0]" />
          ) : (
            <ChevronDown className="ml-auto h-5 w-5 text-[#2E99B0]" />
          )}
        </div>

        {openAssessments && (
          <>
            <div className="flex items-center ml-15 text-[#2E99B0] font-medium">
              <CreditCard className="h-5 w-5 mr-2" />
              <span>Test Bank</span>
            </div>
            <div className="flex items-center ml-15 text-[#2E99B0] font-medium">
              <BrickWall className="h-5 w-5 mr-2" />
              <span>Test Builder</span>
            </div>
          </>
        )}

        <div className="w-[23%] h-[7%] rounded-xl bg-[#2E99B0] px-2 py-6 flex items-center gap-1 mt-25 fixed bottom-10">
          <div className="ml-5">
            <img src="/assets/Logo.png" alt="Logo" />
          </div>
          <div className="ml-15 text-white">Logout</div>
          <span>
            <img src="/assets/Launchpad.png" alt="Logo" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminSideBar;
