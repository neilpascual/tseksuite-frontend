import React from "react";
import { AlertCircle } from "lucide-react";

const EmptyState = ({ searchQuery, activeFilterCount, onClearFilters }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 sm:p-12 flex flex-col items-center justify-center text-center">
      <div className="bg-gray-100 p-3 rounded-full mb-4">
        <AlertCircle className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-900 font-semibold text-lg mb-2">No Examinees Found</p>
      <p className="text-gray-600 text-sm max-w-md mb-4">
        {searchQuery || activeFilterCount > 0 
          ? "No results match your search criteria. Try adjusting your filters or search term." 
          : "There are no examinees available at the moment."}
      </p>
      {(searchQuery || activeFilterCount > 0) && (
        <button 
          onClick={onClearFilters}
          className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-700 transition-colors"
        >
          Clear Search & Filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;