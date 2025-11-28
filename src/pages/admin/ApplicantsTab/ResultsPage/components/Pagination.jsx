import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  indexOfFirstRow,
  indexOfLastRow,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
}) => {
  return (
    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-sm">
          <p className="text-gray-700">
            Showing <span className="font-semibold">{Math.min(indexOfFirstRow + 1, totalItems)}</span> to{" "}
            <span className="font-semibold">{Math.min(indexOfLastRow, totalItems)}</span> of{" "}
            <span className="font-semibold">{totalItems}</span> examinees
          </p>
          <select 
            value={rowsPerPage} 
            onChange={onRowsPerPageChange}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => onPageChange(currentPage - 1)} 
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                    onClick={() => onPageChange(pageNumber)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === pageNumber
                        ? "bg-cyan-600 text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return (
                  <span key={pageNumber} className="px-2 py-1.5 text-gray-400 text-sm">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>
          
          <button 
            onClick={() => onPageChange(currentPage + 1)} 
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;