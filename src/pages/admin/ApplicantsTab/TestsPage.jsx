import Table from "../../../components/admin/Table";
import React from 'react'
import { Search } from "lucide-react";
import { Filter } from "lucide-react";



function TestsPage() {
  return (
    <div className='h-screen w-full px-3 sm:px-6 md:px-8 py-6'>
      <div className='mb-20'>
        {/* Header */}
         <h1 className="text-[#2E99B0] text-md sm:text-md md:text-xl lg:text-2xl  xl:text-3xl font-['Poppins']">
        Tests
        </h1>
        <p>
          This table is for test results
        </p>
      </div>
    <div className='flex mb-4 '>
        {/* searchbar */}
        <div className="relative w-full mr-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2E99B0]" />
          <input
            type="text"
            placeholder="Search"
            className="border border-[#D1D1D1] group-hover:border-[#2E99B0] p-3 pl-10 rounded-lg w-full bg-white focus:outline-none"
          />
        </div>
        {/* buttons */}
          <button className="group flex border border-[#D1D1D1] py-2 px-6 rounded-md hover:shadow-2xl hover:border-[#2E99B0] hover:text-[#2E99B0] transition-shadow duration-200 items-center bg-white font-['Poppins']">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#D1D1D1] group-hover:text-[#2E99B0] transition-colors duration-200" />
            <span className="ml-2 hidden sm:inline text-[#D1D1D1] group-hover:text-[#2E99B0]">
              Date
            </span>
          </button>
    </div>
      {/* Table */}
        <div className="rounded-lg shadow-md bg-white overflow-x-auto">
          <div className="min-w-[350px] sm:min-w-0">
              {/* mock table */}
              <Table />
          </div>
        </div>
    </div>
  )
}

export default TestsPage
