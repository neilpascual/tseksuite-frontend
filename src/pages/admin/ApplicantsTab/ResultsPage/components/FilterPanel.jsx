import { X } from "lucide-react";

function FilterPanel({
  filters,
  uniqueDepartments,
  uniqueQuizzes,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      <select
        value={filters.department}
        onChange={(e) => onFilterChange("department", e.target.value)}
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
        onChange={(e) => onFilterChange("quiz", e.target.value)}
        className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
      >
        <option value="">All Quizzes</option>
        {uniqueQuizzes.map((quiz) => (
          <option key={quiz} value={quiz}>
            {quiz}
          </option>
        ))}
      </select>

      <div className="px-10"></div>

      <input
        type="date"
        value={filters.dateFrom}
        onChange={(e) => onFilterChange("dateFrom", e.target.value)}
        placeholder="From Date"
        className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
      />

      <input
        type="date"
        value={filters.dateTo}
        onChange={(e) => onFilterChange("dateTo", e.target.value)}
        placeholder="To Date"
        className="border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
      />

      {activeFilterCount > 0 && (
        <button
          onClick={onClearFilters}
          className="col-span-full sm:col-span-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all text-sm"
        >
          <X className="w-4 h-4" />
          Clear All
        </button>
      )}
    </div>
  );
}

export default FilterPanel;