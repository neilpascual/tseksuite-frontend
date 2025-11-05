import { Outlet } from "react-router";
import AdminSideBar from "../../components/admin/AdminSidebar/AdminSideBar";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex overflow-hidden">
      {/* Components Sidebar */}
      <AdminSideBar />

      {/* Content here */}
      <section className="h-screen w-full p-2 sm:px-5 sm:py-1 md:px-10 md:py-2.5 lg:px-15 lg:py-5 xl:px-35 xl:py-10 bg-[#F9FAFB] overflow-y-auto">
        <Outlet />
      </section>
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static top-0 left-0 h-screen w-[280px] z-50 lg:z-10
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        bg-white shadow-xl lg:shadow-none
      `}
      >
        <AdminSideBar onItemClick={() => setSidebarOpen(false)} />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Admin Panel</h1>
          <div className="w-10"></div> {/* Spacer for balance */}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <section className="p-4 lg:p-6">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
