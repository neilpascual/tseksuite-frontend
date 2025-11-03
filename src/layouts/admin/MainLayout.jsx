import { Outlet } from 'react-router'
import SideBar from '../../components/admin/SideBar'

function MainLayout() {
  return (
    <div className='flex'>

        {/* Components Sidebar */}
        <SideBar/>

        {/* Content here */}
        <section>
            <Outlet/>
        </section>
    </div>
  )
}

export default MainLayout