import SidebarHeader from "./SidebarHeader";
import SidebarLink from "./SidebarLink";
import SidebarSubmenu from "./SidebarSubmenu";
import SidebarFooter from "./SidebarFooter";

import {
  LayoutDashboard,
  User,
  Captions,
  ClipboardList,
  Layers2,
  NotepadText,
  Package,
  ArrowUpNarrowWide,
  CreditCard,
  BrickWall,
} from "lucide-react";

import { useState } from "react";

const AdminSidebar = () => {
  const [openApplicants, setOpenApplicants] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);

  return (
    <div className="h-screen ">
      <div className="hidden sm:flex h-full w-full max-w-[80px] sm:max-w-[200px] lg:max-w-[300px]  flex-col gap-4 text-[#2E99B0] border-r-2 border-gray-300 shadow-2xl py-6 items-center sm:items-start">
        <SidebarHeader />

        <SidebarLink
          to="/admin/dashboard"
          label="Dashboard"
          icon={(active) => (
            <LayoutDashboard
              className={`h-5 w-5 ${active ? "text-white" : "text-[#2E99B0]"}`}
            />
          )}
        />

        <SidebarLink
          to="/admin/examiners"
          label="Examiners"
          icon={(active) => (
            <User
              className={`h-5 w-5 ${active ? "text-white" : "text-[#2E99B0]"}`}
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
                icon: <Layers2 className="h-4 w-4 hidden sm:flex" />,
                label: "Tests",
                to: "/admin/examiners/",
              },
              {
                icon: <NotepadText className="h-4 w-4 hidden sm:flex" />,
                label: "Results",
                //Neil: added to route results page
                to: "/admin/examiners/results",
              },
            ]}
          />
        )}

        <SidebarLink
          to="/admin/trainings"
          label="Trainings"
          icon={(active) => (
            <Captions
              className={`h-5 w-5 ${active ? "text-white" : "text-[#2E99B0]"}`}
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
                icon: <NotepadText className="h-4 w-4 hidden sm:flex" />,
                label: "Tests",
                to: "/admin/trainings/tests",
              },
              {
                icon: <Package className="h-4 w-4 hidden sm:flex " />,
                label: "Modules",
                to: "/admin/trainings/modules",
              },

              {
                icon: <ArrowUpNarrowWide className="h-4 w-4 hidden sm:flex" />,
                label: "Progress",
                to: "/admin/trainings/progress",
              },
            ]}
          />
        )}

        <SidebarLink
          to="/admin/assesments"
          label="Assessments"
          icon={(active) => (
            <ClipboardList
              className={`h-5 w-5 ${active ? "text-white" : "text-[#2E99B0]"}`}
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
                icon: <CreditCard className="h-4 w-4 hidden sm:flex" />,
                label: "Test Bank",
                to: "/admin/assessments/",
              },
              {
                icon: <BrickWall className="h-4 w-4 hidden sm:flex" />,
                label: "Test Builder",
                to: "/admin/trainings/test-builder",
              },
            ]}
          />
        )}

        <SidebarFooter />
      </div>
    </div>
  );
};

export default AdminSidebar;
