import { Outlet } from "react-router";
import BottomNav from "../../components/admin/BottomNav";
import { useState } from "react";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex overflow-hidden">
      {/* Components Sidebar */}
      {/* <div className="hidden sm:block">
        <AdminSideBar />
      </div>
      <div className="sm:hidden">
        <AdminTopBar />
      </div> */}

      {/* Content here */}
      <section className="h-screen w-full p-2 sm:px-5 sm:py-1 md:px-10 md:py-2.5 lg:px-15 lg:py-5 xl:px-35 xl:py-10 bg-white overflow-y-auto  mb-30 sm:mb-0">
        <Outlet />
      </section>
      <BottomNav />
    </div>
  );
}

export default MainLayout;
