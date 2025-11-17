import { Building2, Calendar } from "lucide-react";
import { getStatusIcon, getStatusColor } from "../utils/statusUtils";

function ResultsTable({ data }) {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const StatusIcon = ({ status }) => {
    const Icon = getStatusIcon(status);
    return Icon ? <Icon className="w-4 h-4" /> : null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-cyan-700 text-white">
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              Examinee
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              Department
            </th>
            <th className="px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              Quiz
            </th>
            <th className="px-2 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              Score
            </th>
            <th className="px-10 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              Status
            </th>
            <th className="px-12 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              Date
            </th>
            <th className="px-9 py-4 text-left text-xs font-semibold uppercase tracking-wider">
              Time
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row) => (
            <tr
              key={row.id}
              className="hover:bg-[#217486]/5 transition-colors"
            >
              <td className="px-6 py-4">
                <span className="text-sm font-mono text-slate-600">
                  {row.id}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800 truncate">
                      {row.examiner_name || "N/A"}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {row.email || "N/A"}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                  <Building2 className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{row.department || "N/A"}</span>
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-slate-700 truncate block">
                  {row.quiz_name || "N/A"}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm font-semibold text-slate-800">
                  {row.score || 0}
                </span>
              </td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    row.status
                  )}`}
                >
                  <StatusIcon status={row.status} />
                  {row.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="truncate">{formatDate(row.date)}</span>
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <span className="truncate font-mono">
                    {row.time || "N/A"}
                  </span>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResultsTable;