import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ApplicantOnboardingPage from "./pages/applicant/ApplicantOnboardingPage";
import ApplicantTestPage from "./pages/applicant/TestPage";
import CompletedTestResults from "./pages/applicant/CompletedTestResults";
import { Toaster } from "react-hot-toast";
import AdminProtectedRoutes from "../routes/AdminProtectedRoutes";
import DashboardPage from "./pages/admin/DashboardPage";
//
import LoginForm from "./components/auth/LoginForm";
//
import MainLayout from "./layouts/admin/MainLayout";
import TestPage from "./pages/admin/ApplicantsTab/TestsPage";

//added results page import
import ResultsPage from "./pages/admin/ApplicantsTab/ResultsPage";
import ComingSoon from "./components/ComingSoon";
import TestBankPage from "./pages/admin/AssesmentsTab/TestBankPage";

// import NotFound from './components/NotFound'
import ErrorMessage from "./pages/admin/ErrorMessage";
import TestInstructions from "./pages/applicant/TestInstructions";

import AbandonTracker from "./components/AbandonTracker";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {" "}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />
        {/* Applicant Routes */}
        <Route path="/take-quiz/:token" element={<ApplicantOnboardingPage />} />
        <Route path="/test-instructions" element={<TestInstructions />} />
        <Route path="/completed-test" element={<CompletedTestResults />} />
        {/* This is the start of monitoring */}
        <Route
          path="/test-page"
          element={
            <AbandonTracker>
              <ApplicantTestPage />
            </AbandonTracker>
          }
        />
        {/* End of Monitoring */}
        <Route path="/auth/login" element={<LoginForm />} />
        {/* ProtectedRoutes */}
        {/* /admin protected routes */}
        <Route element={<AdminProtectedRoutes />}>
          <Route path="admin" element={<MainLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />

            {/* examiners submenu route */}
            <Route path="examiners/tests" element={<TestPage />} />
            <Route path="examiners/results" element={<ResultsPage />} />

            {/* assessments submenu routes */}
            <Route path="assessments/test-bank" element={<TestBankPage />} />
          </Route>
        </Route>
        {/* <Route path='*' element={<NotFound/>}/> */}
        <Route path="*" element={<ErrorMessage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
