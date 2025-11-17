import { CheckCircle2, XCircle, Clock } from "lucide-react";

/**
 * Get the icon component for a given status
 * @param {string} status - The status string
 * @returns {Component|null} - Lucide icon component or null
 */
export const getStatusIcon = (status) => {
  switch (status) {
    case "Passed":
      return CheckCircle2;
    case "Failed":
      return XCircle;
    case "Pending":
      return Clock;
    default:
      return null;
  }
};

/**
 * Get the CSS classes for status badge styling
 * @param {string} status - The status string
 * @returns {string} - Tailwind CSS classes
 */
export const getStatusColor = (status) => {
  switch (status) {
    case "COMPLETED":
    case "Completed":
      return "bg-[#217486]/10 text-[#217486] border-[#217486]/30";
    case "ABANDONED":
    case "Abandoned":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Passed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Failed":
      return "bg-red-50 text-red-700 border-red-200";
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
};