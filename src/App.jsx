import { BrowserRouter, Routes, Route } from 'react-router'
import OnboardingPage from './pages/applicant/OnboardingPage'
import { Toaster } from 'react-hot-toast'
import AdminProtectedRoutes from '../routes/AdminProtectedRoutes'
import DashboardPage from './pages/admin/DashboardPage'
import LoginPage from './pages/auth/LoginPage'
import MainLayout from './layouts/admin/MainLayout'
import TestPage from './pages/admin/ApplicantsTab/TestsPage'
import ComingSoon from './components/ComingSoon'
import TestBankPage from './pages/admin/AssesmentsTab/TestBankPage'
import NotFound from './components/NotFound'

function App() {
  return (
    
      <BrowserRouter>
        <Toaster position='top-center' reverseOrder={false} />
        <Routes>
          {/* Applicant Routes */}
          <Route path='/' element={ <OnboardingPage/> }/>
          <Route path='/auth/login' element={<LoginPage/>} />

          {/* ProtectedRoutes */}
          {/* /admin protected routes */}
          <Route element={<AdminProtectedRoutes/>}>
            <Route path='admin' element={<MainLayout/>}>
              <Route index path='dashboard' element={<DashboardPage/>} />
              <Route path='applicants' element={<TestPage/>} />
              <Route path='trainings' element={<ComingSoon/>} />
              <Route path='assesments' element={<TestBankPage/>} />
            </Route>
          </Route>
          <Route path='*' element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
  )
}

export default App
