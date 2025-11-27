import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/applicant/Footer";
import InstructionChecklist from "../../components/applicant/InstructionChecklist";

const TestInstructions = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [quizData, setQuizData] = useState(null);

  useEffect(() => {
    // Get quiz data from navigation state or localStorage
    const selectedQuiz =
      location.state?.selectedQuiz ||
      JSON.parse(localStorage.getItem("selectedQuiz") || "null");

    const applicantData =
      location.state?.applicantData ||
      JSON.parse(localStorage.getItem("applicantData") || "{}");

    if (!selectedQuiz || !applicantData.department) {
      // If no quiz selected, redirect back to quiz selection
      navigate("/quiz-selection");
      return;
    }

    console.log('Selected Quiz:', selectedQuiz);
    console.log('Quiz has pdf_link:', selectedQuiz?.pdf_link);
    console.log('Applicant Data', applicantData);

    setQuizData(selectedQuiz);
  }, [location, navigate]);

  const handleStartTest = () => {
    console.log("Starting test...");
    console.log("Quiz data being passed:", quizData);

    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    
    // Navigate to the test page with complete quiz data
    navigate("/test-page", {
      state: {
        quizData: quizData, // This should now include pdf_link
        applicantData: location.state?.applicantData,
      },
    });
  };

  const handleExit = () => {
    if (
      window.confirm(
        "Are you sure you want to exit? Your progress will not be saved."
      )
    ) {
      navigate("/");
    }
  };

  const formatTimeLimit = (minutes) => {
    if (!minutes) return "N/A";
    if (minutes < 60) {
      return `${minutes} minutes`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0
      ? `${hours} hour${hours > 1 ? "s" : ""} ${mins} minutes`
      : `${hours} hour${hours > 1 ? "s" : ""}`;
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Main Content */}
      <div className="flex-1 flex flex-col px-6 sm:px-8 lg:px-12 py-8 sm:py-12 lg:justify-center">
        <div className="w-full max-w-3xl lg:mx-auto">
          {/* Exit Button */}
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-gray-800 hover:text-gray-600 transition-colors mb-8 sm:mb-12 lg:mb-16"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="font-medium text-sm sm:text-base">Exit</span>
          </button>

          {/* Instructions Section */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-600 mb-4 sm:mb-6">
              Instructions
            </h1>

            {/* Quiz Name */}
            {quizData && (
              <div className="mb-4">
                <p className="text-gray-900 font-semibold text-lg">
                  {quizData.quiz_name}
                  {quizData.pdf_link && (
                    <span className="ml-2 px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-md">
                      PDF Test
                    </span>
                  )}
                </p>
                {!quizData.time_limit || quizData.time_limit === 0 ? (
                  <p className="text-gray-600 text-sm"></p>
                ) : (
                  <p className="text-gray-600 text-sm">
                  Time Limit: {formatTimeLimit(quizData.time_limit)}
                </p>
                )}
                
              </div>
            )}

            <p className="text-gray-800 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8">
              Welcome! This short test will help us understand your current
              level and areas for improvement. Take a moment to review the
              guidelines below before you begin. Make sure you're in a quiet
              place with a stable internet connection, and take your time to
              read each question carefully.
            </p>

            {/* Checklist */}
            <InstructionChecklist />
          </div>
        </div>

        {/* Start Test Button - Fixed at bottom on mobile, inline on desktop */}
        <div className="mt-auto pt-8 sm:pt-0 sm:mt-0 w-full max-w-3xl lg:mx-auto">
          <button
            onClick={handleStartTest}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-10 py-3 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm group"
            style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
          >
            Start Test
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TestInstructions;