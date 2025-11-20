import React, { useState } from "react";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const ConfirmationModal = ({
  title = "Are you sure?",
  message = "Please confirm your action.",
  checklist = [],
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onClose,
  onConfirm,
  confirmColor = "cyan",
  variant = "warning"
}) => {
  const [isHoveredConfirm, setIsHoveredConfirm] = useState(false);
  const [isHoveredCancel, setIsHoveredCancel] = useState(false);

  const variants = {
    warning: {
      bg: "bg-amber-100",
      iconColor: "text-amber-600",
      icon: AlertCircle
    },
    info: {
      bg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      icon: AlertCircle
    },
    success: {
      bg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      icon: CheckCircle2
    }
  };

  const currentVariant = variants[variant] || variants.info;
  const Icon = currentVariant.icon;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md bg-blur bg-opacity-50 flex items-center justify-center z-50 px-4 animate-fadeIn"
      style={{ fontFamily: "Poppins, sans-serif" }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="bg-white rounded-3xl p-8 w-full max-w-md animate-slideUp border-4 border-black relative overflow-hidden"
        style={{ boxShadow: "8px 8px 0px 0px rgba(0, 0, 0, 1)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-green-500 opacity-10 rounded-full -ml-12 -mb-12"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-all duration-200 border-2 border-black z-10"
          style={{ 
            boxShadow: isHoveredCancel ? "2px 2px 0px 0px rgba(0, 0, 0, 1)" : "none"
          }}
          onMouseEnter={() => setIsHoveredCancel(true)}
          onMouseLeave={() => setIsHoveredCancel(false)}
        >
          <X className="w-5 h-5 text-gray-700" />
        </button>

        {/* Icon with Pulse Animation */}
        <div className="flex justify-center mb-6 relative">
          <div className={`w-20 h-20 ${currentVariant.bg} rounded-2xl flex items-center justify-center border-3 border-black rotate-3 animate-pulse-subtle`}
            style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}>
            <Icon className={`w-10 h-10 ${currentVariant.iconColor}`} strokeWidth={2.5} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className={`w-20 h-20 ${currentVariant.bg} rounded-2xl opacity-30 animate-ping-slow`}></div>
          </div>
        </div>

        {/* Title with Gradient */}
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4 text-gray-900 tracking-tight">
          {title}
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 text-base mb-6 leading-relaxed">
          {message}
        </p>

        {/* Checklist with Enhanced Styling */}
        {checklist.length > 0 && (
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 mb-6 border-3 border-black"
            style={{ boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 1)" }}>
            <ul className="space-y-3">
              {checklist.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 text-sm text-gray-800 animate-slideInLeft"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="shrink-0 mt-0.5 w-6 h-6 bg-cyan-500 rounded-lg flex items-center justify-center border-2 border-black">
                    <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="font-semibold flex-1">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons with Enhanced Interactions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            onMouseEnter={() => setIsHoveredCancel(true)}
            onMouseLeave={() => setIsHoveredCancel(false)}
            className="flex-1 px-6 py-4 rounded-xl border-3 border-black bg-white hover:bg-gray-50 text-gray-900 font-bold text-base transition-all duration-200 transform hover:-translate-y-1"
            style={{ 
              boxShadow: isHoveredCancel 
                ? "6px 6px 0px 0px rgba(0, 0, 0, 1)" 
                : "4px 4px 0px 0px rgba(0, 0, 0, 1)"
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            onMouseEnter={() => setIsHoveredConfirm(true)}
            onMouseLeave={() => setIsHoveredConfirm(false)}
            className={`flex-1 px-6 py-4 rounded-xl border-3 border-black text-white font-bold text-base transition-all duration-200 transform hover:-translate-y-1 ${
              confirmColor === "green"
                ? "bg-emerald-500 hover:bg-emerald-600"
                : "bg-cyan-500 hover:bg-cyan-600"
            }`}
            style={{ 
              boxShadow: isHoveredConfirm 
                ? "6px 6px 0px 0px rgba(0, 0, 0, 1)" 
                : "4px 4px 0px 0px rgba(0, 0, 0, 1)"
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes pingSlow {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        @keyframes pulseSubtle {
          0%, 100% {
            transform: rotate(3deg) scale(1);
          }
          50% {
            transform: rotate(3deg) scale(1.05);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.3s ease-out forwards;
          opacity: 0;
        }
        .animate-ping-slow {
          animation: pingSlow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-pulse-subtle {
          animation: pulseSubtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

// Demo Component
export default function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-cyan-100 flex items-center justify-center p-4">
      <button
        onClick={() => setShowModal(true)}
        className="px-8 py-4 bg-cyan-500 text-white font-bold text-lg rounded-xl border-4 border-black transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
        style={{ boxShadow: "6px 6px 0px 0px rgba(0, 0, 0, 1)" }}
      >
        Open Modal
      </button>

      {showModal && (
        <ConfirmationModal
          title="Delete Account?"
          message="This action cannot be undone. All your data will be permanently removed from our servers."
          checklist={[
            "Your profile will be deleted",
            "All projects will be removed",
            "Subscription will be cancelled",
            "Recovery won't be possible"
          ]}
          confirmLabel="Yes, Delete"
          cancelLabel="Cancel"
          confirmColor="cyan"
          variant="warning"
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            alert("Confirmed!");
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}