import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/applicant/Footer";

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

    setQuizData(selectedQuiz);
  }, []);

  const handleStartTest = () => {
    console.log("Starting test...");

    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) elem.msRequestFullscreen();
    // Navigate to the test page
    navigate("/test-page", {
      state: {
        quizData,
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
                </p>
                <p className="text-gray-600 text-sm">
                  Time Limit: {formatTimeLimit(quizData.time_limit)}
                </p>
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
            <div className="space-y-2 sm:space-y-3 mb-8 sm:mb-10 lg:mb-12">
              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
                  />
                </svg>
                <span className="text-gray-800 text-sm sm:text-base">
                  Check Your Internet Connection
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-800 text-sm sm:text-base">
                  Manage your time - Timer will start once you begin
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-gray-800 text-sm sm:text-base">
                  Read each question carefully before answering
                </span>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 text-gray-800"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-gray-800 text-sm sm:text-base">
                  You cannot go back to previous questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Start Test Button - Fixed at bottom on mobile, inline on desktop */}
        <div className="mt-auto pt-8 sm:pt-0 sm:mt-0 w-full max-w-3xl lg:mx-auto">
          <button
            onClick={handleStartTest}
            className="bg-cyan-600 hover:bg-cyan-700 text-white  font-semibold px-10 py-3 rounded-lg shadow-lg transition-colors duration-200 flex items-center gap-2 text-sm group"
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
