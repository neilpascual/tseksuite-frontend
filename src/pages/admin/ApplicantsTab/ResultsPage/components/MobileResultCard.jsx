import { Building2, FileText, Calendar, User, Mail, Hash } from "lucide-react";
import { getStatusIcon, getStatusColor } from "../utils/statusUtils";

function MobileResultCard({ result, isTablet = false }) {
  const StatusIcon = ({ status }) => {
    const Icon = getStatusIcon(status);
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  // Tablet Layout - More compact and organized
  if (isTablet) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          {/* Left Section - User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <User className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {result.examiner_name || "N/A"}
                </p>
                <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {result.email || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[120px]">{result.department || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">#{result.id}</span>
              </div>
            </div>
          </div>

          {/* Right Section - Quiz & Status */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-sm font-medium text-slate-800 truncate max-w-[150px]">
                  {result.quiz_name || "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>{result.date || "N/A"}</span>
                <span>•</span>
                <span className="font-mono">{result.time || "N/A"}</span>
              </div>
            </div>

            {/* Score & Status */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs text-slate-600">Score</span>
                <div className="text-lg font-bold text-[#217486]">
                  {result.score || 0}
                </div>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                  result.status
                )}`}
              >
                <StatusIcon status={result.status} />
                <span className="whitespace-nowrap">{result.status}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout - Original but improved
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-3 mb-3 pb-3 border-b border-slate-100">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-slate-400" />
            <p className="text-sm font-semibold text-slate-800 truncate">
              {result.examiner_name || "N/A"}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Mail className="w-3 h-3" />
            <span className="truncate">{result.email || "N/A"}</span>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded shrink-0">
          #{result.id}
        </span>
      </div>

      {/* Info Grid */}
      <div className="space-y-2.5">
        {/* Department */}
        <div className="flex items-center gap-2 text-xs">
          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 truncate">{result.department || "N/A"}</span>
        </div>

        {/* Quiz Name */}
        <div className="flex items-center gap-2 text-xs">
          <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-700 truncate">{result.quiz_name || "N/A"}</span>
        </div>

        {/* Date & Time */}
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-0">
            <span className="text-slate-700 truncate">{result.date || "N/A"}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-mono text-[10px]">
              {result.time || "N/A"}
            </span>
          </div>
        </div>

        {/* Score & Status Section */}
        <div className="pt-2 mt-2 border-t border-slate-100">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            {/* Score */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-600">Score:</span>
              <span className="text-base font-bold text-[#217486]">
                {result.score || 0}
              </span>
            </div>

            {/* Status Badge */}
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(
                result.status
              )}`}
            >
              <StatusIcon status={result.status} />
              <span className="whitespace-nowrap">{result.status}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileResultCard;