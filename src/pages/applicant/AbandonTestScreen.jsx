import React from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, XCircle, Home, RefreshCw } from "lucide-react";

const AbandonedTestScreen = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    localStorage.removeItem("pendingAbandon");
    navigate("/test-instructions");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-red-50 to-orange-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="max-w-3xl w-full">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
            <div className="relative bg-white rounded-full p-6 shadow-2xl flex items-center justify-center">
              <XCircle className="w-5 h-5 md:w-16 md:h-16 text-red-500" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 md:p-10 mb-6">
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              Test Abandoned
            </h1>
            <p className="text-xs sm:text-lg text-gray-600">
              Your assessment session has been terminated
            </p>
          </div>

          {/* What Happened Section */}
          <div className="bg-linear-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:gap-6 gap-4">
              <div className="shrink-0">
                <AlertTriangle className="w-4 h-4 sm:w-8 sm:h-8 text-red-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-md sm:text-xl font-bold text-red-900 mb-2">
                  What Happened?
                </h3>
                <p className="text-red-800 mb-2 sm:mb-3 text-xs sm:text-base">
                  You left or closed the test before completion. Your attempt has been marked as <strong>ABANDONED</strong>.
                </p>
                <div className="hidden bg-white/80 sm:block rounded-lg p-3 sm:p-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold">⚠️ Reason:</span> Tab switching or window minimizing was detected
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">📋 Status:</span> Test terminated and recorded
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-md sm:text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
              Next Steps
            </h3>
            <ol className="space-y-2 text-blue-800 text-xs sm:text-base">
              <li className="flex items-start gap-2 ">
                <span className="font-bold">1.</span>
                <span>Contact your HR representative to discuss this incident</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                <span>Request authorization to retake the assessment</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                <span>Ensure a stable environment before your next attempt</span>
              </li>
            </ol>
          </div>

          {/* Restart Button */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRestart}
              className="flex-1 inline-flex items-center justify-center gap-3 bg-linear-to-r from-[#217486] to-[#2E99B0] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" />
              Restart Test
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-xs sm:text-sm">
          <p>If you believe this was an error, please contact technical support</p>
        </div>
      </div>
    </div>
  );
};

export default AbandonedTestScreen;
