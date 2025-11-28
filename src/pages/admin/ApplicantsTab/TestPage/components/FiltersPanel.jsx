import React from "react";
import { Search, Filter, Download, X } from "lucide-react";

const FiltersPanel = ({
  searchQuery,
  filters,
  uniqueDepartments,
  activeFilterCount,
  showFilters,
  onSearchChange,
  onFilterChange,
  onClearFilters,
  onToggleFilters,
  onExport,
  hasData
}) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onToggleFilters}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
              showFilters || activeFilterCount > 0 
                ? "bg-cyan-600 text-white shadow-sm" 
                : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-cyan-600 text-xs font-bold px-2 py-0.5 rounded-full min-w-5 text-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            onClick={onExport}
            disabled={!hasData}
            className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Filters</h3>
            {activeFilterCount > 0 && (
              <button 
                onClick={onClearFilters}
                className="text-xs text-cyan-600 hover:text-cyan-700 font-medium"
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Department</label>
              <select
                value={filters.department}
                onChange={(e) => onFilterChange("department", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
              >
                <option value="">All Departments</option>
                {uniqueDepartments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">From Date</label>
              <input 
                type="date" 
                value={filters.dateFrom} 
                onChange={(e) => onFilterChange("dateFrom", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">To Date</label>
              <input 
                type="date" 
                value={filters.dateTo} 
                onChange={(e) => onFilterChange("dateTo", e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-end">
              {activeFilterCount > 0 && (
                <button 
                  onClick={onClearFilters}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors w-full justify-center"
                >
                  <X className="w-4 h-4" />
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltersPanel;