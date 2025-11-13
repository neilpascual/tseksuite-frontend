import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Download,
  X,
  Calendar,
  User,
  Mail,
  Building2,
  FileText,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { getAllResults } from "../../../../api/api";

function ResultsPage() {
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    quiz: "",
    dateFrom: "",
    dateTo: "",
  });

  // Fetch all test results
  const fetchAllTests = async () => {
    try {
      setIsLoading(true);
      const res = await getAllResults();
      setData(res);
      setAllData(res);
    } catch (error) {
      console.error(error);
      // toast.error("Failed to fetch results");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllTests();
  }, []);

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    applyFilters(filters, query);
  };

  // Filter handler
  const applyFilters = (newFilters, searchTerm = searchQuery) => {
    let filtered = [...allData];

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply department filter
    if (newFilters.department) {
      filtered = filtered.filter(
        (item) => item.department === newFilters.department
      );
    }

    // Apply status filter
    if (newFilters.status) {
      filtered = filtered.filter((item) => item.status === newFilters.status);
    }

    // Apply quiz filter
    if (newFilters.quiz) {
      filtered = filtered.filter((item) => item.quiz_name === newFilters.quiz);
    }

    // Apply date range filter
    if (newFilters.dateFrom) {
      filtered = filtered.filter(
        (item) => new Date(item.date) >= new Date(newFilters.dateFrom)
      );
    }
    if (newFilters.dateTo) {
      filtered = filtered.filter(
        (item) => new Date(item.date) <= new Date(newFilters.dateTo)
      );
    }

    setData(filtered);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filtering
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      department: "",
      status: "",
      quiz: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    setCurrentPage(1);
    setData(allData);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = [
      "ID",
      "Name",
      "Email",
      "Department",
      "Quiz",
      "Score",
      "Status",
      "Date",
    ];
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.id,
          `"${row.examiner_name}"`,
          row.email,
          row.department,
          `"${row.quiz_name}"`,
          row.score,
          row.status,
          row.date,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `results_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Passed":
        return <CheckCircle2 className="w-4 h-4" />;
      case "Failed":
        return <XCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status) => {
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

  const uniqueDepartments = [
    ...new Set(allData.map((item) => item.department)),
  ];
  const uniqueQuizzes = [...new Set(allData.map((item) => item.quiz_name))];
  const activeFilterCount = Object.values(filters).filter((v) => v).length;

  // Pagination calculations
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#217486] mb-2 tracking-tight">
            Test Results
          </h1>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#217486]/60" />
              <input
                type="text"
                placeholder="Search by name, email, department..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="border border-slate-200 p-3 pl-10 pr-4 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486] transition-all text-sm"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-5 py-3 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                showFilters || activeFilterCount > 0
                  ? "bg-[#217486] text-white shadow-md"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-white text-[#217486] text-xs font-bold px-2 py-0.5 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Export Button */}
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all text-sm whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              <select
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
                className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              <select
                value={filters.quiz}
                onChange={(e) => handleFilterChange("quiz", e.target.value)}
                className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
              >
                <option value="">All Quizzes</option>
                {uniqueQuizzes.map((quiz) => (
                  <option key={quiz} value={quiz}>
                    {quiz}
                  </option>
                ))}
              </select>

              <div className="px-100"></div>

              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                placeholder="From Date"
                className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
              />

              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                placeholder="To Date"
                className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
              />

              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="col-span-full sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-[#217486]/30 border-t-[#217486] rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600">Loading results...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
            <div className="bg-slate-100 p-4 rounded-full mb-4">
              <FileText className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-700 font-semibold text-lg mb-2">
              No Results Found
            </p>
            <p className="text-slate-500 text-sm max-w-md">
              {searchQuery || activeFilterCount > 0
                ? "Try adjusting your search or filters to find what you're looking for."
                : "There are no test results available at the moment."}
            </p>
            {(searchQuery || activeFilterCount > 0) && (
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#217486] text-white rounded-lg text-sm font-medium hover:bg-[#1a5d6d] transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead>
                  <tr className="bg-gradient-to-r from-[#217486] to-[#1a5d6d] text-white">
                    <th className="w-20 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="w-64 px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Examinee
                    </th>
                    <th className="w-48 px-11 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Department
                    </th>
                    <th className="w-40 px-8 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Quiz
                    </th>
                    <th className="w-24 px-2 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Score
                    </th>
                    <th className="w-32 px-10 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-36 px-12 py-4 text-left text-xs font-semibold uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentData.map((row, index) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#217486]/5 transition-colors"
                    >
                      <td className="w-20 px-6 py-4">
                        <span className="text-sm font-mono text-slate-600">
                          {row.id}
                        </span>
                      </td>
                      <td className="w-64 px-6 py-4">
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
                      <td className="w-48 px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium">
                          <Building2 className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {row.department || "N/A"}
                          </span>
                        </span>
                      </td>
                      <td className="w-40 px-6 py-4">
                        <span className="text-sm text-slate-700 truncate block">
                          {row.quiz_name || "N/A"}
                        </span>
                      </td>
                      <td className="w-24 px-6 py-4">
                        <span className="text-sm font-semibold text-slate-800">
                          {row.score || 0}
                        </span>
                      </td>
                      <td className="w-32 px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            row.status
                          )}`}
                        >
                          {getStatusIcon(row.status)}
                          {row.status}
                        </span>
                      </td>
                      <td className="w-36 px-6 py-4">
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

            {/* Pagination Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <p className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-semibold text-slate-800">
                    {indexOfFirstRow + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-semibold text-slate-800">
                    {Math.min(indexOfLastRow, data.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-slate-800">
                    {data.length}
                  </span>{" "}
                  results
                </p>
                <select
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
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
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 &&
                        pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                            currentPage === pageNumber
                              ? "bg-[#217486] text-white"
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
                        <span
                          key={pageNumber}
                          className="px-2 py-1.5 text-slate-400"
                        >
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
        )}
      </div>
    </div>
  );
}

export default ResultsPage;
