import { BrowserRouter, Routes, Route } from 'react-router'
import OnboardingPage from './pages/applicant/OnboardingPage' 
import DashboardPage from './pages/admin/DashboardPage'
import ErrorMessage from './pages/admin/ErrorMessage'
function App() {

  return (
   <BrowserRouter>
      <Routes>
        <Route path='/' element={ <OnboardingPage/> }/>
        {/* /admin */}
        <Route path='/admin/dashboard' element={ <DashboardPage/>} />
        <Route path='*' element={ <ErrorMessage/> }/>
      </Routes>
   </BrowserRouter>
  )
}

export default App
