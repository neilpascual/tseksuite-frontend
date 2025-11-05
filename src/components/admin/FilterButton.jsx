import React from 'react';
import { Filter } from 'lucide-react'; // Lucide provides a nice filter icon

function FilterButton() {
  return (
    <button className="group flex border border-[#D1D1D1] py-2 px-6 rounded-md hover:shadow-2xl hover:border-[#2E99B0] transition-shadow duration-200 items-center bg-white font-['Poppins']">
      <Filter className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#D1D1D1] group-hover:text-[#2E99B0]" />
      <span className="ml-2 hidden sm:inline text-[#D1D1D1] group-hover:text-[#2E99B0]">
        Filter
      </span>
    </button>
  );
}

export default FilterButton;
