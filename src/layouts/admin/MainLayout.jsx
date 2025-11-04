import { Outlet } from "react-router";
import AdminSideBar from "../../components/admin/AdminSideBar";
function MainLayout() {
  return (
    <div className='flex overflow-hidden'>

        {/* Components Sidebar */}
        <AdminSideBar/>

        {/* Content here */}
        <section className='h-screen w-full p-2 sm:px-5 sm:py-1 md:px-10 md:py-2.5 lg:px-15 lg:py-5 xl:px-35 xl:py-10 bg-[#F9FAFB] overflow-y-auto'>
            <Outlet/>
        </section>
    </div>
  )
}

export default MainLayout;
