import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../src/hooks/useAuth'

export default function AdminProtectedRoutes({ children }) {

    const { data : user, isLoading, isError } = useAuth()

    if(isLoading) return <div className='flex items-center justify-center h-screen'> Loading ... </div> //change this to the official loader soon

    if( isError || !user) return <Navigate to={'/auth/login'} replace/>

    return <Outlet/>
}
