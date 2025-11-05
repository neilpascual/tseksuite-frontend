import {
  Menu,
  X,
  LayoutDashboard,
  User,
  Captions,
  ClipboardList,
  Layers2,
  Package,
  NotepadText,
  ArrowUpNarrowWide,
} from "lucide-react";
import SidebarHeader from "../SidebarHeader";
import SidebarLink from "../SidebarLink";
import SidebarSubmenu from "../SidebarSubmenu";
import { useState } from "react";

const AdminTopBar = () => {
  const [expanded, setExpanded] = useState(false);
  const [openApplicants, setOpenApplicants] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);

  const getExpandedHeight = () => {
    let baseHeight = 80;

    if (!expanded) return baseHeight;

    let extraHeight = 180;

    if (openApplicants) extraHeight += 70;
    if (openTrainings) extraHeight += 120;
    if (openAssessments) extraHeight += 80;

    return baseHeight + extraHeight;
  };

  return (
    <div
      className="absolute top-0 left-0 w-full bg-white shadow-md z-50 sm:hidden transition-all duration-300"
      style={{ height: `${getExpandedHeight()}px` }}
    >
      <div className="w-full pt-3 pr-5 flex justify-between items-center">
        {/* <SidebarHeader size={20} />
         */}
        <SidebarHeader size={50} />
        <button onClick={() => setExpanded(!expanded)}>
          {expanded ? (
            <X className="h-6 w-6 text-[#2E99B0]" />
          ) : (
            <Menu className="h-6 w-6 text-[#2E99B0]" />
          )}
        </button>
      </div>

      {/* Expanded content below */}
      {expanded && (
        <div className="mt-4  flex flex-col gap-2">
          <SidebarLink
            to="/admin/dashboard"
            label="Dashboard"
            icon={(active) => (
              <LayoutDashboard
                className={`h-5 w-5 ${
                  active ? "text-white" : "text-[#2E99B0]"
                }`}
              />
            )}
          />

          <SidebarLink
            to="/admin/applicants"
            label="Applicants"
            icon={(active) => (
              <User
                className={`h-5 w-5 ${
                  active ? "text-white" : "text-[#2E99B0]"
                }`}
              />
            )}
            isOpen={openApplicants}
            toggleOpen={() => setOpenApplicants(!openApplicants)}
          />
          {openApplicants && (
            <SidebarSubmenu
              isOpen={openApplicants}
              items={[
                {
                  icon: <Layers2 className="h-4 w-4" />,
                  label: "Tests",
                  to: "/admin/applicants/",
                },
                {
                  icon: <NotepadText className="h-4 w-4" />,
                  label: "Results",
                  to: "/admin/applicants/results",
                },
              ]}
            />
          )}

          <SidebarLink
            to="/admin/trainings"
            label="Trainings"
            icon={(active) => (
              <Captions
                className={`h-5 w-5 ${
                  active ? "text-white" : "text-[#2E99B0]"
                }`}
              />
            )}
            isOpen={openTrainings}
            toggleOpen={() => setOpenTrainings(!openTrainings)}
          />
          {openTrainings && (
            <SidebarSubmenu
              isOpen={openTrainings}
              items={[
                {
                  icon: <Package className="h-4 w-4" />,
                  label: "Modules",
                  to: "/admin/trainings/",
                },
                {
                  icon: <NotepadText className="h-4 w-4" />,
                  label: "Tests",
                  to: "/admin/trainings/tests",
                },
                {
                  icon: <ArrowUpNarrowWide className="h-4 w-4" />,
                  label: "Progress",
                  to: "/admin/trainings/progress",
                },
              ]}
            />
          )}

          <SidebarLink
            to="/admin/assessments"
            label="Assessments"
            icon={(active) => (
              <ClipboardList
                className={`h-5 w-5 ${
                  active ? "text-white" : "text-[#2E99B0]"
                }`}
              />
            )}
            isOpen={openAssessments}
            toggleOpen={() => setOpenAssessments(!openAssessments)}
          />
          {openAssessments && (
            <SidebarSubmenu
              isOpen={openAssessments}
              items={[
                {
                  icon: <CreditCard className="h-4 w-4" />,
                  label: "Test Bank",
                },
                {
                  icon: <BrickWall className="h-4 w-4" />,
                  label: "Test Builder",
                },
              ]}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTopBar;
