import React from "react";
import { Separator } from "../ui/separator";

function MobileScrollableCards({candidates}) {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <p className="text-slate-700 font-semibold text-base sm:text-lg mb-2">
          No Candidates Found
        </p>
        <p className="text-slate-500 text-xs sm:text-sm text-center max-w-md">
          There are no candidates available at the moment.
        </p>
      </div>
    );
  }

  // Get the latest 5 entries (last 5 from the array) - SAME as CandidateTable
  const displayData = candidates.slice(-5).reverse();

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 p-3 sm:p-4 md:p-6">
      {displayData.map((row) => (
        <div
          key={row.id}
          className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Header with Score Badge */}
          <div className="bg-linear-to-r from-[#2E99B0] to-[#3BAAC4] p-3 sm:p-4 flex items-center justify-between">
            <div className="text-white flex-1 min-w-0">
              <p className="text-xs font-medium opacity-90">Candidate ID</p>
              <p className="text-sm sm:text-base font-semibold truncate">{row.id}</p>
            </div>
            <div className="bg-white rounded-full px-3 sm:px-4 py-1.5 sm:py-2 shadow-md shrink-0">
              <p className="text-[#2E99B0] text-lg sm:text-xl font-bold">{row.score}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            {/* Candidate Name */}
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Candidate
                </p>
                <p className="text-sm sm:text-base font-semibold text-gray-800 wrap-break-word">
                  {row.examiner_name || row.applicant_name || row.candidate_name || row.name || "N/A"}
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Department */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide shrink-0">
                Department
              </p>
              <span className="bg-[#2E99B0]/10 text-[#2E99B0] text-xs font-medium px-2.5 sm:px-3 py-1 rounded-full w-fit">
                {row.department}
              </span>
            </div>

            <Separator className="my-2" />

            {/* Date */}
            <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
              <p className="text-xs text-gray-500 uppercase tracking-wide shrink-0">
                Date
              </p>
              <p className="text-xs sm:text-sm text-gray-700 font-medium">
                {row.date}
              </p>
            </div>
          </div>

          {/* Optional Action Footer */}
          <div className="bg-gray-50 px-3 sm:px-4 py-2.5 sm:py-3 border-t border-gray-100">
            <button className="w-full text-[#2E99B0] text-xs sm:text-sm font-medium hover:text-[#267A8E] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E99B0]/30 rounded py-1">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MobileScrollableCards
