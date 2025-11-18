import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { AlertTriangle, ShieldAlert } from "lucide-react";

function AbandonTracker({ children }) {
  const countdownRef = useRef(null);
  const warnedRef = useRef(false);
  const isLeavingRef = useRef(false); // Prevent double triggers
  const [showOverlay, setShowOverlay] = useState(false);
  const navigate = useNavigate();

  const applicantData = JSON.parse(localStorage.getItem('applicantData'))
  const selectedQuiz = JSON.parse(localStorage.getItem('selectedQuiz'))

  const handleAbandon = () => {

    const abandonData = {
      examiner_id: applicantData.examiner_id,
      quiz_id: selectedQuiz.quiz_id,
      answers: [],
      status: "ABANDONED",
      created_at: Date.now(),
    };

    const blob = new Blob([JSON.stringify(abandonData)], {
      type: "application/json",
    });

    try {
      const success = navigator.sendBeacon(
        `${import.meta.env.VITE_API_BASE_URL}/result/create`,
        blob
      );

      if (!success) {
        localStorage.setItem("pendingAbandon", JSON.stringify(abandonData));
      } else {
        localStorage.removeItem("pendingAbandon");
      }
    } catch (err) {
      console.error("❌ Beacon error:", err);
      localStorage.setItem("pendingAbandon", JSON.stringify(abandonData));
    } finally {
      navigate("/abandoned");
    }
  };

  const handleLeave = () => {
    if (isLeavingRef.current) return; // Prevent duplicate calls
    isLeavingRef.current = true;

    if (warnedRef.current) {
      // Second leave → abandon immediately
      handleAbandon();
    } else {
      // First leave → show warning
      warnedRef.current = true;
      setShowOverlay(true);
    }
  };

  const handleReturn = () => {
    isLeavingRef.current = false;
    setShowOverlay(false);
  };

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        handleLeave();
      } else {
        handleReturn();
      }
    };

    const onBlur = () => handleLeave();
    const onFocus = () => handleReturn();

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      clearInterval(countdownRef.current);
    };
  }, []);

  useEffect(() => {
    const processPending = async () => {
      const pending = localStorage.getItem("pendingAbandon");
      if (pending) {
        try {
          const data = JSON.parse(pending);
          await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/result/create`,
            data
          );
          localStorage.removeItem("pendingAbandon");
        } catch (err) {
          console.error("❌ Failed to submit pending abandon:", err);
        }
      }
    };
    processPending();
  }, []);

  return (
    <>
      {children}
      {showOverlay && (
        <div className="fixed inset-0 bg-linear-to-br from-red-900/95 via-red-800/95 to-orange-900/95 backdrop-blur-sm flex items-center justify-center z-9999 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-red-500 via-orange-500 to-red-500 animate-pulse"></div>
            
            <div className="flex justify-center mb-6">
              <div className="relative">
                <ShieldAlert className="w-12 h-12 sm:w-15 sm:h-15 text-red-500 animate-bounce" />
                <div className="absolute inset-0 animate-ping opacity-75">
                  <ShieldAlert className="w-12 h-12 sm:w-15 sm:h-15 text-red-400" />
                </div>
              </div>
            </div>

            <h2 className="text-md sm:text-lg lg:text-2xl font-bold text-gray-900 mb-3 text-center">
              ⚠️ Warning!
            </h2>
            
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 sm:h-6 sm:w-6 text-red-600 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-red-800 font-semibold mb-1 text-sm sm:text-xl lg:text-2xl">
                    Tab Switch Detected
                  </p>
                  <p className="text-red-700 text-xs sm:text-sm">
                    You left the test tab. If you leave again, your test will be{" "}
                    <span className="font-bold">automatically abandoned</span>.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-center text-gray-700 text-xs sm:text-sm mb-6">
              <p>✓ Stay on this tab throughout the test</p>
              <p>✓ Do not switch to other applications</p>
              <p>✓ Do not minimize this window</p>
            </div>

            <button
              onClick={handleReturn}
              className="w-full text-xs sm:text-sm bg-linear-to-r from-[#217486] to-[#2E99B0] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Continue Test            
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AbandonTracker;