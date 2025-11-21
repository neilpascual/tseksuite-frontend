import React from "react";

const ConfirmationModal = ({
  title = "Are you sure?",
  message = "Please confirm your action.",
  checklist = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onClose,
  onConfirm,
  confirmColor = "cyan",
}) => {
  return (
    <div
      className="fixed inset-0 bg-blur bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Modal Container */}
      <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-lg border-2 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center shadow-md">
            <svg
              className="w-10 h-10 text-cyan-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-extrabold text-center text-gray-900 mb-3">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 text-base mb-6">{message}</p>

        {/* Checklist */}
        {checklist.length > 0 && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
            <ul className="space-y-2">
              {checklist.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-gray-700 text-sm sm:text-base"
                >
                  <svg
                    className="w-5 h-5 text-cyan-600 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-6 rounded-lg border-2 border-gray-300 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-all duration-200 shadow-sm"
            style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-6 rounded-lg text-white font-semibold text-sm transition-all duration-200 shadow-sm ${
              confirmColor === "green"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-cyan-600 hover:bg-cyan-700"
            }`}
            style={{ boxShadow: "3px 3px 0px 0px rgba(0,0,0,1)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
