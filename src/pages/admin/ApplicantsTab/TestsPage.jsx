import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAllExaminers } from "../../../../api/api";
import {
  Search,
  Filter,
  Download,
  X,
  FileText,
  Calendar,
  Building2,
  Mail,
} from "lucide-react";
import ConfirmationModal from "@/components/ConfimationModal";

// Custom hook for media queries
function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

function TestsPage() {
  const isMobile = useMediaQuery("(max-width:640px)");
  const isTablet = useMediaQuery("(max-width:1024px)");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  //modal for csv
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    dateFrom: "",
    dateTo: "",
  });

  const fetchAllExaminers = async () => {
    try {
      setIsDataLoading(true);
      const res = await getAllExaminers();
      setData(res);
      setAllData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch examiners");
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExaminers();
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

    // Apply date range filter - using created_at for accurate filtering
    if (newFilters.dateFrom) {
      const fromDate = new Date(newFilters.dateFrom);
      fromDate.setHours(0, 0, 0, 0); // Start of day

      filtered = filtered.filter((item) => {
        if (!item.created_at) return false;
        const itemDate = new Date(item.created_at);
        return itemDate >= fromDate;
      });
    }

    if (newFilters.dateTo) {
      const toDate = new Date(newFilters.dateTo);
      toDate.setHours(23, 59, 59, 999); // End of day

      filtered = filtered.filter((item) => {
        if (!item.created_at) return false;
        const itemDate = new Date(item.created_at);
        return itemDate <= toDate;
      });
    }

    setData(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      department: "",
      dateFrom: "",
      dateTo: "",
    };
    setFilters(clearedFilters);
    setSearchQuery("");
    setData(allData);
    setCurrentPage(1);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ["ID", "Name", "Email", "Department", "Date", "Time"];
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        [
          row.id,
          `"${row.examiner_name}"`,
          row.email,
          row.department,
          row.date,
          row.time,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `examiners_${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const uniqueDepartments = [
    ...new Set(
      allData.map((item) => item.department).filter((dept) => dept !== "N/A")
    ),
  ];
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

  // Mobile Card Component
  const MobileCard = ({ examiner }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-4 mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-800 mb-1 truncate">
            {examiner.examiner_name || "N/A"}
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{examiner.email || "N/A"}</span>
          </p>
        </div>
        <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded ml-2 shrink-0">
          #{examiner.id}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-700 truncate">
            {examiner.department || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-700">{examiner.date || "N/A"}</span>
          <span className="text-slate-500 font-mono">
            {examiner.time || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );

  // Tablet Card Component - More compact than mobile
  const TabletCard = ({ examiner }) => (
    <div className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              #{examiner.id}
            </span>
            <p className="text-sm font-semibold text-slate-800 truncate">
              {examiner.examiner_name || "N/A"}
            </p>
          </div>
          <p className="text-xs text-slate-500 flex items-center gap-1 truncate mb-2">
            <Mail className="w-3 h-3 shrink-0" />
            <span className="truncate">{examiner.email || "N/A"}</span>
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Building2 className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-700 truncate">
            {examiner.department || "N/A"}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className="text-slate-700">{examiner.date || "N/A"}</span>
          <span className="text-slate-500 font-mono">
            {examiner.time || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {showModal && (
        <ConfirmationModal
          title="Export to CSV?"
          message="Do you want to export this as csv?"
          confirmLabel="Export"
          cancelLabel="Cancel"
          onClose={() => setShowModal(false)}
          onConfirm={handleExport}
          confirmColor="green"
        />
      )}

      <div className="min-h-screen bg-white px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl text-cyan-700 mb-1 sm:mb-2 tracking-tight">
              Examinees
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm">
              Total: <span className="font-semibold">{data.length}</span>{" "}
              examinees
            </p>
          </div>

          {/* Controls */}
          <div className="mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#217486]/60" />
                <input
                  type="text"
                  placeholder={
                    isMobile
                      ? "Search..."
                      : "Search by name, email, department..."
                  }
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="border border-slate-200 p-2.5 sm:p-3 pl-9 sm:pl-10 pr-4 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486] transition-all text-xs sm:text-sm"
                />
              </div>

              {/* Filter and Export Buttons */}
              <div className="flex gap-2 sm:gap-3">
                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 rounded-lg font-medium transition-all text-xs sm:text-sm whitespace-nowrap flex-1 sm:flex-initial justify-center ${
                    showFilters || activeFilterCount > 0
                      ? "bg-[#217486] text-white shadow-md"
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Filter className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="bg-white text-[#217486] text-xs font-bold px-1.5 sm:px-2 py-0.5 rounded-full min-w-5ß text-center">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Export Button */}
                <button
                  onClick={() => setShowModal(true)}
                  disabled={data.length === 0}
                  className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2.5 sm:py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all text-xs sm:text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-initial justify-center"
                >
                  <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Export</span>
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                  <select
                    value={filters.department}
                    onChange={(e) =>
                      handleFilterChange("department", e.target.value)
                    }
                    className="border border-slate-200 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486] bg-white"
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                  <div className="hidden lg:block"></div>
                  <input
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) =>
                      handleFilterChange("dateFrom", e.target.value)
                    }
                    placeholder="From Date"
                    className="border border-slate-200 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
                  />

                  <input
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) =>
                      handleFilterChange("dateTo", e.target.value)
                    }
                    placeholder="To Date"
                    className="border border-slate-200 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
                  />

                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all text-xs sm:text-sm"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Clear All
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Content Area */}
          {isDataLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-12 sm:p-16 flex flex-col items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-[#217486]/30 border-t-[#217486] rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 text-sm sm:text-base">
                Loading examiners...
              </p>
            </div>
          ) : data.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 sm:p-12 lg:p-16 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400" />
              </div>
              <p className="text-slate-700 font-semibold text-base sm:text-lg mb-2">
                No Examiners Found
              </p>
              <p className="text-slate-500 text-xs sm:text-sm max-w-md px-4">
                {searchQuery || activeFilterCount > 0
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no examiners available at the moment."}
              </p>
              {(searchQuery || activeFilterCount > 0) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-[#217486] text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-[#1a5d6d] transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {isMobile ? (
                // Mobile View - Single Column Cards
                <div className="p-3 sm:p-4">
                  {currentData.map((examiner) => (
                    <MobileCard key={examiner.id} examiner={examiner} />
                  ))}
                </div>
              ) : isTablet ? (
                // Tablet View - Two Column Grid
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentData.map((examiner) => (
                    <TabletCard key={examiner.id} examiner={examiner} />
                  ))}
                </div>
              ) : (
                // Desktop View - Full Table
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-cyan-700 text-white">
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Examinee
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 lg:px-6 py-3 lg:py-4 text-left text-xs font-semibold uppercase tracking-wider">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentData.map((row) => (
                        <tr
                          key={row.id}
                          className="hover:bg-[#217486]/5 transition-colors"
                        >
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className="text-xs sm:text-sm font-mono text-slate-600">
                              {row.id}
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <div className="flex items-center gap-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-xs sm:text-sm font-semibold text-slate-800 truncate">
                                  {row.examiner_name || "N/A"}
                                </p>
                                <p className="text-xs text-slate-500 truncate">
                                  {row.email || "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className="inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-medium max-w-full">
                              <Building2 className="w-3 h-3 shrink-0" />
                              <span className="truncate">
                                {row.department || "N/A"}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
                              <Calendar className="w-3 lg:w-3.5 lg:h-3.5 h-3 shrink-0" />
                              <span className="truncate">
                                {row.date || "N/A"}
                              </span>
                            </span>
                          </td>
                          <td className="px-4 lg:px-6 py-3 lg:py-4">
                            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-slate-600">
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
              )}

              {/* Pagination Footer */}
              <div className="bg-slate-50 px-3 sm:px-4 lg:px-6 py-3 sm:py-4 border-t border-slate-100">
                {/* Mobile Pagination */}
                {isMobile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {indexOfFirstRow + 1}-
                          {Math.min(indexOfLastRow, data.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-800">
                          {data.length}
                        </span>
                      </p>
                      <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#217486]/30 bg-white"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>

                      <div className="px-3 py-2 bg-cyan-700 text-white rounded-lg text-xs font-medium min-w-[60px] text-center">
                        {currentPage} / {totalPages}
                      </div>

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ) : (
                  // Desktop & Tablet Pagination
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                      <p className="text-slate-600 whitespace-nowrap">
                        Showing{" "}
                        <span className="font-semibold text-slate-800">
                          {Math.min(indexOfLastRow, data.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-800">
                          {data.length}
                        </span>
                      </p>
                      <select
                        value={rowsPerPage}
                        onChange={handleRowsPerPageChange}
                        className="border border-slate-200 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 bg-white"
                      >
                        <option value={5}>5 per page</option>
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-2 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Previous
                      </button>

                      <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, i) => {
                          const pageNumber = i + 1;
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
                                className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${
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
                              <span
                                key={pageNumber}
                                className="px-1 sm:px-2 py-1.5 text-slate-400 text-xs sm:text-sm"
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
                        className="px-2 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TestsPage;
