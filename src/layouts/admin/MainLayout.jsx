import { Outlet } from "react-router";
import AdminSideBar from "../../components/admin/AdminSideBar";
function MainLayout() {
  return (
    <div className='flex overflow-hidden'>

        {/* Components Sidebar */}
        <SideBar/>

        {/* Content here */}
        <section className='h-screen w-full px-40 py-10'>
            <Outlet/>
        </section>
    </div>
  )
}

export default MainLayout;
