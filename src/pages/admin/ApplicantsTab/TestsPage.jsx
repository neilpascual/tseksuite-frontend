import { useMediaQuery } from "@mui/material";
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
  User,
} from "lucide-react";

// import ExaminerTable from "@/components/applicant/ui/table";
import ExamineesTable from "@/components/applicant/tables/ExamineesTable";

function TestsPage() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filters, setFilters] = useState({
    department: "",
    dateFrom: "",
    dateTo: "",
  });
  const activeFilterCount = Object.values(filters).filter((v) => v).length;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const [showModal, setShowModal] = useState(false);

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

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <>
      {showModal && (
        <ConfirmationModal
          title="Proceed to Next Step?"
          message="Do you want to export this as csv?"
          confirmLabel="Yes, Proceed"
          cancelLabel="Cancel"
          onClose={() => setShowModal(false)}
          onConfirm={() => {
            setShowModal(false);
            handleExport();
          }}
          confirmColor="green"
        />
      )}
      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8 mt-15 sm:mt-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-3xl text-cyan-700 mb-2 tracking-tight">
              Examinees
            </h1>
          </div>
          {/* Controls */}
          <div className="mb-6">
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
                onClick={() => setShowModal(true)}
                disabled={data.length === 0}
                className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
            {/* Filter Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                <div className="px-10"></div>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
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
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all text-sm"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}
              </div>
            )}
          </div>
          {/* Content Area */}
          {isDataLoading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center">
              <div className="w-12 h-12 border-4 border-[#217486]/30 border-t-[#217486] rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600">Loading examiners...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
              <div className="bg-slate-100 p-4 rounded-full mb-4">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <p className="text-slate-700 font-semibold text-lg mb-2">
                No Examiners Found
              </p>
              <p className="text-slate-500 text-sm max-w-md">
                {searchQuery || activeFilterCount > 0
                  ? "Try adjusting your search or filters to find what you're looking for."
                  : "There are no examiners available at the moment."}
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
            <ExamineesTable
              currentData={currentData}
              data={data}
              isMobile={isMobile}
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              indexOfFirstRow={indexOfFirstRow}
              indexOfLastRow={indexOfLastRow}
              handlePageChange={handlePageChange}
              handleRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default TestsPage;
