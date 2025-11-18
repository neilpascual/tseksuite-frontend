import { Building2, Calendar, Mail } from "lucide-react";

export default function ExamineesTable(props) {
  const {
    currentData,
    data,
    isMobile,
    currentPage,
    totalPages,
    rowsPerPage,
    indexOfFirstRow,
    indexOfLastRow,
    handlePageChange,
    handleRowsPerPageChange,
  } = props;

  const columns = [
    {
      label: "ID",
      className:
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider",
    },
    {
      label: "Examinee",
      className:
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider",
    },
    {
      label: "Department",
      className:
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider",
    },
    {
      label: "Date",
      className:
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider",
    },
    {
      label: "Time",
      className:
        "px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider",
    },
  ];

  const MobileCard = ({ examiner }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-800 mb-1">
            {examiner.examiner_name || "N/A"}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Mail className="w-3 h-3" />
            {examiner.email || "N/A"}
          </p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Building2 className="w-3 h-3 text-slate-400" />
          <span className="text-slate-700">{examiner.department || "N/A"}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className="text-slate-700">{examiner.date || "N/A"}</span>
          <span className="text-slate-500 font-mono ml-2">
            {examiner.time || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );

  const renderRow = (row) => (
    <>
      <td className="px-6 py-4">
        <span className="text-sm font-mono text-slate-600">{row.id}</span>
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
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
          <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{row.date || "N/A"}</span>
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
          <span className="truncate font-mono">{row.time || "N/A"}</span>
        </span>
      </td>
    </>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {isMobile ? (
        <div className="p-4">
          {currentData.map((examiner) => (
            <MobileCard key={examiner.id} examiner={examiner} />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-cyan-700 text-white">
                {columns.map((col, i) => (
                  <th key={i} className={col.className}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentData.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#217486]/5 transition-colors"
                >
                  {renderRow(row)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 ">
          <p className="text-sm text-slate-600">
            Showing{" "}
            {/* <span className="font-semibold text-slate-800">
              {indexOfFirstRow + 1}
            </span>{" "}
            to{" "} */}
            <span className="font-semibold text-slate-800">
              {Math.min(indexOfLastRow, data.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800">{data.length}</span>{" "}
            results
          </p>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                {n} per page
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Previous
          </button>

          <div className="flex gap-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNumber = i + 1;
              if (
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNumber
                        ? "bg-cyan-700 text-white"
                        : "text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="px-2 py-1.5 text-slate-400">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
