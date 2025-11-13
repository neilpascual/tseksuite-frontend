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

import { act, useState } from "react";
// import { aC } from "react-router/dist/development/instrumentation-iAqbU5Q4";

const AdminSidebar = () => {
  const [openApplicants, setOpenApplicants] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);

  const toggleOpen = () => setOpenApplicants((prev) => !prev);
  return (
    <div className="h-screen ">
      <div className="hidden sm:flex h-full w-full max-w-[100px] sm:max-w-[200px] lg:max-w-[300px]  flex-col gap-4 text-[#2E99B0] border-r-2 border-gray-300 shadow-2xl py-6 items-center sm:items-start px-2">
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
          to=""
          label="Examinees"
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
                label: "Examinee List",
                to: "/admin/examiners/tests",
              },
              {
                icon: <NotepadText className="h-4 w-4 hidden sm:flex" />,
                label: "Results",
                to: "/admin/examiners/results",
              },
            ]}
          />
        )}

        <SidebarLink
          // to="/admin/assessments"
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
                to: "/admin/assessments/test-bank",
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
