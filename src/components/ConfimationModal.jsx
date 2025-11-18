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
      className="fixed inset-0 backdrop-blur-sm bg-opacity-40 flex items-center justify-center z-50 px-2"
      style={{ fontFamily: "Poppins, sans-serif" }}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md  animate-fadeIn border-2 border-black"
        style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}
      >
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-cyan-600"
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
        <h2 className="text-xl sm:text-2xl font-bold text-center mb-3 text-gray-900">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 text-sm sm:text-base mb-6">
          {message}
        </p>

        {/* Checklist */}
        {checklist.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <ul className="space-y-2">
              {checklist.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <svg
                    className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
            className="flex-1 px-6 py-3 rounded-lg border-2 border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm transition-all duration-200"
            style={{ boxShadow: "3px 3px 0px 0px rgba(0, 0, 0, 1)" }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-6 py-3 rounded-lg text-white font-semibold text-sm transition-all duration-200 ${
              confirmColor === "green"
                ? "bg-cyan-600 hover:bg-cyan-700"
                : "bg-cyan-600 hover:bg-cyan-700"
            }`}
            style={{ boxShadow: "3px 3px 0px 0px rgba(0, 0, 0, 1)" }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;
