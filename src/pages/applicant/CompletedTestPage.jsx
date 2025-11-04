import React from "react";
import Footer from "../../components/applicant/Footer";

const CompletedTestPage = () => {
  const handleComplete = () => {
    // Navigate to Test Progress page
    console.log("Test completed");
    window.location.href = "/TestProgress";
  };

  return (
    <div
      className="min-h-screen bg-gray-50 flex flex-col"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl w-full text-center">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-600 mb-8">
            Congratulations!
          </h1>

          {/* Description */}
          <p className="text-gray-900 text-base sm:text-lg leading-relaxed mb-12 px-4">
            You have successfully completed the assessment! Your results are being 
            processed and will be available shortly. Thank you for taking the time 
            to complete this test. We appreciate your effort and will review your 
            performance carefully.
          </p>

          {/* Complete Button */}
          <button
            onClick={handleComplete}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-12 py-3.5 rounded-lg transition-colors duration-200 inline-flex items-center gap-2 text-lg"
            style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
          >
            View Results
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

export default CompletedTestPage;