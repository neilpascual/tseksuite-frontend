import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./layouts/admin/MainLayout";

// Auth
import LoginForm from "./components/auth/LoginForm";

// Protected Routes
import AdminProtectedRoutes from "../routes/AdminProtectedRoutes";

// Applicant Pages
import ApplicantOnboardingPage from "./pages/applicant/ApplicantOnboardingPage";
import ApplicantTestPage from "./pages/applicant/TestPage";
import TestInstructions from "./pages/applicant/TestInstructions";
import CompletedTestResults from "./pages/applicant/CompletedTestResults";
import AbandonedTestScreen from "./pages/applicant/AbandonTestScreen";

// Admin Pages - Dashboard
import DashboardPage from "./pages/admin/DashboardPage";

// Admin Pages - Examiners Tab
import ExamsDashboard from "./pages/admin/ExamsDashboard";
import TestPage from "./pages/admin/ApplicantsTab/TestsPage";
import ResultsPage from "./pages/admin/ApplicantsTab/ResultsPage/ResultsPage";

// Admin Pages - Assessments Tab
import TestBankPage from "./pages/admin/AssesmentsTab/TestBankPage";

// Error & Utility Components
import ErrorMessage from "./pages/admin/ErrorMessage";
import AbandonTracker from "./components/AbandonTracker";

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* Root Redirect */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* ==================== PUBLIC ROUTES ==================== */}

        {/* Authentication */}
        <Route path="/auth/login" element={<LoginForm />} />

        {/* Applicant Routes */}
        <Route path="/take-quiz/:token" element={<ApplicantOnboardingPage />} />
        <Route path="/test-instructions" element={<TestInstructions />} />
        <Route path="/completed-test" element={<CompletedTestResults />} />
        <Route path="/abandoned" element={<AbandonedTestScreen />} />

        {/* Test Page with Abandon Tracking */}
        <Route
          path="/test-page"
          element={
            <AbandonTracker>
              <ApplicantTestPage />
            </AbandonTracker>
          }
        />

        {/* ==================== PROTECTED ROUTES ==================== */}

        <Route element={<AdminProtectedRoutes />}>
          <Route path="admin" element={<MainLayout />}>
            <Route index path="dashboard" element={<DashboardPage />} />

            {/* Examiners Submenu */}
            <Route path="examiners/exams" element={<ExamsDashboard />} />
            <Route path="examiners/tests" element={<TestPage />} />
            <Route path="examiners/results" element={<ResultsPage />} />

            {/* Assessments Submenu */}
            <Route path="assessments/test-bank" element={<TestBankPage />} />
          </Route>
        </Route>

        {/* ==================== ERROR HANDLING ==================== */}

        {/* 404 - Catch All */}
        <Route path="*" element={<ErrorMessage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
