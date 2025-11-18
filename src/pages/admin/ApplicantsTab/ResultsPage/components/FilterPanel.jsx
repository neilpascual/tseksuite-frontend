
import { X } from "lucide-react";

function FilterPanel({
  filters,
  uniqueDepartments,
  uniqueQuizzes,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
  isMobile,
}) {
  return (
    <div className="pt-3 sm:pt-4 border-t border-slate-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 sm:gap-3">
        {/* Department Select */}
        <div className="sm:col-span-1">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange("department", e.target.value)}
            className="w-full border border-slate-200 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486] bg-white"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Quiz Select */}
        <div className="sm:col-span-1">
          <select
            value={filters.quiz}
            onChange={(e) => onFilterChange("quiz", e.target.value)}
            className="w-full border border-slate-200 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486] bg-white"
          >
            <option value="">All Quizzes</option>
            {uniqueQuizzes.map((quiz) => (
              <option key={quiz} value={quiz}>
                {quiz}
              </option>
            ))}
          </select>
        </div>

        {/* Spacer - Only visible on large screens */}
        <div className="hidden lg:block"></div>

        {/* Date From */}
        <div className="sm:col-span-1">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            placeholder="From Date"
            className="w-full border border-slate-200 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
          />
        </div>

        {/* Date To */}
        <div className="sm:col-span-1">
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            placeholder="To Date"
            className="w-full border border-slate-200 p-2 sm:p-2.5 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
          />
        </div>

        {/* Clear Button */}
        {activeFilterCount > 0 && (
          <div className="sm:col-span-2 lg:col-span-5">
            <button
              onClick={onClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all text-xs sm:text-sm"
            >
              <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterPanel;