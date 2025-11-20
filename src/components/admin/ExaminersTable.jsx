import { useState } from "react";
import { Calendar, Building2, Mail } from "lucide-react";

function CandidateTable({
  candidates = [],
  headerCells = [],
  columns = [],
  tableName = "",
}) {
  // Get the latest 5 entries (last 5 from the array)
  const displayData = candidates.slice(-5).reverse();

  if (!candidates || candidates.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center">
        <div className="bg-slate-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
          <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
        </div>
        <p className="text-slate-700 font-semibold text-base sm:text-lg mb-2">
          No Data Found
        </p>
        <p className="text-slate-500 text-xs sm:text-sm max-w-md">
          There are no examiners available at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100">
        <h2 className="text-base sm:text-lg font-semibold text-cyan-700">{tableName}</h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-1">
          Showing <span className="font-semibold">5</span> latest examinees
        </p>
      </div>

      {/* Desktop Table View - Hidden on mobile */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-cyan-700 text-white">
              {headerCells.map((headCell) => (
                <th
                  key={headCell.id}
                  className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                >
                  {headCell.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayData.map((row) => (
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
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                    <span className="truncate">{row.email || "N/A"}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                    <Building2 className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{row.department || "N/A"}</span>
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      {row.date
                        ? new Date(row.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View - Shown on small/medium screens */}
      <div className="lg:hidden divide-y divide-slate-100">
        {displayData.map((row) => (
          <div
            key={row.id}
            className="p-4 sm:p-5 hover:bg-[#217486]/5 transition-colors"
          >
            {/* ID and Name */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 mb-1">
                  {row.examiner_name || "N/A"}
                </p>
                <span className="text-xs font-mono text-slate-500">
                  ID: {row.id}
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="text-sm text-slate-600 truncate">
                {row.email || "N/A"}
              </span>
            </div>

            {/* Department and Date */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium w-fit">
                <Building2 className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{row.department || "N/A"}</span>
              </span>
              
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-600 w-fit">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {row.date
                    ? new Date(row.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CandidateTable;