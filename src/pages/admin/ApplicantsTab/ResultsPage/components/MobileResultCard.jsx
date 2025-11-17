import { Building2, FileText, Calendar } from "lucide-react";
import { getStatusIcon, getStatusColor } from "../utils/statusUtils";

function MobileResultCard({ result }) {
  const StatusIcon = ({ status }) => {
    const Icon = getStatusIcon(status);
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-start mb-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 mb-1">
            {result.examiner_name || "N/A"}
          </p>
          <p className="text-xs text-slate-500">{result.email || "N/A"}</p>
        </div>
        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-1 py-1 rounded">
          #{result.id}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Building2 className="w-3 h-3 text-slate-400" />
          <span className="text-slate-700">{result.department || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <FileText className="w-3 h-3 text-slate-400" />
          <span className="text-slate-700">{result.quiz_name || "N/A"}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span className="text-slate-700">{result.date || "N/A"}</span>
            <span className="text-slate-500 font-mono ml-2">
              {result.time || "N/A"}
            </span>
          </div>
          <span className="text-sm font-semibold text-slate-800">
            Score: {result.score || 0}
          </span>
        </div>
        <div className="pt-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              result.status
            )}`}
          >
            <StatusIcon status={result.status} />
            {result.status}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MobileResultCard;