import { BrowserRouter, Routes, Route } from "react-router";
import ApplicantOnboardingPage from "./pages/applicant/ApplicantOnboardingPage";
import ApplicantTestPage from "./pages/applicant/TestPage";
import QuizSelectionPage from "./pages/applicant/QuizSelectionPage";
import CompletedTestResults from "./pages/applicant/CompletedTestResults";
import { Toaster } from "react-hot-toast";
import AdminProtectedRoutes from "../routes/AdminProtectedRoutes";
import DashboardPage from "./pages/admin/DashboardPage";
import LoginPage from "./pages/auth/LoginPage";
import MainLayout from "./layouts/admin/MainLayout";
import TestPage from "./pages/admin/ApplicantsTab/TestsPage";
//added results page import
import ResultsPage from "./pages/admin/ApplicantsTab/ResultsPage";
import ComingSoon from "./components/ComingSoon";
import TestBankPage from "./pages/admin/AssesmentsTab/TestBankPage";

// import NotFound from './components/NotFound'
import ErrorMessage from "./pages/admin/ErrorMessage";
import TestInstructions from "./pages/applicant/TestInstructions";
import CompletedTestPage from "./pages/applicant/CompletedTestPage";
import TestBuilderPage from "./pages/admin/AssesmentsTab/TestBuilderPage";
import AbandonTracker from "./components/AbandonTracker";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Applicant Routes */}
        <Route path="/take-quiz/:token" element={<ApplicantOnboardingPage />} />
        <Route path="/test-instructions" element={<TestInstructions />} /> 

        
        <Route path="/quiz-selection" element={<QuizSelectionPage />} />
        <Route path="/completed-test" element={<CompletedTestResults />} />
        
        {/* This is the start of monitoring */}
        <Route path="/test-page" element={
          <AbandonTracker>
            <ApplicantTestPage /> 
          </AbandonTracker>} 
          />
        {/* End of Monitoring */}
        
        <Route path="/completed" element={ <CompletedTestPage /> } />
        <Route path="/auth/login" element={<LoginPage />} />
        {/* ProtectedRoutes */}
        {/* /admin protected routes */}
        <Route element={<AdminProtectedRoutes />}>
          <Route path="admin" element={<MainLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />

            {/* <Route path="examiners" element={<ComingSoon />} />
            <Route path="trainings" element={<ComingSoon />} />
            <Route path="assessments" element={<ComingSoon />} /> */}

            {/* examiners submenu route */}
            <Route path="examiners/tests" element={<TestPage />} />
            <Route path="examiners/results" element={<ResultsPage />} />

            {/* trainings submenu routes
            <Route path="trainings/tests" element={<ComingSoon />} />
            <Route path="trainings/modules" element={<ComingSoon />} />
            <Route path="trainings/progress" element={<ComingSoon />} /> */}

            {/* assessments submenu routes */}
            <Route path="assessments/test-bank" element={<TestBankPage />} />
            {/* <Route path="assessments/test-builder" element={<TestBuilderPage />} /> */}
            {/* <Route path="admin/applicants/results" element={<ResultsPage />} /> */}
          </Route>
        </Route>
        {/* <Route path='*' element={<NotFound/>}/> */}
        <Route path="*" element={<ErrorMessage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
