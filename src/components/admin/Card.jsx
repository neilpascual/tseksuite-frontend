// import React from "react";

// function DashboardCard({ title, value }) {
//   return (
//     <div className="border rounded-lg p-3 border-[#EFF0F6] shadow-md sm:py-2 sm:px-6 md:py-4 md:px-6 lg:py-5 lg:px-10 flex-1 min-w-[200px]">
//       <div className="mb-2">
//         <p className="text-[#2E99B0] text-sm sm:text-xl font-medium mb-2">
//           {title}
//         </p>
//         <p className="text-xl sm:text-2xl font-bold text-end">{value}</p>
//       </div>
//     </div>
//   );
// }

// export default DashboardCard;

import React from "react";

function DashboardCard({ title, value }) {
  return (
    <div className="group relative border rounded-2xl p-6 md:p-8 border-gray-100 bg-white shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 flex-1 min-w-[200px] overflow-hidden">
      {/* Decorative background gradient */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2E99B0]/5 to-transparent rounded-full blur-2xl -translate-y-8 translate-x-8 group-hover:scale-150 transition-transform duration-500"></div>

      {/* Floating icon background on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-10 transition-all duration-300 group-hover:scale-110">
        <svg
          className="w-16 h-16 text-[#2E99B0]"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      </div>

      {/* Left accent bar */}
      <div className="absolute top-0 left-0 w-1.5 h-0 bg-gradient-to-b from-[#2E99B0] via-[#2E99B0] to-[#1a5d6d] group-hover:h-full transition-all duration-500 ease-out rounded-full"></div>

      <div className="relative z-10">
        {/* Title */}
        <div className="mb-4">
          <p className="text-[#2E99B0] text-xs md:text-sm font-bold uppercase tracking-wider mb-1 group-hover:tracking-widest transition-all duration-300">
            {title}
          </p>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#2E99B0] to-transparent group-hover:w-20 transition-all duration-300"></div>
        </div>

        {/* Value */}
        <div className="flex items-end justify-end">
          <p className="text-4xl md:text-5xl font-black text-gray-900 text-end tabular-nums tracking-tight group-hover:text-[#2E99B0] transition-colors duration-300">
            {value}
          </p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-[#2E99B0]/30 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-0.5 h-full bg-gradient-to-t from-[#2E99B0]/30 to-transparent"></div>
      </div>

      {/* Shimmer effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
      </div>
    </div>
  );
}

export default DashboardCard;
