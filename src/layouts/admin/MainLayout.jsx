import { Outlet } from "react-router";
import AdminSideBar from "../../components/admin/AdminSidebar/SideBar";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminTopBar from "../../components/admin/AdminSidebar/AdminMobile/AdminTopBar";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex overflow-hidden">
      {/* Components Sidebar */}
      <div className="hidden sm:block">
        <AdminSideBar />
      </div>
      <div className="sm:hidden">
        <AdminTopBar />
      </div>

      {/* Content here */}
      <section className="h-screen w-full p-2 sm:px-5 sm:py-1 md:px-10 md:py-2.5 lg:px-15 lg:py-5 xl:px-35 xl:py-10 bg-white  overflow-y-auto ">
        <Outlet />
      </section>
    </div>
  );
}

export default MainLayout;
