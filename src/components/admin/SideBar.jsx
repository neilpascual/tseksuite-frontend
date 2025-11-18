import { NavLink } from 'react-router-dom'

export default function SideBar() {
  return (
    <aside className='w-70 h-screen shadow-[4px_0px_4px_rgba(0,0,0,0.25)]'>
            <div className="flex flex-col">
                <div className='h-40 mx-2 my-3 rounded-lg bg-[#2E99B0]'>
                    {/* Dito yung card sa header sidebar */}
                </div>

                {/* Dito yung mga navlinks */}
                <div className='flex flex-col px-5 pt-10 gap-10'>
                    <NavLink 
                        className={({isActive, isPending}) => isPending ? "pending" : isActive ? "active" : ""}
                        to={'/admin/dashboard'} 
                        replace >
                        Dashboard
                    </NavLink>
                    <NavLink 
                        className={({isActive, isPending}) => isPending ? "pending" : isActive ? "active" : ""}
                        to={'/admin/applicants'} 
                        replace>
                        Applicants
                    </NavLink>
                    <NavLink 
                        className={({isActive, isPending}) => isPending ? "pending" : isActive ? "active" : ""}
                        to={'/admin/trainings'} 
                        replace>
                        Trainings
                    </NavLink>
                    <NavLink 
                        className={({isActive, isPending}) => isPending ? "pending" : isActive ? "active" : ""}
                        to={'/admin/assesments'} 
                        replace>
                        Assesments
                    </NavLink>
                </div>
            </div>
    </aside>
  )
}
