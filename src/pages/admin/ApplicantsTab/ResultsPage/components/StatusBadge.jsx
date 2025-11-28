import React from "react";
import { CheckCircle, XCircle, Clock as ClockIcon } from "lucide-react";

const StatusBadge = ({ status }) => {
  const statusConfig = {
    passed: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-200",
    },
    failed: {
      icon: XCircle,
      className: "bg-red-100 text-red-800 border-red-200",
    },
    completed: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-800 border-green-200",
    },
    abandoned: {
      icon: XCircle,
      className: "bg-red-100 text-red-800 border-red-200",
    },
    pending: {
      icon: ClockIcon,
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    "in progress": {
      icon: ClockIcon,
      className: "bg-blue-100 text-blue-800 border-blue-200",
    },
  };

  const config = statusConfig[status?.toLowerCase()] || {
    icon: ClockIcon,
    className: "bg-gray-100 text-gray-800 border-gray-200",
  };
  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      <IconComponent className="w-3 h-3" />
      {status}
    </span>
  );
};

export default StatusBadge;