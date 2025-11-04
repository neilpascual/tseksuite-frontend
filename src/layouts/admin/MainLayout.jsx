import { Outlet } from "react-router";
import AdminSideBar from "../../components/admin/AdminSideBar";
function MainLayout() {
  return (
    // <div className="flex">
    //   {/* Components Sidebar */}
    //   <AdminSideBar />
    //   {/* Content here */}
    //   <section>
    //     <Outlet />
    //   </section>
    // </div>
    <div className="flex h-screen overflow-hidden">
      {/* Fixed Sidebar */}
      <div className="fixed top-0 left-0 h-screen w-[250px] z-10">
        <AdminSideBar />
      </div>

      {/* Content Area */}
      <div className="ml-[250px] flex-1 overflow-y-auto">
        <section className="p-4">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default MainLayout;
