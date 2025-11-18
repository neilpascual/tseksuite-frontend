import { FileText } from "lucide-react";

function EmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-16 flex flex-col items-center justify-center text-center">
      <div className="bg-slate-100 p-4 rounded-full mb-4">
        <FileText className="w-10 h-10 text-slate-400" />
      </div>
      <p className="text-slate-700 font-semibold text-lg mb-2">
        No Results Found
      </p>
      <p className="text-slate-500 text-sm max-w-md">
        {hasActiveFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "There are no test results available at the moment."}
      </p>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="mt-4 px-4 py-2 bg-[#217486] text-white rounded-lg text-sm font-medium hover:bg-[#1a5d6d] transition-colors"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default EmptyState;