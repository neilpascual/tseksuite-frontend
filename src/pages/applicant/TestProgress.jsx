import React from "react";
import Footer from "../../components/applicant/Footer";

const TestProgress = () => {
  // Test progress data
  const progressSteps = [
    { 
      id: 1, 
      name: "Problem Solving", 
      status: "completed" 
    },
    { 
      id: 2, 
      name: "Time Management", 
      status: "not-completed" 
    },
    { 
      id: 3, 
      name: "OCEAN (5)", 
      status: "not-completed" 
    },
    { 
      id: 4, 
      name: "Communication", 
      status: "not-completed" 
    },
    { 
      id: 5, 
      name: "Motivation", 
      status: "not-completed" 
    },
  ];

  const handleProceed = () => {
    // Navigate to next test section
    console.log("Proceeding to next test");
    // Add navigation logic here
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="w-full max-w-6xl">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-cyan-600 text-center mb-12 sm:mb-16">
            Test Progress
          </h1>

          {/* Progress Steps - Desktop/Tablet View (horizontal) */}
          <div className="hidden md:block mb-12 sm:mb-16">
            <div className="flex items-center justify-between px-4">
              {progressSteps.map((step, index) => (
                <React.Fragment key={step.id}>
                  {/* Step Circle and Label */}
                  <div className="flex flex-col items-center relative">
                    {/* Circle */}
                    <div
                      className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                        step.status === "completed"
                          ? "bg-cyan-600 border-cyan-600"
                          : "bg-white border-cyan-600 border-dashed"
                      }`}
                    >
                      {step.status === "completed" && (
                        <svg
                          className="w-7 h-7 lg:w-8 lg:h-8 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Status Text */}
                    <p className="text-gray-400 text-xs sm:text-sm mt-2">
                      Completed
                    </p>

                    {/* Step Name */}
                    <p
                      className={`text-sm lg:text-base font-medium mt-1 text-center max-w-[100px] lg:max-w-[120px] ${
                        step.status === "completed"
                          ? "text-cyan-600"
                          : "text-gray-900"
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>

                  {/* Connecting Line */}
                  {index < progressSteps.length - 1 && (
                    <div className="flex-1 h-1 bg-gray-300 mx-2 mb-16"></div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Progress Steps - Mobile View (vertical) */}
          <div className="md:hidden mb-12 px-4">
            <div className="flex flex-col items-start space-y-6 max-w-md mx-auto">
              {progressSteps.map((step, index) => (
                <div key={step.id} className="w-full">
                  <div className="flex items-center">
                    {/* Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-4 flex-shrink-0 transition-all duration-300 ${
                        step.status === "completed"
                          ? "bg-cyan-600 border-cyan-600"
                          : "bg-white border-cyan-600 border-dashed"
                      }`}
                    >
                      {step.status === "completed" && (
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>

                    {/* Step Info */}
                    <div className="ml-4 flex-1">
                      <p
                        className={`text-base font-medium ${
                          step.status === "completed"
                            ? "text-cyan-600"
                            : "text-gray-900"
                        }`}
                      >
                        {step.name}
                      </p>
                      <p className="text-gray-400 text-sm">Completed</p>
                    </div>
                  </div>

                  {/* Connecting Line */}
                  {index < progressSteps.length - 1 && (
                    <div className="w-1 h-8 bg-gray-300 ml-6 my-2"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Proceed Button */}
          <div className="flex justify-center mt-8 sm:mt-12 px-4">
            <button
              onClick={handleProceed}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-10 sm:px-16 py-3 sm:py-3.5 rounded-lg transition-colors duration-200 inline-flex items-center gap-2 text-base sm:text-lg w-full sm:w-auto justify-center"
              style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
            >
              Proceed
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
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TestProgress;