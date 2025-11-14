import {
  Menu,
  X,
  LayoutDashboard,
  User,
  ClipboardList,
  Layers2,
  NotepadText,
  CreditCard,
} from "lucide-react";
import SidebarHeader from "../SidebarHeader";
import SidebarLink from "../SidebarLink";
import SidebarSubmenu from "../SidebarSubmenu";
import { useState } from "react";
import SidebarFooter from "../SidebarFooter";

const AdminTopBar = () => {
  const [expanded, setExpanded] = useState(false);
  const [openExaminers, setOpenExaminers] = useState(false);
  const [openAssessments, setOpenAssessments] = useState(false);

  const getExpandedHeight = () => {
    let baseHeight = 80;

    if (!expanded) return baseHeight;

    let extraHeight = 200;

    if (openExaminers) extraHeight += 70;
    if (openAssessments) extraHeight += 80;

    return baseHeight + extraHeight;
  };

  return (
    <div
      className="absolute top-0 left-0 w-full bg-white shadow-md z-50 sm:hidden transition-all duration-200"
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
        <div className="mt-4  flex flex-col gap-2 px-3">
          <div onClick={() => setExpanded(false)}>
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
          </div>

          <SidebarLink
            // to="/admin/examiners"
            label="Examiners"
            icon={(active) => (
              <User
                className={`h-5 w-5 ${
                  active ? "text-white" : "text-[#2E99B0]"
                }`}
              />
            )}
            isOpen={openExaminers}
            toggleOpen={() => setOpenExaminers(!openExaminers)}
          />
          {openExaminers && (
            <div onClick={() => setExpanded(false)}>
              <SidebarSubmenu
                isOpen={openExaminers}
                items={[
                  {
                    icon: <Layers2 className="h-4 w-4" />,
                    label: "Tests",
                    to: "/admin/examiners/tests",
                  },
                  {
                    icon: <NotepadText className="h-4 w-4" />,
                    label: "Results",
                    to: "/admin/examiners/results",
                  },
                ]}
              />
            </div>
          )}

          <SidebarLink
            // to="/admin/assessments"
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
            <div onClick={() => setExpanded(false)}>
            <SidebarSubmenu
              isOpen={openAssessments}
              items={[
                {
                  icon: <CreditCard className="h-4 w-4" />,
                  label: "Test Bank",
                  to: "/admin/assessments/test-bank",
                },
              ]}
            />
            </div>
          )}
          <SidebarFooter />
        </div>
      )}
    </div>
  );
};

export default AdminTopBar;
