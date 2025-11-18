import React from "react";
import { Separator } from "../ui/separator";

function MobileScrollableCards({ candidates }) {
  return (
    <div className="flex flex-col items-center gap-4 ">
      {candidates.map((row) => (
        <div
          key={row.id}
          className="w-full max-w-sm bg-white border border-gray-200 shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Header with Score Badge */}
          <div className="bg-linear-to-r from-[#2E99B0] to-[#3BAAC4] p-4 flex items-center justify-between">
            <div className="text-white">
              <p className="text-xs font-medium opacity-90">Candidate ID</p>
              <p className="text-sm font-semibold">{row.id}</p>
            </div>
            <div className="bg-white rounded-full px-4 py-2 shadow-md">
              <p className="text-[#2E99B0] text-xl font-bold">{row.score}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            {/* Candidate Name */}
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                  Candidate
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {row.applicant_name}
                </p>
              </div>
            </div>

            <Separator className="my-2" />

            {/* Department */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Department
              </p>
              <span className="bg-[#2E99B0]/10 text-[#2E99B0] text-xs font-medium px-3 py-1 rounded-full">
                {row.department}
              </span>
            </div>

            <Separator className="my-2" />

            {/* Date */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Date
              </p>
              <p className="text-sm text-gray-700 font-medium">{row.date}</p>
            </div>
          </div>

          {/* Optional Action Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-100">
            <button className="w-full text-[#2E99B0] text-sm font-medium hover:text-[#267A8E] transition-colors">
              View Details →
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default MobileScrollableCards;
